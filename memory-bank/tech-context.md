# Technical Context

## Technology Stack

### Core Technologies

- **Language**: TypeScript
- **Package Manager**: pnpm
- **HTTP Client**: Native fetch
- **Testing**: Jest
- **Linting**: ESLint
- **MCP Server**: Model Context Protocol implementation

### Development Tools

- **TypeScript**: For type safety and better developer experience
- **Jest**: For unit and integration testing
- **ESLint**: For code quality and consistency
- **1Password CLI**: For secure credential management
- **MCP SDK**: For Model Context Protocol implementation

## Development Setup

### Prerequisites

1. Node.js (latest LTS version)
2. pnpm
3. 1Password CLI (optional, for credential management)
4. MCP SDK version 1.7.0

### Project Structure

```
api-integrator/
├── src/
│   ├── __fixtures__/        # Test fixtures and mock data
│   ├── buttondown.ts        # Buttondown API client
│   ├── types.ts            # TypeScript type definitions
│   ├── test-api.ts         # API test script
│   ├── buttondown.test.ts  # Test suite
│   └── mcp/                # MCP server implementation
│       ├── index.ts        # MCP server entry point
│       └── types.ts        # MCP-specific types
├── package.json
├── tsconfig.json
├── jest.config.js
└── memory-bank/            # Project documentation
```

### Configuration Files

1. **tsconfig.json**

   - Strict mode enabled
   - ES2020 target
   - CommonJS modules
   - Node.js types included

2. **package.json**

   - TypeScript dependencies
   - Jest configuration
   - ESLint configuration
   - Build scripts
   - MCP SDK dependency

3. **.eslintrc**
   - TypeScript-aware rules
   - Node.js environment
   - Strict mode compatibility

## Technical Constraints

### API Limitations

- Rate limiting considerations
- Authentication requirements
- Response format constraints
- API key validation optimized for command execution

### Security Requirements

- Secure credential storage
- Environment variable handling
- 1Password integration security
- Lazy API key validation

### Performance Considerations

- API response caching
- Request batching
- Resource cleanup
- Efficient API key checking

## Dependencies

### Production

- TypeScript
- Native fetch (built-in)
- MCP SDK v1.7.0

### Development

- Jest
- ESLint
- TypeScript compiler
- pnpm

## Build Process

1. TypeScript compilation
2. Test execution
3. Linting
4. Package bundling
5. MCP server build

## Testing Environment

- Jest configuration
- Mock API responses
- Test utilities
- Integration test setup
- MCP inspector support

## API Integration

### Buttondown API

- Base URL: https://api.buttondown.email/v1
- Authentication: API key via 1Password (checked during command execution)
- Endpoints:
  - GET /emails (Implemented with status filtering)
  - POST /emails (Create drafts)
  - GET /emails/{id}/analytics (Get email analytics)
  - POST /emails/{id}/schedule (Schedule email publication)

### 1Password Integration

- CLI-based credential retrieval
- Environment variable fallback
- Secure key management
- Lazy API key validation

## MCP Server Implementation

### Tools

1. `list_emails`

   - List all emails
   - Optional status filtering
   - Includes scheduling information

2. `create_draft`

   - Create new email drafts
   - Title and content parameters
   - Validation with Zod

3. `get_analytics`

   - Retrieve email analytics
   - Detailed statistics
   - Rich output formatting

4. `schedule_draft`
   - Schedule email publication
   - ISO 8601 datetime format
   - Validation and error handling

### Features

- Parameter validation with Zod
- Tool descriptions
- Inspector support
- Efficient API key handling
- Enhanced email listing
- Comprehensive scheduling support

## Testing Strategy

### Unit Tests

- Mock API responses
- Test fixtures in `__fixtures__`
- Jest for test framework
- TypeScript support
- MCP tool testing

### Integration Tests

- Real API calls (planned)
- Error handling
- Authentication flow
- MCP server testing

## Build Process

### Development

- `pnpm test`: Run tests
- `pnpm test-api`: Run API test script
- `pnpm build`: Compile TypeScript
- `pnpm start:mcp`: Start MCP server

### Production

- TypeScript compilation
- No bundling required (Node.js)
- MCP server deployment

## Security Considerations

### API Key Management

- 1Password CLI integration
- Environment variable fallback
- No hardcoded credentials
- Lazy validation during command execution

### Request Security

- HTTPS only
- API key in headers
- Rate limiting (to be implemented)
- Secure scheduling validation

## Performance Considerations

### API Calls

- Native fetch for simplicity
- No caching yet
- Rate limiting to be implemented
- Optimized API key checking

### Resource Management

- Proper error handling
- Response cleanup
- Memory management
- Efficient scheduling handling

## Development Workflow

1. Local Development

   - TypeScript compilation
   - ESLint validation
   - Unit tests
   - MCP server testing

2. Testing

   - Jest test suite
   - API integration tests
   - Mock data usage
   - MCP inspector testing

3. Deployment
   - TypeScript compilation
   - Environment setup
   - API key configuration
   - MCP server deployment
