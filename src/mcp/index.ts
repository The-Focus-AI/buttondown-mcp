import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ButtondownAPI, IButtondownAPI } from "../api/client.js";
import { execSync } from "child_process";

async function getApiKey(): Promise<string> {
  const envKey = process.env.BUTTONDOWN_API_KEY;
  if (envKey) {
    return envKey;
  }

  try {
    const apiKey = execSync(
      'op read "op://Development/Buttondown API/notesPlain"',
      {
        encoding: "utf-8",
      }
    ).trim();
    return apiKey;
  } catch (error) {
    console.error(
      "Failed to get API key from 1Password. Make sure you're signed in and the item exists."
    );
    throw error;
  }
}

export class ButtondownMCPServer {
  private server: McpServer;
  private api: IButtondownAPI;

  constructor(api: IButtondownAPI) {
    this.api = api;
    this.server = new McpServer({
      name: "Buttondown",
      version: "1.0.0",
    });

    // Register tools
    this.registerTools();
  }

  private async ensureApiKey(): Promise<void> {
    if (!this.api.apiKey) {
      const apiKey = await getApiKey();
      this.api.apiKey = apiKey;
    }
  }

  private registerTools() {
    // List emails tool
    this.server.tool(
      "list_emails",
      "List all emails, optionally filtered by status (draft, scheduled, sent)",
      {
        status: z
          .enum(["draft", "scheduled", "sent"])
          .optional()
          .describe("Optional status to filter emails by"),
      },
      async ({ status }) => {
        await this.ensureApiKey();
        let response;

        switch (status) {
          case "draft":
            response = await this.api.listDrafts();
            break;
          case "scheduled":
            response = await this.api.listScheduledEmails();
            break;
          case "sent":
            response = await this.api.listSentEmails();
            break;
          default:
            // If no status specified, list all drafts by default
            response = await this.api.listDrafts();
        }

        // Format the response to be more readable
        const formattedEmails = response.results.map((email) => ({
          id: email.id,
          subject: email.subject || "Untitled",
          status: email.status,
          created: email.creation_date,
          scheduled_for: email.scheduled_for || null,
          publish_date: email.publish_date || null,
          analytics: email.analytics
            ? {
                recipients: email.analytics.recipients,
                opens: email.analytics.opens,
                clicks: email.analytics.clicks,
              }
            : null,
        }));

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(
                {
                  total: response.count,
                  emails: formattedEmails,
                },
                null,
                2
              ),
            },
          ],
        };
      }
    );

    // Create draft tool
    this.server.tool(
      "create_draft",
      "Create a new email draft in Buttondown with the specified content and optional title. This tool requires explicit user confirmation before proceeding as it will create a new draft in your Buttondown account.",
      {
        content: z
          .string()
          .describe("The main content/body of the email draft"),
        title: z
          .string()
          .optional()
          .describe("Optional title/subject for the email draft"),
        confirmed: z
          .boolean()
          .describe("Must be true to confirm the draft creation"),
      },
      async ({ content, title, confirmed }) => {
        if (!confirmed) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    error: "User confirmation required",
                    message:
                      "Please ask the user if they want to create this draft and set confirmed=true if they agree",
                    preview: {
                      title: title || "Untitled",
                      content_length: content.length,
                    },
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }
        await this.ensureApiKey();
        const response = await this.api.createDraft(content, title);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      }
    );

    // Get analytics tool
    this.server.tool(
      "get_analytics",
      "Retrieve analytics data for a specific email draft from Buttondown",
      {
        draftId: z
          .string()
          .describe("The ID of the email draft to get analytics for"),
      },
      async ({ draftId }) => {
        await this.ensureApiKey();
        const response = await this.api.getAnalytics(draftId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      }
    );

    // Schedule draft tool
    this.server.tool(
      "schedule_draft",
      "Schedule an existing email draft to be sent at a specific time. This tool requires explicit user confirmation before proceeding as it will modify the draft's status and schedule.",
      {
        draftId: z.string().describe("The ID of the email draft to schedule"),
        scheduledTime: z
          .string()
          .describe("When to send the email (ISO 8601 datetime format)"),
        confirmed: z
          .boolean()
          .describe("Must be true to confirm the scheduling"),
      },
      async ({ draftId, scheduledTime, confirmed }) => {
        if (!confirmed) {
          return {
            content: [
              {
                type: "text",
                text: JSON.stringify(
                  {
                    error: "User confirmation required",
                    message:
                      "Please ask the user if they want to schedule this draft and set confirmed=true if they agree",
                    preview: {
                      draftId,
                      scheduledTime,
                      localTime: new Date(scheduledTime).toLocaleString(),
                    },
                  },
                  null,
                  2
                ),
              },
            ],
          };
        }
        await this.ensureApiKey();
        const response = await this.api.scheduleDraft(draftId, scheduledTime);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(response, null, 2),
            },
          ],
        };
      }
    );
  }

  async start() {
    // Start receiving messages on stdin and sending messages on stdout
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }

  async stop() {
    // No explicit stop needed with stdio transport
  }
}

// Start the server if this is the main module
if (import.meta.url === new URL(process.argv[1], "file:").href) {
  let server: ButtondownMCPServer | undefined;

  getApiKey()
    .then((apiKey) => {
      const api = new ButtondownAPI(apiKey);
      server = new ButtondownMCPServer(api);

      // Handle graceful shutdown
      process.on("SIGINT", () => server?.stop());
      process.on("SIGTERM", () => server?.stop());

      return server.start();
    })
    .catch((error) => {
      console.error("Failed to start server:", error);
      process.exit(1);
    });
}
