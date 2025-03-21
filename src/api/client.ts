import {
  ButtondownEmail,
  ButtondownEmailsResponse,
  ButtondownAnalytics,
} from "../types";
import fetch, { RequestInit, Response } from "node-fetch";

interface APIError {
  detail: string;
}

export class ButtondownAPI {
  private apiKey: string;
  private baseUrl = "https://api.buttondown.email/v1";

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.BUTTONDOWN_API_KEY || "";
    if (!this.apiKey) {
      throw new Error(
        "Buttondown API key is required. Set BUTTONDOWN_API_KEY environment variable."
      );
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      Authorization: `Token ${this.apiKey}`,
      "Content-Type": "application/json",
      ...options.headers,
    };

    try {
      const response = await fetch(url, { ...options, headers });

      if (!response.ok) {
        const error = (await response
          .json()
          .catch(() => ({ detail: "Unknown error" }))) as APIError;
        throw new Error(
          `API request failed: ${error.detail || response.statusText}`
        );
      }

      return response.json() as Promise<T>;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`API request failed: ${error.message}`);
      }
      throw new Error("An unknown error occurred");
    }
  }

  async createDraft(content: string, title?: string): Promise<ButtondownEmail> {
    const data = {
      body: content,
      subject: title,
      email_type: "public",
      status: "draft",
    };

    return this.request<ButtondownEmail>("/emails", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async scheduleDraft(
    draftId: string,
    scheduledTime: string
  ): Promise<ButtondownEmail> {
    // For now, we'll keep this as a mock since we don't want to actually schedule
    console.log(`Would schedule draft ${draftId} for ${scheduledTime}`);
    return {
      id: draftId,
      creation_date: new Date().toISOString(),
      modification_date: new Date().toISOString(),
      publish_date: null,
      scheduled_for: scheduledTime,
      attachments: [],
      subject: "Test Draft",
      canonical_url: "",
      image: "",
      description: "",
      source: "api",
      body: "Mock content",
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
  }

  async getAnalytics(emailId: string): Promise<ButtondownAnalytics> {
    return this.request<ButtondownAnalytics>(`/emails/${emailId}/analytics`);
  }

  async listDrafts(): Promise<ButtondownEmailsResponse> {
    return this.request<ButtondownEmailsResponse>("/emails", {
      method: "GET",
    });
  }
}
