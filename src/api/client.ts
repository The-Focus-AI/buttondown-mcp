import {
  ButtondownEmail,
  ButtondownEmailsResponse,
  ButtondownAnalytics,
} from "../types";
import fetch, { RequestInit, Response } from "node-fetch";

interface APIError {
  detail: string;
}

export interface IButtondownAPI {
  apiKey: string;
  listDrafts(): Promise<ButtondownEmailsResponse>;
  createDraft(content: string, title?: string): Promise<ButtondownEmail>;
  getAnalytics(emailId: string): Promise<ButtondownAnalytics>;
  scheduleDraft(
    draftId: string,
    scheduledTime: string
  ): Promise<ButtondownEmail>;
}

export class ButtondownAPI implements IButtondownAPI {
  public apiKey: string;
  private baseUrl = "https://api.buttondown.email/v1";

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.BUTTONDOWN_API_KEY || "";
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    if (!this.apiKey) {
      throw new Error(
        "Buttondown API key is required. Set BUTTONDOWN_API_KEY environment variable."
      );
    }
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      Authorization: `Token ${this.apiKey}`,
      "Content-Type": "application/json",
    };

    const response: Response = await fetch(url, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = (await response.json()) as APIError;
      throw new Error(error.detail || "API request failed");
    }

    return response.json() as Promise<T>;
  }

  async listDrafts(): Promise<ButtondownEmailsResponse> {
    return this.request<ButtondownEmailsResponse>("/emails");
  }

  async createDraft(content: string, title?: string): Promise<ButtondownEmail> {
    return this.request<ButtondownEmail>("/emails", {
      method: "POST",
      body: JSON.stringify({
        body: content,
        subject: title || "Untitled Draft",
        status: "draft",
      }),
    });
  }

  async getAnalytics(emailId: string): Promise<ButtondownAnalytics> {
    return this.request<ButtondownAnalytics>(`/emails/${emailId}/analytics`);
  }

  async scheduleDraft(
    draftId: string,
    scheduledTime: string
  ): Promise<ButtondownEmail> {
    return this.request<ButtondownEmail>(`/emails/${draftId}`, {
      method: "PATCH",
      body: JSON.stringify({
        scheduled_for: scheduledTime,
        status: "scheduled",
      }),
    });
  }
}
