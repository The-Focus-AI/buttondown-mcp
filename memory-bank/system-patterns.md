# System Patterns

## Architecture Overview

### Core Components

1. **API Client Layer**

   - `ButtondownAPI` class
   - Type-safe request/response handling
   - Error management
   - Authentication flow

2. **Type System**

   - Interface definitions
   - Response type validation
   - Request type safety

3. **Testing Infrastructure**
   - Jest test framework
   - Mock API responses
   - Test fixtures
   - Integration test setup

## Design Patterns

### Repository Pattern

```typescript
class ButtondownAPI {
  private apiKey: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || "";
  }

  async initialize() {
    if (!this.apiKey) {
      this.apiKey = await this.getApiKey();
    }
  }

  async getEmails(): Promise<ButtondownEmailsResponse> {
    await this.initialize();
    // API implementation
  }
}
```

### Factory Pattern (Planned)

- For creating different types of API clients
- Configurable authentication methods
- Extensible for future API integrations

### Strategy Pattern (Planned)

- For different authentication methods
- For various response formats
- For error handling strategies

## Data Flow

### API Request Flow

1. Client initialization
2. Authentication check
3. Request preparation
4. Content normalization
   - Line break standardization (\r\n -> \n)
   - Markdown formatting preservation
5. API call
6. Response handling
7. Error management

### Testing Flow

1. Test setup
2. Mock data preparation
3. Test execution
4. Assertion verification
5. Cleanup

### Content Handling Patterns

```typescript
// Draft content normalization
async createDraft(draft: CreateDraftRequest): Promise<ButtondownDraft> {
  await this.initialize();

  // Normalize line breaks to use \n
  const normalizedBody = draft.body.replace(/\r\n/g, "\n");

  const response = await fetch("https://api.buttondown.email/v1/emails", {
    method: "POST",
    headers: {
      Authorization: `Token ${this.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...draft,
      body: normalizedBody,
    }),
  });

  // ... response handling
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
```

### Error Handling Strategy

1. Type-specific error classes
2. Consistent error messages
3. Error propagation
4. Recovery mechanisms

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
      // ... other fields
    }
  ]
}
```

### Test Structure

```typescript
describe("ButtondownAPI", () => {
  let api: ButtondownAPI;

  beforeEach(() => {
    api = new ButtondownAPI();
  });

  describe("getEmails", () => {
    it("should fetch emails successfully", async () => {
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

### API Security

1. HTTPS enforcement
2. Header-based authentication
3. Rate limiting (planned)
4. Request validation

## Performance Patterns

### API Optimization

1. Response caching (planned)
2. Rate limiting (planned)
3. Resource cleanup
4. Memory management

### Testing Optimization

1. Mock data reuse
2. Test isolation
3. Efficient setup/teardown
4. Parallel test execution

## Future Patterns

### Planned Extensions

1. CLI interface
2. ModelContextProtocol integration
3. Additional API endpoints
4. Advanced error handling

### Scalability Considerations

1. Modular architecture
2. Extensible type system
3. Configurable components
4. Plugin system (planned)
