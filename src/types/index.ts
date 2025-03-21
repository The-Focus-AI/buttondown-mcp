import { ButtondownEmail } from "./email";

export * from "./email";
export * from "./draft";
export * from "./analytics";

export interface ButtondownEmailsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ButtondownEmail[];
}

export interface ButtondownSubscribersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: any[];
}

export interface ButtondownTagsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: any[];
}

export interface ButtondownScheduledEmailsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ButtondownEmail[];
}

export interface CreateEmailRequest {
  subject: string;
  body: string;
  status?: "draft" | "scheduled" | "published";
  scheduled_for?: string;
}

export interface UpdateEmailRequest {
  subject?: string;
  body?: string;
  status?: "draft" | "scheduled" | "published";
  scheduled_for?: string | null;
}
