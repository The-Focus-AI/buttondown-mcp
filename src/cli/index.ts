#!/usr/bin/env node

import { run } from "cmd-ts";
import { buttondownCli } from "./commands.js";

export * from "./commands.js";

async function main() {
  try {
    await run(buttondownCli, process.argv.slice(2));
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error:", error.message);
    } else {
      console.error("An unknown error occurred");
    }
    process.exit(1);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}
