import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { ButtondownAPI } from "../buttondown.js";
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
  private api: ButtondownAPI;

  constructor(api: ButtondownAPI) {
    this.api = api;
    this.server = new McpServer({
      name: "Buttondown",
      version: "1.0.0",
    });

    // Register tools
    this.registerTools();
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
      async (args: { status?: "draft" | "scheduled" | "sent" }) => {
        let response;
        if (args.status === "draft") {
          response = await this.api.getDrafts();
        } else if (args.status === "scheduled") {
          response = await this.api.getScheduledEmails();
        } else {
          response = await this.api.getEmails();
        }

        // Format the response to be more readable
        const formattedEmails = response.results.map((email) => ({
          id: email.id,
          subject: email.subject,
          status: email.status,
          created: email.creation_date,
          scheduled_for: email.scheduled_for,
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
      "Create a new email draft in Buttondown with the specified content and optional title",
      {
        content: z
          .string()
          .describe("The main content/body of the email draft"),
        title: z
          .string()
          .optional()
          .describe("Optional title/subject for the email draft"),
      },
      async (args: { content: string; title?: string }) => {
        const response = await this.api.createEmail({
          body: args.content,
          subject: args.title || "Untitled Draft",
          status: "draft",
        });
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
      async (args: { draftId: string }) => {
        const email = await this.api.getEmail(args.draftId);
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(email.analytics, null, 2),
            },
          ],
        };
      }
    );

    // Schedule draft tool
    this.server.tool(
      "schedule_draft",
      "Schedule an existing email draft to be sent at a specific time",
      {
        draftId: z.string().describe("The ID of the email draft to schedule"),
        scheduledTime: z
          .string()
          .describe("When to send the email (ISO 8601 datetime format)"),
      },
      async (args: { draftId: string; scheduledTime: string }) => {
        const response = await this.api.updateEmail(args.draftId, {
          scheduled_for: args.scheduledTime,
          status: "scheduled",
        });
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
