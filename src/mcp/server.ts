import { ButtondownAPI } from "../api/client.js";
import { ButtondownMCPServer } from "./index.js";

// Initialize server without waiting for API key
const api = new ButtondownAPI();
const server = new ButtondownMCPServer(api);

// Handle graceful shutdown
process.on("SIGINT", () => server?.stop());
process.on("SIGTERM", () => server?.stop());

// Start the server
server.start().catch((error) => {
  console.error("Failed to start server:", error);
  process.exit(1);
});

// Export the server instance
export default server;
