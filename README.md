[![MseeP.ai Security Assessment Badge](https://mseep.net/pr/the-focus-ai-buttondown-mcp-badge.png)](https://mseep.ai/app/the-focus-ai-buttondown-mcp)

# Buttondown API Integration

A comprehensive TypeScript integration for the Buttondown newsletter service, providing both a CLI interface and a Model Context Protocol (MCP) server for managing newsletters, drafts, and analytics.

## Features

- **Multiple Interfaces**:

  - Command Line Interface (CLI) for direct interaction
  - Model Context Protocol (MCP) server for AI/LLM integration
  - Programmatic TypeScript API for custom integrations

- **Core Functionality**:

  - Email draft management (create, update, delete)
  - Email scheduling system
  - Analytics retrieval and formatting
  - List management
  - Tag management

- **Security**:

  - 1Password integration for API key management
  - Environment variable support
  - Secure credential handling

- **Developer Experience**:
  - Full TypeScript support
  - Comprehensive type definitions
  - Real API response-based types
  - Built-in testing utilities

## Installation

```bash
# Install using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

## Configuration

The API key can be provided in two ways:

1. Environment variable:

   ```bash
   export BUTTONDOWN_API_KEY=your_api_key
   ```

2. 1Password CLI (recommended):
   - Store your API key in 1Password at `op://Development/Buttondown API/notesPlain`
   - The integration will automatically fetch it when needed

## Usage

### CLI Interface

```bash
# List all emails
buttondown emails list

# Create a new draft
buttondown draft create <file>

# Schedule an email
buttondown schedule set <draft-id> <relative-time>

# Get analytics
buttondown analytics get <draft-id>
```

### MCP Server

1. Start the server:

   ```bash
   pnpm mcp:start
   ```

2. Start with inspector (for development):
   ```bash
   pnpm mcp:inspect
   ```

Available MCP tools:

- `list_emails`: List all emails with optional status filtering

  ```json
  {
    "status": "draft" // Optional: "draft", "scheduled", "sent"
  }
  ```

- `create_draft`: Create a new email draft

  ```json
  {
    "content": "Email content in markdown",
    "title": "Optional email subject"
  }
  ```

- `get_analytics`: Get analytics for a specific email

  ```json
  {
    "draftId": "email-id-here"
  }
  ```

- `schedule_draft`: Schedule an email for sending
  ```json
  {
    "draftId": "email-id-here",
    "scheduledTime": "2024-03-27T10:00:00Z"
  }
  ```

### Programmatic Usage

```typescript
import { ButtondownAPI } from "api-integrator";

// Initialize the client
const api = new ButtondownAPI(); // Will use 1Password or env var

// List drafts
const drafts = await api.getDrafts();

// Create a draft
const draft = await api.createEmail({
  subject: "My Newsletter",
  body: "Content here",
  status: "draft",
});

// Schedule an email
const scheduled = await api.scheduleEmail(draft.id, "2024-03-27T10:00:00Z");

// Get analytics
const analytics = await api.getEmailStats(draft.id);
```

## Development

```bash
# Build the project
pnpm build

# Run tests
pnpm test

# Start MCP server in development mode
pnpm mcp:inspect

# Build MCP server
pnpm mcp:build
```

## Testing

The project includes several types of tests:

- Unit tests for core functionality
- Integration tests for API interactions
- CLI command tests
- MCP server tests

Run tests with:

```bash
pnpm test
```

## Project Structure

```
.
├── src/
│   ├── api/          # Core API client
│   ├── cli/          # CLI implementation
│   ├── mcp/          # MCP server
│   ├── types/        # TypeScript definitions
│   └── utils/        # Shared utilities
├── tests/            # Test files
├── api-responses/    # Cached API responses
└── memory-bank/      # Project documentation
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

ISC License - See [LICENSE](LICENSE) for details

## Acknowledgments

- [Buttondown](https://buttondown.email/) for their excellent newsletter service
- [Model Context Protocol](https://github.com/cursor-ai/model-context-protocol) for the AI integration framework
