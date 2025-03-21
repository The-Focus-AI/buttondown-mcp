# System Patterns

## Architecture Overview

### Core Components

1. **API Client Layer**

   - `ButtondownAPI` class
   - Type-safe request/response handling
   - Error management
   - Optimized authentication flow
   - Lazy API key validation

2. **Type System**

   - Interface definitions
   - Response type validation
   - Request type safety
   - MCP tool schemas

3. **Testing Infrastructure**

   - Jest test framework
   - Mock API responses
   - Test fixtures
   - Integration test setup
   - MCP inspector support

4. **MCP Server Layer**
   - Tool definitions
   - Parameter validation
   - Response formatting
   - Error handling
   - Scheduling support

## Design Patterns

### Repository Pattern

```typescript
class ButtondownAPI implements IButtondownAPI {
  public apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || "";
  }

  private async validateApiKey() {
    if (!this.apiKey) {
      this.apiKey = await this.getApiKey();
    }
    // Validation logic
  }

  async getEmails(status?: string): Promise<ButtondownEmailsResponse> {
    await this.validateApiKey();
    // API implementation with status filtering
  }

  async scheduleDraft(
    id: string,
    scheduledTime: string
  ): Promise<ButtondownEmail> {
    await this.validateApiKey();
    // Scheduling implementation
  }
}
```

### Factory Pattern (Implemented)

- For creating different types of API clients
- Configurable authentication methods
- Extensible for future API integrations
- MCP tool factory methods

### Strategy Pattern (Implemented)

- For different authentication methods
- For various response formats
- For error handling strategies
- For email scheduling strategies

### Command Pattern (MCP Tools)

- Tool registration
- Parameter validation
- Command execution
- Response formatting

## Data Flow

### API Request Flow

1. Tool invocation
2. Parameter validation
3. API key validation (when needed)
4. Request preparation
5. Content normalization
   - Line break standardization (\r\n -> \n)
   - Markdown formatting preservation
6. API call
7. Response formatting
8. Error management

### MCP Server Flow

1. Tool registration
2. Request validation
3. Parameter parsing
4. API key validation
5. Command execution
6. Response formatting
7. Error handling

### Testing Flow

1. Test setup
2. Mock data preparation
3. Test execution
4. Assertion verification
5. MCP inspector validation
6. Cleanup

### Content Handling Patterns

```typescript
// MCP tool implementation
async function handleListEmails(
  params: ListEmailsParams
): Promise<MCPResponse> {
  const { status } = params;

  // Validate API key only when executing command
  await api.validateApiKey();

  const emails = await api.getEmails(status);

  return formatEmailsResponse(emails);
}

// Email scheduling implementation
async function handleScheduleDraft(
  params: ScheduleDraftParams
): Promise<MCPResponse> {
  const { draftId, scheduledTime } = params;

  // Validate API key only when executing command
  await api.validateApiKey();

  const result = await api.scheduleDraft(draftId, scheduledTime);

  return formatScheduleResponse(result);
}
```

## Error Handling

### Error Types

```typescript
class ButtondownError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ButtondownError";
  }
}

class AuthenticationError extends ButtondownError {
  constructor(message: string) {
    super(message);
    this.name = "AuthenticationError";
  }
}

class SchedulingError extends ButtondownError {
  constructor(message: string) {
    super(message);
    this.name = "SchedulingError";
  }
}
```

### Error Handling Strategy

1. Type-specific error classes
2. Consistent error messages
3. Error propagation
4. Recovery mechanisms
5. MCP-specific error handling
6. Scheduling error management

## Testing Patterns

### Mock Data Management

```typescript
// __fixtures__/emails.json
{
  "count": 2,
  "results": [
    {
      "id": "...",
      "subject": "...",
      "status": "scheduled",
      "publish_date": "2025-03-28T09:15:00Z",
      // ... other fields
    }
  ]
}
```

### Test Structure

```typescript
describe("ButtondownMCP", () => {
  let api: ButtondownAPI;
  let mcp: ButtondownMCP;

  beforeEach(() => {
    api = new ButtondownAPI();
    mcp = new ButtondownMCP(api);
  });

  describe("listEmails", () => {
    it("should list emails with status filter", async () => {
      // Test implementation
    });
  });

  describe("scheduleDraft", () => {
    it("should schedule draft for publication", async () => {
      // Test implementation
    });
  });
});
```

## Security Patterns

### Credential Management

1. 1Password integration
2. Environment variable fallback
3. Secure storage
4. No hardcoded values
5. Lazy API key validation
6. Command-specific validation

### API Security

1. HTTPS enforcement
2. Header-based authentication
3. Rate limiting (planned)
4. Request validation
5. Schedule validation
6. Status validation

## Performance Patterns

### API Optimization

1. Response caching (planned)
2. Rate limiting (planned)
3. Resource cleanup
4. Memory management
5. Lazy API key validation
6. Efficient scheduling

### Testing Optimization

1. Mock data reuse
2. Test isolation
3. Efficient setup/teardown
4. Parallel test execution
5. MCP inspector optimization
6. Schedule testing patterns

## Future Patterns

### Planned Extensions

1. CLI interface enhancements
2. Additional MCP tools
3. Advanced scheduling features
4. Enhanced error handling
5. Rate limiting implementation
6. Response caching

### Scalability Considerations

1. Modular architecture
2. Extensible type system
3. Configurable components
4. Plugin system (planned)
5. Tool composition
6. Schedule management
