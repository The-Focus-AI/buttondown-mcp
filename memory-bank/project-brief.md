# Buttondown API Client Specification

## Project Overview

A TypeScript-based client for the Buttondown API that provides both command-line and ModelContextProtocol stdio interfaces for newsletter management.

## Core Features

### 1. API Client

- Authentication via environment variable or 1Password CLI
- Core functionality:
  - Draft management (create from local markdown)
  - Scheduling system
  - Analytics retrieval

### 2. Command-Line Interface

Single command with subcommands:

```bash
buttondown draft create <file>
buttondown schedule set <draft-id> <relative-time>
buttondown schedule queue
buttondown analytics get <draft-id>
```

### 3. ModelContextProtocol Stdio Interface

- Exposes raw JSON responses from the API
- Enables LLM interaction with the Buttondown API

## Technical Specifications

### Technology Stack

- Language: TypeScript and pnpm
- HTTP Client: Native fetch
- Testing: Jest
- Linting: ESLint

### Project Structure

Single package with the following components:

- Core API client
- CLI interface
- ModelContextProtocol stdio interface

### Authentication

- Primary: Environment variable
- Fallback: 1Password CLI prompt

### Draft Management

- Create drafts from local markdown files
- Parse and use frontmatter for metadata
- Support for title, description, and other frontmatter fields

### Scheduling System

- Support for relative time scheduling
- Queue management and visibility
- Ability to schedule for next available slot (e.g., "next Friday")

### Analytics

- Subscriber counts
- Open rates
- Click rates
- Distribution data (if available)

## Documentation Requirements

- README with basic usage
- API documentation
- CLI command documentation
- Examples
- Contributing guidelines

## Development Setup

1. TypeScript configuration
2. Jest for testing
3. ESLint for code quality
4. Basic build setup

## Error Handling

- API error responses
- Invalid inputs
- Authentication failures
- Network issues

## Testing Strategy

- When implementing a new feature, always start with a real api call to get the actual json
- Always run the tests and make sure that they pass before moving on
- Unit tests for API client
- Integration tests for CLI
- Mock API responses for testing

## Future Considerations

- Additional API endpoints support
- Enhanced analytics features
- Advanced scheduling options
- Batch operations
