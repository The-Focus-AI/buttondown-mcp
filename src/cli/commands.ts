import { command, string, positional, option, flag, subcommands } from "cmd-ts";
import { ButtondownAPI } from "../api/client.js";
import fs from "fs";
import { z } from "zod";

// Create Draft Command
export const createDraftCommand = command({
  name: "create",
  args: {
    file: positional({
      type: string,
      displayName: "file",
      description: "Markdown file to create draft from",
    }),
    title: option({
      type: string,
      long: "title",
      description: "Optional title for the draft",
      defaultValue: () => "",
    }),
    confirm: flag({
      long: "confirm",
      description: "Confirm the draft creation",
      defaultValue: () => false,
    }),
  },
  handler: async ({ file, title, confirm }) => {
    if (!confirm) {
      console.log("Preview of draft to be created:");
      console.log(`Title: ${title || "Untitled"}`);
      console.log(
        `Content length: ${fs.readFileSync(file, "utf-8").length} characters`
      );
      console.log(
        "\nPlease ask the user if they want to create this draft. If they agree, run with --confirm"
      );
      return { _tag: "ok", value: { file, title, confirmed: false } };
    }
    console.log("Creating draft...", file, title);
    try {
      const api = new ButtondownAPI();
      const content = fs.readFileSync(file, "utf-8");
      const draft = await api.createDraft(content, title || undefined);
      console.log(`Created draft: ${draft.id}`);
      return { _tag: "ok", value: { file, title, confirmed: true } };
    } catch (error) {
      console.error("Failed to create draft:", error);
      return { _tag: "error", error };
    }
  },
});

// Schedule Draft Command
export const scheduleDraftCommand = command({
  name: "schedule",
  args: {
    draftId: positional({
      type: string,
      displayName: "draft-id",
      description: "ID of the draft to schedule",
    }),
    scheduledTime: positional({
      type: string,
      displayName: "time",
      description: "Scheduled time (ISO-8601 or relative like +2h)",
    }),
    confirm: flag({
      long: "confirm",
      description: "Confirm the scheduling",
      defaultValue: () => false,
    }),
  },
  handler: async ({ draftId, scheduledTime, confirm }) => {
    if (!confirm) {
      console.log("Preview of scheduling:");
      console.log(`Draft ID: ${draftId}`);
      console.log(`Scheduled time: ${scheduledTime}`);
      console.log(`Local time: ${new Date(scheduledTime).toLocaleString()}`);
      console.log(
        "\nPlease ask the user if they want to schedule this draft. If they agree, run with --confirm"
      );
      return {
        _tag: "ok",
        value: { draftId, scheduledTime, confirmed: false },
      };
    }
    try {
      const api = new ButtondownAPI();
      const result = await api.scheduleDraft(draftId, scheduledTime);
      console.log(`Scheduled draft ${draftId} for ${scheduledTime}`);
      return { _tag: "ok", value: { draftId, scheduledTime, confirmed: true } };
    } catch (error) {
      console.error("Failed to schedule draft:", error);
      return { _tag: "error", error };
    }
  },
});

// Get Analytics Command
export const getAnalyticsCommand = command({
  name: "analytics",
  args: {
    draftId: positional({
      type: string,
      displayName: "draft-id",
      description: "ID of the draft to get analytics for",
    }),
    json: flag({
      long: "json",
      description: "Output in JSON format",
    }),
  },
  handler: async ({ draftId, json }) => {
    try {
      const api = new ButtondownAPI();
      const analytics = await api.getAnalytics(draftId);
      if (json) {
        console.log(JSON.stringify(analytics, null, 2));
      } else {
        console.log(`Analytics for draft ${draftId}:`);
        console.log("\nDelivery Stats:");
        console.log(`- Recipients: ${analytics?.recipients ?? "N/A"}`);
        console.log(`- Deliveries: ${analytics?.deliveries ?? "N/A"}`);
        console.log(
          `- Temporary failures: ${analytics?.temporary_failures ?? "N/A"}`
        );
        console.log(
          `- Permanent failures: ${analytics?.permanent_failures ?? "N/A"}`
        );

        console.log("\nEngagement Stats:");
        console.log(`- Opens: ${analytics?.opens ?? "N/A"}`);
        console.log(`- Clicks: ${analytics?.clicks ?? "N/A"}`);
        console.log(`- Replies: ${analytics?.replies ?? "N/A"}`);
        console.log(`- Comments: ${analytics?.comments ?? "N/A"}`);
        console.log(
          `- Social mentions: ${analytics?.social_mentions ?? "N/A"}`
        );

        console.log("\nSubscriber Impact:");
        console.log(
          `- New subscriptions: ${analytics?.subscriptions ?? "N/A"}`
        );
        console.log(
          `- Paid subscriptions: ${analytics?.paid_subscriptions ?? "N/A"}`
        );
        console.log(
          `- Unsubscriptions: ${analytics?.unsubscriptions ?? "N/A"}`
        );
        console.log(`- Complaints: ${analytics?.complaints ?? "N/A"}`);

        console.log("\nPage Views:");
        console.log(`- Last 7 days: ${analytics?.page_views__7 ?? "N/A"}`);
        console.log(`- Last 30 days: ${analytics?.page_views__30 ?? "N/A"}`);
        console.log(`- Lifetime: ${analytics?.page_views__lifetime ?? "N/A"}`);

        console.log("\nOther:");
        console.log(
          `- Survey responses: ${analytics?.survey_responses ?? "N/A"}`
        );
        console.log(`- Webmentions: ${analytics?.webmentions ?? "N/A"}`);
      }
      return { _tag: "ok", value: { draftId, json } };
    } catch (error) {
      console.error("Failed to get analytics:", error);
      return { _tag: "error", error };
    }
  },
});

// Root Command
export const buttondownCli = subcommands({
  name: "buttondown",
  cmds: {
    create: createDraftCommand,
    schedule: scheduleDraftCommand,
    analytics: getAnalyticsCommand,
  },
});
