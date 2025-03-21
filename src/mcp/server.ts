import { ButtondownAPI } from "../buttondown.js";
import { ButtondownMCPServer } from "./index.js";
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
