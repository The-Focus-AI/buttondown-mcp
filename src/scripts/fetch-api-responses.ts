import { ButtondownAPI } from "../buttondown";
import fs from "fs";
import path from "path";

async function saveResponse(filename: string, data: any) {
  const dir = path.dirname(filename);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filename, JSON.stringify(data, null, 2));
  console.log(`Saved response to ${filename}`);
}

async function fetchAndStoreResponses() {
  try {
    const api = new ButtondownAPI();
    await api.initialize();

    console.log("Fetching API responses...");

    // Fetch and store emails
    const emails = await api.getEmails();
    await saveResponse(
      "api-responses/buttondown/emails/GET_emails_success.json",
      emails
    );

    // Fetch and store scheduled emails
    const scheduledEmails = await api.getScheduledEmails();
    await saveResponse(
      "api-responses/buttondown/emails/GET_emails_scheduled_success.json",
      scheduledEmails
    );

    // Create a draft email
    const draft = await api.createEmail({
      subject: "Test Draft Email",
      body: "This is a test draft email created by the API client.",
      status: "draft",
    });
    await saveResponse(
      "api-responses/buttondown/emails/POST_email_create_success.json",
      draft
    );

    // Schedule the draft
    const scheduledDraft = await api.scheduleEmail(
      draft.id,
      new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Schedule for tomorrow
    );
    await saveResponse(
      "api-responses/buttondown/emails/PATCH_email_schedule_success.json",
      scheduledDraft
    );

    // Note: DELETE operation is not allowed by the API
    console.log("Note: Created draft will remain in your account");

    // Fetch and store subscribers
    const subscribers = await api.getSubscribers();
    await saveResponse(
      "api-responses/buttondown/subscribers/GET_subscribers_success.json",
      subscribers
    );

    // Note: Analytics data is included in the email responses
    console.log("Note: Analytics data is included in the email responses");

    console.log("Successfully fetched and stored all API responses!");
  } catch (error) {
    console.error("Error fetching API responses:", error);
    process.exit(1);
  }
}

fetchAndStoreResponses();
