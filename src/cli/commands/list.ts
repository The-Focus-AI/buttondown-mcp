import { ButtondownAPI } from "../../api/client";
import { ButtondownEmail } from "../../types";

export async function listDrafts(apiKey: string) {
  const api = new ButtondownAPI(apiKey);

  try {
    const response = await api.listDrafts();
    if (response.results.length === 0) {
      console.log("No drafts found.");
      return;
    }

    console.log("\nDrafts:");
    console.log("-------");
    response.results.forEach((draft: ButtondownEmail) => {
      console.log(`\nID: ${draft.id}`);
      console.log(`Subject: ${draft.subject}`);
      console.log(`Status: ${draft.status}`);
      console.log(`Created: ${draft.creation_date}`);
    });
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error listing drafts:", error.message);
    } else {
      console.error("An unknown error occurred while listing drafts");
    }
  }
}
