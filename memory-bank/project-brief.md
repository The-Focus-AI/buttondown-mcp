# Buttondown API Client Specification

## Project Overview

A TypeScript-based client for the Buttondown API that provides both command-line and ModelContextProtocol stdio interfaces for newsletter management, with optimized API key handling and comprehensive email scheduling support.

## Core Features

### 1. API Client

- Authentication via environment variable or 1Password CLI with lazy validation
- Core functionality:
  - Draft management (create from local markdown)
  - Comprehensive scheduling system
  - Analytics retrieval
  - Status-based email filtering
  - Efficient API key handling

### 2. Command-Line Interface

Single command with subcommands:

```bash
buttondown draft create <file>
buttondown schedule set <draft-id> <iso-datetime>
buttondown schedule queue
buttondown analytics get <draft-id>
buttondown emails list [--status <status>]
```

### 3. ModelContextProtocol Stdio Interface

- Exposes raw JSON responses from the API
- Enables LLM interaction with the Buttondown API
- Implements four core tools:
  - list_emails: List all emails with status filtering
  - create_draft: Create new email drafts
  - get_analytics: Get detailed analytics
  - schedule_draft: Schedule email publication
- Parameter validation with Zod
- Comprehensive tool descriptions
- Inspector support for testing

## Technical Specifications

### Technology Stack

- Language: TypeScript and pnpm
- HTTP Client: Native fetch
- Testing: Jest
- Linting: ESLint
- MCP SDK: Version 1.7.0

### Project Structure

Single package with the following components:

- Core API client
- CLI interface
- ModelContextProtocol stdio interface
- MCP tool implementations
- Type definitions
- Test fixtures

### Authentication

- Primary: Environment variable
- Fallback: 1Password CLI prompt
- Lazy validation during command execution
- Efficient API key handling

### Draft Management

- Create drafts from local markdown files
- Parse and use frontmatter for metadata
- Support for title, description, and other frontmatter fields
- Status-based filtering

### Scheduling System

- Support for ISO 8601 datetime scheduling
- Queue management and visibility
- Ability to schedule for specific dates and times
- Comprehensive scheduling validation
- Status tracking with publish_date

### Analytics

- Subscriber counts
- Open rates
- Click rates
- Distribution data (if available)
- Enhanced response formatting

## Documentation Requirements

- README with basic usage
- API documentation
- CLI command documentation
- MCP tool documentation
- Examples
- Contributing guidelines
- API key setup guide

## Development Setup

1. TypeScript configuration
2. Jest for testing
3. ESLint for code quality
4. Basic build setup
5. MCP SDK integration
6. Inspector support

## Error Handling

- API error responses
- Invalid inputs
- Authentication failures
- Network issues
- Scheduling errors
- Status validation errors
- MCP-specific error handling

## Testing Strategy

- When implementing a new feature, always start with a real api call to get the actual json
- Always run the tests and make sure that they pass before moving on
- Unit tests for API client
- Integration tests for CLI
- Mock API responses for testing
- MCP inspector testing
- Schedule validation testing
- API key validation testing

## Future Considerations

- Additional API endpoints support
- Enhanced analytics features
- Advanced scheduling options
- Batch operations
- Rate limiting implementation
- Response caching
- Additional MCP tools
- Enhanced error handling
