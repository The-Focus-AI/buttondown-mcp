# ModelContextProtocol Interface Implementation

## Context

The ModelContextProtocol interface enables LLM interaction with the Buttondown API through a standardized stdio interface. This builds on the core API client and implements four core tools with parameter validation, comprehensive scheduling support, and efficient API key handling.

## Test Requirements

1. Protocol Handler Tests:

```typescript
describe("ModelContextProtocol Handler", () => {
  test("should parse valid JSON input", () => {
    // Test input parsing
    const input = {
      tool: "list_emails",
      params: { status: "scheduled" },
    };
  });

  test("should validate parameters with Zod", () => {
    // Test parameter validation
    const input = {
      tool: "schedule_draft",
      params: {
        draftId: "76401f19-8a8b-4f4b-8878-8175c75bd29e",
        scheduledTime: "2025-03-28T09:15:00Z",
      },
    };
  });

  test("should handle malformed JSON input", () => {
    // Test error handling for bad input
  });

  test("should format API responses correctly", () => {
    // Test response formatting with publish_date
  });

  test("should handle API errors appropriately", () => {
    // Test API error handling
  });
});
```

2. Tool Implementation Tests:

```typescript
describe("ModelContextProtocol Tools", () => {
  test("should list emails with status filter", async () => {
    const result = await mcp.handleRequest({
      tool: "list_emails",
      params: { status: "scheduled" },
    });
    expect(result.emails[0]).toHaveProperty("publish_date");
  });

  test("should create email drafts", async () => {
    const result = await mcp.handleRequest({
      tool: "create_draft",
      params: {
        content: "Test content",
        title: "Test Draft",
      },
    });
    expect(result.draft.status).toBe("draft");
  });

  test("should schedule drafts with ISO datetime", async () => {
    const result = await mcp.handleRequest({
      tool: "schedule_draft",
      params: {
        draftId: "76401f19-8a8b-4f4b-8878-8175c75bd29e",
        scheduledTime: "2025-03-28T09:15:00Z",
      },
    });
    expect(result.email.status).toBe("scheduled");
    expect(result.email.publish_date).toBe("2025-03-28T09:15:00Z");
  });

  test("should retrieve analytics", async () => {
    const result = await mcp.handleRequest({
      tool: "get_analytics",
      params: { draftId: "76401f19-8a8b-4f4b-8878-8175c75bd29e" },
    });
    expect(result.analytics).toBeDefined();
  });

  test("should validate API key efficiently", async () => {
    // Test lazy API key validation
  });
});
```

## Implementation Guidelines

1. Create Protocol Handler:

   - Implement JSON input parsing
   - Handle stdio streams
   - Format responses consistently
   - Implement error handling
   - Support parameter validation with Zod
   - Handle API key validation efficiently

2. Implement Core Tools:

   - list_emails: List all emails with status filtering
   - create_draft: Create new email drafts
   - get_analytics: Get detailed analytics
   - schedule_draft: Schedule email publication
   - Validate parameters with Zod schemas
   - Include comprehensive tool descriptions
   - Support inspector for testing
   - Handle API key validation efficiently

3. Create Response Formatter:
   - Standardize response format
   - Include metadata
   - Handle different response types
   - Format errors consistently
   - Include scheduling information
   - Add publish dates

## Expected Outcomes

1. LLMs can interact with all API features:

   - Email listing with status filtering
   - Draft creation
   - Analytics retrieval
   - Email scheduling with ISO datetime
   - Parameter validation
   - Inspector support

2. Protocol provides:
   - Consistent JSON interface
   - Clear error messages
   - Detailed response metadata
   - Efficient API key handling
   - Comprehensive scheduling support
   - Enhanced email information

## Integration Steps

1. Create new `src/mcp` directory
2. Implement MCP server with core tools
3. Add parameter validation with Zod
4. Add tool descriptions
5. Implement inspector support
6. Add API key optimization
7. Enhance email listing
8. Add scheduling support
9. Add integration tests
10. Document protocol format

## Completion Criteria

1. All test cases pass
2. Protocol handles all API features
3. Error handling is comprehensive
4. Documentation is complete
5. Integration tests verify functionality
6. LLM can successfully interact with API
7. Parameter validation works correctly
8. Inspector support is functional
9. API key handling is efficient
10. Scheduling works correctly
11. Email information is complete
