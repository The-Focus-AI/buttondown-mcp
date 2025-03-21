import { execSync } from "child_process";
import {
  ButtondownEmailsResponse,
  ButtondownEmail,
  CreateEmailRequest,
  UpdateEmailRequest,
  ButtondownSubscribersResponse,
  ButtondownTagsResponse,
  ButtondownScheduledEmailsResponse,
} from "./types";

export class ButtondownAPI {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey?: string) {
    this.apiKey = apiKey || "";
    this.baseUrl = "https://api.buttondown.email";
  }

  async initialize(): Promise<void> {
    if (!this.apiKey) {
      this.apiKey = await this.getApiKey();
    }
  }

  private async getApiKey(): Promise<string> {
    // First try environment variable
    const envKey = process.env.BUTTONDOWN_API_KEY;
    if (envKey) {
      return envKey;
    }

    // Fallback to 1Password
    try {
      const opKey = execSync(
        'op read "op://Development/Buttondown API/notesPlain"',
        {
          encoding: "utf-8",
        }
      ).trim();
      if (opKey) {
        return opKey;
      }
    } catch (error) {
      console.error(
        "Failed to read from 1Password:",
        error instanceof Error ? error.message : "Unknown error"
      );
    }

    throw new Error(
      "Could not find Buttondown API key in environment or 1Password"
    );
  }

  async getEmails(): Promise<ButtondownEmailsResponse> {
    await this.initialize();

    const response = await fetch("https://api.buttondown.email/v1/emails", {
      headers: {
        Authorization: `Token ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const data = await response.json();
    return data as ButtondownEmailsResponse;
  }

  async getDrafts(): Promise<ButtondownEmailsResponse> {
    await this.initialize();

    const response = await fetch(
      "https://api.buttondown.email/v1/emails?status=draft",
      {
        headers: {
          Authorization: `Token ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const data = await response.json();
    return data as ButtondownEmailsResponse;
  }

  async createEmail(email: CreateEmailRequest): Promise<ButtondownEmail> {
    await this.initialize();

    // Normalize line breaks to \n
    const normalizedEmail = {
      ...email,
      body: email.body.replace(/\r\n/g, "\n"),
    };

    const response = await fetch("https://api.buttondown.email/v1/emails", {
      method: "POST",
      headers: {
        Authorization: `Token ${this.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(normalizedEmail),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const data = await response.json();
    return data as ButtondownEmail;
  }

  async updateEmail(
    id: string,
    email: UpdateEmailRequest
  ): Promise<ButtondownEmail> {
    await this.initialize();

    const response = await fetch(
      `https://api.buttondown.email/v1/emails/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Token ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(email),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const data = await response.json();
    return data as ButtondownEmail;
  }

  async deleteEmail(id: string): Promise<void> {
    await this.initialize();

    const response = await fetch(
      `https://api.buttondown.email/v1/emails/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Token ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}\n${errorText}`
      );
    }
  }

  async getEmail(id: string): Promise<ButtondownEmail> {
    await this.initialize();

    const response = await fetch(
      `https://api.buttondown.email/v1/emails/${id}`,
      {
        headers: {
          Authorization: `Token ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const data = await response.json();
    return data as ButtondownEmail;
  }

  async getSubscribers(): Promise<ButtondownSubscribersResponse> {
    await this.initialize();

    const response = await fetch(
      "https://api.buttondown.email/v1/subscribers",
      {
        headers: {
          Authorization: `Token ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const data = await response.json();
    return data as ButtondownSubscribersResponse;
  }

  async getTags(): Promise<ButtondownTagsResponse> {
    await this.initialize();

    const response = await fetch("https://api.buttondown.email/v1/tags", {
      headers: {
        Authorization: `Token ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const data = await response.json();
    return data as ButtondownTagsResponse;
  }

  async getScheduledEmails(): Promise<ButtondownScheduledEmailsResponse> {
    await this.initialize();

    const response = await fetch(
      "https://api.buttondown.email/v1/emails?status=scheduled",
      {
        headers: {
          Authorization: `Token ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const data = await response.json();
    return data as ButtondownScheduledEmailsResponse;
  }

  async scheduleEmail(
    id: string,
    scheduledFor: string
  ): Promise<ButtondownEmail> {
    await this.initialize();

    const response = await fetch(
      `https://api.buttondown.email/v1/emails/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Token ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "scheduled",
          scheduled_for: scheduledFor,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const data = await response.json();
    return data as ButtondownEmail;
  }

  async unscheduleEmail(id: string): Promise<ButtondownEmail> {
    await this.initialize();

    const response = await fetch(
      `https://api.buttondown.email/v1/emails/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Token ${this.apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status: "draft",
          scheduled_for: null,
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const data = await response.json();
    return data as ButtondownEmail;
  }

  async getRawTimeseriesAnalytics(
    startDate: string,
    endDate: string,
    interval: "day" | "week" | "month" = "day"
  ): Promise<any> {
    await this.initialize();

    const response = await fetch(
      `https://api.buttondown.email/v1/analytics/timeseries?start_date=${startDate}&end_date=${endDate}&interval=${interval}`,
      {
        headers: {
          Authorization: `Token ${this.apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const data = await response.json();
    return data;
  }

  private async get(endpoint: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      method: "GET",
      headers: {
        Authorization: `Token ${this.apiKey}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed: ${response.status} ${response.statusText}\n${errorText}`
      );
    }

    const data = await response.json();
    return data;
  }

  async getEmailAnalytics(): Promise<ButtondownEmailsResponse> {
    // Get analytics directly from email responses
    return this.getEmails();
  }

  async getEmailStats(emailId: string): Promise<ButtondownEmail> {
    // Get stats directly from email response
    return this.getEmail(emailId);
  }
}
