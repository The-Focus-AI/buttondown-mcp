import { command, runSafely, string, positional, option, flag } from "cmd-ts";
import {
  createDraftCommand,
  scheduleDraftCommand,
  getAnalyticsCommand,
} from "../../cli/commands.js";

// Mock fs module
jest.mock("fs", () => {
  const originalModule = jest.requireActual("fs");
  return {
    ...originalModule,
    readFileSync: jest
      .fn()
      .mockReturnValue("# Test Content\n\nThis is a test markdown file."),
  };
});

// Mock the ButtondownAPI
const mockCreateDraft = jest.fn().mockResolvedValue({
  id: "mock-draft-123",
  creation_date: "2024-03-26T00:00:00Z",
  modification_date: "2024-03-26T00:00:00Z",
  publish_date: null,
  scheduled_for: null,
  attachments: [],
  subject: "Test Title",
  canonical_url: "",
  image: "",
  description: "",
  source: "api",
  body: "Mock content",
  secondary_id: null,
  email_type: "public",
  slug: "test-title",
  status: "draft",
  metadata: {},
  commenting_mode: "enabled",
  absolute_url: "https://newsletter.thefocus.ai/archive/test-title/",
  filters: {
    filters: [],
    groups: [],
    predicate: "and",
  },
  analytics: null,
  template: null,
  related_email_ids: [],
  is_comments_disabled: false,
});

const mockScheduleDraft = jest.fn().mockResolvedValue({
  id: "mock-draft-123",
  scheduled_for: "2024-03-27T12:00:00Z",
  status: "scheduled",
});

const mockGetAnalytics = jest.fn().mockResolvedValue({
  opens: 75,
  clicks: 25,
  unsubscriptions: 0,
  recipients: 100,
  deliveries: 98,
  temporary_failures: 0,
  permanent_failures: 2,
  complaints: 0,
  survey_responses: 0,
  webmentions: 0,
  page_views__lifetime: 150,
  page_views__30: 50,
  page_views__7: 10,
  subscriptions: 5,
  paid_subscriptions: 2,
  replies: 3,
  comments: 1,
  social_mentions: 0,
});

jest.mock("../../api/client.js", () => ({
  ButtondownAPI: jest.fn().mockImplementation(() => ({
    createDraft: mockCreateDraft,
    scheduleDraft: mockScheduleDraft,
    getAnalytics: mockGetAnalytics,
  })),
}));

describe("CLI Commands", () => {
  let consoleLogSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    jest.clearAllMocks();
  });

  describe("createDraftCommand", () => {
    it("should have correct command name", () => {
      expect(createDraftCommand.name).toBe("create");
    });

    it("should parse file argument", async () => {
      const args = ["test.md"];
      const result = await runSafely(createDraftCommand, args);
      expect(result._tag).toBe("ok");
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("Created draft: mock-draft-123")
      );
      expect(mockCreateDraft).toHaveBeenCalled();
    });

    it("should handle title option", async () => {
      const args = ["test.md", "--title", "Test Title"];
      const result = await runSafely(createDraftCommand, args);
      expect(result._tag).toBe("ok");
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("Created draft: mock-draft-123")
      );
      expect(mockCreateDraft).toHaveBeenCalledWith(
        expect.any(String),
        "Test Title"
      );
    });
  });

  describe("scheduleDraftCommand", () => {
    it("should parse id and date arguments", async () => {
      const args = ["mock-draft-123", "2024-03-27T12:00:00Z"];
      const result = await runSafely(scheduleDraftCommand, args);
      expect(result._tag).toBe("ok");
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("Scheduled draft mock-draft-123")
      );
      expect(mockScheduleDraft).toHaveBeenCalledWith(
        "mock-draft-123",
        "2024-03-27T12:00:00Z"
      );
    });

    it("should handle relative time", async () => {
      const args = ["mock-draft-123", "+2h"];
      const result = await runSafely(scheduleDraftCommand, args);
      expect(result._tag).toBe("ok");
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("Scheduled draft mock-draft-123")
      );
      expect(mockScheduleDraft).toHaveBeenCalledWith("mock-draft-123", "+2h");
    });
  });

  describe("getAnalyticsCommand", () => {
    it("should parse analytics request", async () => {
      const args = ["mock-draft-123"];
      const result = await runSafely(getAnalyticsCommand, args);
      expect(result._tag).toBe("ok");
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining("opens: 75")
      );
      expect(mockGetAnalytics).toHaveBeenCalledWith("mock-draft-123");
    });

    it("should handle JSON output", async () => {
      const args = ["mock-draft-123", "--json"];
      const result = await runSafely(getAnalyticsCommand, args);
      expect(result._tag).toBe("ok");
      expect(consoleLogSpy).toHaveBeenCalledWith(expect.any(String));
      expect(mockGetAnalytics).toHaveBeenCalledWith("mock-draft-123");
    });
  });
});
