import { execSync } from "child_process";

async function getApiKey(): Promise<string> {
  // First try environment variable
  const envKey = process.env.BUTTONDOWN_API_KEY;
  if (envKey) {
    return envKey;
  }

  // Fallback to 1Password
  try {
    const opKey = execSync(
      'op read "op://Development/gg2r4na7nfbejolar3rgzgn7pa/notesPlain"',
      {
        encoding: "utf-8",
      }
    ).trim();
    if (opKey) {
      return opKey;
    }
  } catch (error) {
    console.error(
      "Failed to read from 1Password:",
      error instanceof Error ? error.message : "Unknown error"
    );
  }

  throw new Error(
    "Could not find Buttondown API key in environment or 1Password"
  );
}

async function testButtondownApi() {
  try {
    const apiKey = await getApiKey();

    console.log("Making API request...");
    const response = await fetch("https://api.buttondown.email/v1/emails", {
      headers: {
        Authorization: `Token ${apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        "API request failed:",
        response.status,
        response.statusText
      );
      const errorText = await response.text();
      console.error("Error details:", errorText);
      process.exit(1);
    }

    const data = await response.json();
    console.log("API Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(
      "Error:",
      error instanceof Error ? error.message : "Unknown error"
    );
    process.exit(1);
  }
}

testButtondownApi();
