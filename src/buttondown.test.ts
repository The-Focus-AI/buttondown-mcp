import { ButtondownAPI } from "./buttondown";
import { ButtondownEmail } from "./types";
import fs from "fs";
import path from "path";

describe("ButtondownAPI", () => {
  let api: ButtondownAPI;
  let mockFetch: jest.Mock;

  beforeEach(() => {
    api = new ButtondownAPI("test_api_key");
    mockFetch = jest.fn();
    global.fetch = mockFetch;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("getEmails", () => {
    it("should fetch emails successfully", async () => {
      const testData = {
        count: 7,
        next: null,
        previous: null,
        results: [
          {
            id: "7e4b20cd-b0e6-480e-a3fe-f1172df88db6",
            creation_date: new Date().toISOString(),
            modification_date: new Date().toISOString(),
            publish_date: new Date().toISOString(),
            scheduled_for: null,
            attachments: [],
            subject: "Welcome to the Focus",
            canonical_url: "",
            image: "",
            description: "",
            source: "api",
            body: "Test content",
            secondary_id: 1,
            email_type: "public",
            slug: "welcome-to-the-focus",
            status: "sent",
            metadata: {},
            commenting_mode: "enabled",
            absolute_url:
              "https://newsletter.thefocus.ai/archive/welcome-to-the-focus/",
            filters: {
              filters: [],
              groups: [],
              predicate: "and",
            },
            analytics: {
              recipients: 100,
              deliveries: 98,
              opens: 75,
              clicks: 25,
              temporary_failures: 0,
              permanent_failures: 0,
              unsubscriptions: 0,
              complaints: 0,
              survey_responses: 0,
              webmentions: 0,
              page_views__lifetime: 10,
              page_views__30: 1,
              page_views__7: 0,
              subscriptions: 0,
              paid_subscriptions: 0,
              replies: 0,
              comments: 0,
              social_mentions: 0,
            },
            template: null,
            related_email_ids: [],
            is_comments_disabled: false,
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => testData,
      });

      const result = await api.getEmails();
      expect(result.count).toBe(7);
      expect(result.results[0].subject).toBe("Welcome to the Focus");
      expect(result.results[0].analytics?.opens).toBe(75);
    });

    it("should handle API errors", async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        statusText: "Unauthorized",
        text: async () => "Invalid API key",
      });

      await expect(api.getEmails()).rejects.toThrow("API request failed");
    });
  });

  describe("getDrafts", () => {
    it("should fetch drafts successfully", async () => {
      const testData = {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            id: "mock-draft-123",
            creation_date: new Date().toISOString(),
            modification_date: new Date().toISOString(),
            publish_date: null,
            scheduled_for: null,
            attachments: [],
            subject: "Test Draft",
            canonical_url: "",
            image: "",
            description: "",
            source: "api",
            body: "Draft content",
            secondary_id: null,
            email_type: "public",
            slug: "test-draft",
            status: "draft",
            metadata: {},
            commenting_mode: "enabled",
            absolute_url: "https://newsletter.thefocus.ai/archive/test-draft/",
            filters: {
              filters: [],
              groups: [],
              predicate: "and",
            },
            analytics: null,
            template: null,
            related_email_ids: [],
            is_comments_disabled: false,
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => testData,
      });

      const result = await api.getDrafts();
      expect(result.count).toBe(1);
      expect(result.results[0].subject).toBe("Test Draft");
      expect(result.results[0].status).toBe("draft");
    });
  });

  describe("getScheduledEmails", () => {
    it("should fetch scheduled emails successfully", async () => {
      const testData = {
        count: 1,
        next: null,
        previous: null,
        results: [
          {
            id: "mock-scheduled-123",
            creation_date: new Date().toISOString(),
            modification_date: new Date().toISOString(),
            publish_date: null,
            scheduled_for: "2024-03-25T10:00:00Z",
            attachments: [],
            subject: "Test Scheduled Email",
            canonical_url: "",
            image: "",
            description: "",
            source: "api",
            body: "Scheduled content",
            secondary_id: null,
            email_type: "public",
            slug: "test-scheduled",
            status: "scheduled",
            metadata: {},
            commenting_mode: "enabled",
            absolute_url:
              "https://newsletter.thefocus.ai/archive/test-scheduled/",
            filters: {
              filters: [],
              groups: [],
              predicate: "and",
            },
            analytics: null,
            template: null,
            related_email_ids: [],
            is_comments_disabled: false,
          },
        ],
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => testData,
      });

      const result = await api.getScheduledEmails();
      expect(result.count).toBe(1);
      expect(result.results[0].subject).toBe("Test Scheduled Email");
      expect(result.results[0].scheduled_for).toBe("2024-03-25T10:00:00Z");
    });
  });

  describe("createEmail", () => {
    it("should create a draft email successfully", async () => {
      const testData = {
        id: "mock-draft-123",
        creation_date: new Date().toISOString(),
        modification_date: new Date().toISOString(),
        publish_date: null,
        scheduled_for: null,
        attachments: [],
        subject: "Test Draft",
        canonical_url: "",
        image: "",
        description: "",
        source: "api",
        body: "Draft content",
        secondary_id: null,
        email_type: "public",
        slug: "test-draft",
        status: "draft",
        metadata: {},
        commenting_mode: "enabled",
        absolute_url: "https://newsletter.thefocus.ai/archive/test-draft/",
        filters: {
          filters: [],
          groups: [],
          predicate: "and",
        },
        analytics: null,
        template: null,
        related_email_ids: [],
        is_comments_disabled: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => testData,
      });

      const result = await api.createEmail({
        subject: "Test Draft",
        body: "Draft content",
        status: "draft",
      });

      expect(result.id).toBe("mock-draft-123");
      expect(result.subject).toBe("Test Draft");
      expect(result.status).toBe("draft");
    });
  });

  describe("scheduleEmail", () => {
    it("should schedule an email successfully", async () => {
      const scheduledFor = "2024-03-25T10:00:00Z";
      const testData = {
        id: "mock-draft-123",
        creation_date: new Date().toISOString(),
        modification_date: new Date().toISOString(),
        publish_date: null,
        scheduled_for: scheduledFor,
        attachments: [],
        subject: "Test Draft",
        canonical_url: "",
        image: "",
        description: "",
        source: "api",
        body: "Draft content",
        secondary_id: null,
        email_type: "public",
        slug: "test-draft",
        status: "scheduled",
        metadata: {},
        commenting_mode: "enabled",
        absolute_url: "https://newsletter.thefocus.ai/archive/test-draft/",
        filters: {
          filters: [],
          groups: [],
          predicate: "and",
        },
        analytics: null,
        template: null,
        related_email_ids: [],
        is_comments_disabled: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => testData,
      });

      const result = await api.scheduleEmail("mock-draft-123", scheduledFor);
      expect(result.id).toBe("mock-draft-123");
      expect(result.scheduled_for).toBeDefined();
      expect(result.scheduled_for).toBe(scheduledFor);
    });
  });

  describe("unscheduleEmail", () => {
    it("should unschedule an email successfully", async () => {
      const testData = {
        id: "mock-draft-123",
        creation_date: new Date().toISOString(),
        modification_date: new Date().toISOString(),
        publish_date: null,
        scheduled_for: null,
        attachments: [],
        subject: "Test Draft",
        canonical_url: "",
        image: "",
        description: "",
        source: "api",
        body: "Draft content",
        secondary_id: null,
        email_type: "public",
        slug: "test-draft",
        status: "draft",
        metadata: {},
        commenting_mode: "enabled",
        absolute_url: "https://newsletter.thefocus.ai/archive/test-draft/",
        filters: {
          filters: [],
          groups: [],
          predicate: "and",
        },
        analytics: null,
        template: null,
        related_email_ids: [],
        is_comments_disabled: false,
      };

      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => testData,
      });

      const result = await api.unscheduleEmail("mock-draft-123");
      expect(result.id).toBe("mock-draft-123");
      expect(result.scheduled_for).toBeDefined();
      expect(result.scheduled_for).toBeNull();
    });
  });
});
