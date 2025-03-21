# CLI Interface Implementation

## Context

The CLI interface is a key component that will allow users to interact with the Buttondown API through command-line commands. This chunk builds on the existing API client functionality, including email listing with status filtering and ISO 8601 datetime scheduling.

## Test Requirements

1. Command Parser Tests:

```typescript
describe("CLI Command Parser", () => {
  test("should parse emails list command correctly", () => {
    // Test parsing: buttondown emails list [--status <status>]
  });

  test("should parse draft create command correctly", () => {
    // Test parsing: buttondown draft create <file>
  });

  test("should parse schedule set command correctly", () => {
    // Test parsing: buttondown schedule set <draft-id> <iso-datetime>
  });

  test("should parse analytics get command correctly", () => {
    // Test parsing: buttondown analytics get <draft-id>
  });

  test("should handle invalid commands gracefully", () => {
    // Test invalid command handling
  });
});
```

2. Command Execution Tests:

```typescript
describe("CLI Command Execution", () => {
  test("should list emails with status filter", () => {
    // Test email listing workflow
    const result = await cli.execute([
      "emails",
      "list",
      "--status",
      "scheduled",
    ]);
    expect(result).toContain("publish_date");
  });

  test("should create draft from markdown file", () => {
    // Test draft creation workflow
  });

  test("should set schedule for draft", () => {
    // Test schedule setting workflow with ISO datetime
    const result = await cli.execute([
      "schedule",
      "set",
      draftId,
      "2025-03-28T09:15:00Z",
    ]);
    expect(result.status).toBe("scheduled");
  });

  test("should retrieve analytics", () => {
    // Test analytics retrieval workflow
  });

  test("should handle execution errors gracefully", () => {
    // Test error handling during execution
  });
});
```

## Implementation Guidelines

1. Create a command parser class:

   - Use a modular design for easy extension
   - Implement command validation
   - Support help text generation
   - Handle status filtering options
   - Validate ISO 8601 datetime format

2. Implement command executors:

   - One executor class per command type
   - Use dependency injection for API client
   - Implement proper error handling
   - Support status filtering
   - Handle scheduling with ISO datetime
   - Include comprehensive email information

3. Create CLI entry point:
   - Parse command line arguments
   - Route to appropriate executor
   - Format and display output
   - Show scheduling information
   - Display publish dates

## Expected Outcomes

1. Users can execute all core commands:

   - `buttondown emails list [--status <status>]`
   - `buttondown draft create <file>`
   - `buttondown schedule set <draft-id> <iso-datetime>`
   - `buttondown schedule queue`
   - `buttondown analytics get <draft-id>`

2. Commands provide clear feedback:
   - Success messages
   - Error messages
   - Help text
   - Progress indicators for long operations
   - Scheduling confirmation
   - Email status information

## Integration Steps

1. Create new `src/cli` directory
2. Implement command parser with status filtering
3. Implement command executors with scheduling support
4. Create CLI entry point
5. Update package.json with CLI bin entry
6. Add integration tests
7. Add scheduling validation
8. Add status filtering support

## Completion Criteria

1. All test cases pass
2. Commands work with actual API
3. Error handling is comprehensive
4. Help text is available for all commands
5. Integration tests verify end-to-end functionality
6. Status filtering works correctly
7. Scheduling with ISO datetime works
8. Email information is complete
