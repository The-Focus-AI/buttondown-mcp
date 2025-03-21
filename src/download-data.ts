import { ButtondownAPI } from "./buttondown";
import { writeFileSync } from "fs";
import path from "path";

async function main() {
  try {
    const api = new ButtondownAPI();
    const fixturesDir = path.join(__dirname, "__fixtures__");

    // Get all emails
    console.log("Fetching all emails...");
    const emails = await api.getEmails();
    writeFileSync(
      path.join(fixturesDir, "emails.json"),
      JSON.stringify(emails, null, 2)
    );
    console.log(`Saved ${emails.count} emails to __fixtures__/emails.json`);

    // Get all drafts
    console.log("\nFetching all drafts...");
    const drafts = await api.getDrafts();
    writeFileSync(
      path.join(fixturesDir, "drafts.json"),
      JSON.stringify(drafts, null, 2)
    );
    console.log(`Saved ${drafts.count} drafts to __fixtures__/drafts.json`);

    // Get all subscribers
    console.log("\nFetching all subscribers...");
    const subscribers = await api.getSubscribers();
    writeFileSync(
      path.join(fixturesDir, "subscribers.json"),
      JSON.stringify(subscribers, null, 2)
    );
    console.log(
      `Saved ${subscribers.count} subscribers to __fixtures__/subscribers.json`
    );

    // Get all tags
    console.log("\nFetching all tags...");
    const tags = await api.getTags();
    writeFileSync(
      path.join(fixturesDir, "tags.json"),
      JSON.stringify(tags, null, 2)
    );
    console.log(`Saved ${tags.count} tags to __fixtures__/tags.json`);

    // Get all scheduled emails
    console.log("\nFetching all scheduled emails...");
    const scheduledEmails = await api.getScheduledEmails();
    writeFileSync(
      path.join(fixturesDir, "scheduled-emails.json"),
      JSON.stringify(scheduledEmails, null, 2)
    );
    console.log(
      `Saved ${scheduledEmails.count} scheduled emails to __fixtures__/scheduled-emails.json`
    );
  } catch (error) {
    console.error(
      "Error:",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

main();
