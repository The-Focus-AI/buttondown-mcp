import { ButtondownAPI } from "./buttondown";
import { readFileSync } from "fs";
import parse from "front-matter";

async function main() {
  try {
    const api = new ButtondownAPI();

    // Read the newsletter markdown file
    const markdown = readFileSync("newsletter.md", "utf-8");
    const { attributes, body } = parse(markdown);

    const frontmatter = attributes as Record<string, any>;

    // Create a new draft
    console.log("Creating new draft...");
    const draft = await api.createEmail({
      body: "Test draft content",
      subject: "Test Draft",
      status: "draft",
    });
    console.log("Draft created:", draft);

    // List all drafts
    console.log("\nListing all drafts...");
    const drafts = await api.getDrafts();
    console.log("Drafts:", drafts);

    // Get the specific draft we just created
    console.log("\nGetting specific draft...");
    const retrievedDraft = await api.getEmail(draft.id);
    console.log("Retrieved draft:", retrievedDraft);

    if (retrievedDraft.body !== body) {
      console.log("Body mismatch");
      console.log("Expected:", body);
      console.log("Actual:", retrievedDraft.body);
      process.exit(1);
    }

    // List all emails (sent)
    console.log("\nListing all sent emails...");
    const emails = await api.getEmails();
    console.log("Sent emails:", emails);
  } catch (error) {
    console.error(
      "Error:",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
}

main();
