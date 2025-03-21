/**
 * Analytics data for an email
 * @example
 * {
 *   recipients: 2,
 *   deliveries: 2,
 *   opens: 2,
 *   clicks: 2,
 *   temporary_failures: 0,
 *   permanent_failures: 0,
 *   unsubscriptions: 0,
 *   complaints: 0,
 *   survey_responses: 0,
 *   webmentions: 0,
 *   page_views__lifetime: 10,
 *   page_views__30: 1,
 *   page_views__7: 0,
 *   subscriptions: 0,
 *   paid_subscriptions: 0,
 *   replies: 0,
 *   comments: 0,
 *   social_mentions: 0
 * }
 */
export interface ButtondownAnalytics {
  recipients: number;
  deliveries: number;
  opens: number;
  clicks: number;
  temporary_failures: number;
  permanent_failures: number;
  unsubscriptions: number;
  complaints: number;
  survey_responses: number;
  webmentions: number;
  page_views__lifetime: number;
  page_views__30: number;
  page_views__7: number;
  subscriptions: number;
  paid_subscriptions: number;
  replies: number;
  comments: number;
  social_mentions: number;
}

export interface ButtondownEmailAnalytics extends ButtondownAnalytics {
  email_id: string;
  subject: string;
  send_date: string;
  unsubscribes: number;
  spam_reports: number;
}

/**
 * A Buttondown email
 * @example
 * {
 *   "id": "7e4b20cd-b0e6-480e-a3fe-f1172df88db6",
 *   "creation_date": "2024-11-27T22:12:29.991163Z",
 *   "modification_date": "2024-11-27T23:17:03.269852Z",
 *   "publish_date": "2024-11-27T23:16:58.212608Z",
 *   "attachments": [],
 *   "subject": "Welcome to the Focus",
 *   "canonical_url": "",
 *   "image": "https://image-generator.buttondown.email/api/emphasize-newsletter?subject=Welcome%20to%20the%20Focus",
 *   "description": "",
 *   "source": "api",
 *   "body": "Welcome to the newsletter...",
 *   "secondary_id": 1,
 *   "email_type": "public",
 *   "slug": "welcome-to-the-focus",
 *   "status": "sent",
 *   "metadata": {},
 *   "commenting_mode": "enabled",
 *   "absolute_url": "https://newsletter.thefocus.ai/archive/welcome-to-the-focus/",
 *   "filters": {
 *     "filters": [],
 *     "groups": [],
 *     "predicate": "and"
 *   },
 *   "analytics": { ... },
 *   "template": null,
 *   "related_email_ids": [],
 *   "is_comments_disabled": false
 * }
 */
export interface ButtondownEmail {
  id: string;
  creation_date: string;
  modification_date: string;
  publish_date: string | null;
  scheduled_for: string | null;
  attachments: any[];
  subject: string;
  canonical_url: string;
  image: string;
  description: string;
  source: string;
  body: string;
  secondary_id: number | null;
  email_type: string;
  slug: string;
  status: "draft" | "scheduled" | "sent";
  metadata: Record<string, any>;
  commenting_mode: "enabled" | "disabled";
  absolute_url: string;
  filters: {
    filters: any[];
    groups: any[];
    predicate: string;
  };
  analytics: ButtondownAnalytics | null;
  template: any | null;
  related_email_ids: string[];
  is_comments_disabled: boolean;
}

/**
 * Request to create a new email
 */
export interface CreateEmailRequest {
  subject: string;
  body: string;
  status: "draft";
  description?: string;
  scheduled_for?: string;
}

/**
 * Request to update an existing email
 */
export interface UpdateEmailRequest {
  subject?: string;
  body?: string;
  description?: string;
  scheduled_for?: string | null;
  status?: "draft" | "scheduled" | "about_to_send";
}

/**
 * Response from the /emails endpoint
 * @example
 * {
 *   "count": 10,
 *   "next": "https://api.buttondown.email/v1/emails?page=2",
 *   "previous": null,
 *   "results": [...]
 * }
 */
export interface ButtondownEmailsResponse {
  results: ButtondownEmail[];
  next: string | null;
  previous: string | null;
  count: number;
}

export interface ButtondownDraft {
  id: string;
  subject: string;
  body: string;
  description?: string;
  status: "draft" | "scheduled" | "sent";
  created_at: string;
  modified_at: string;
  scheduled_for?: string;
  sent_at?: string;
  analytics?: ButtondownAnalytics;
}

export interface ButtondownDraftsResponse {
  count: number;
  results: ButtondownDraft[];
}

/**
 * A Buttondown subscriber
 * @example
 * {
 *   "id": "123",
 *   "email": "user@example.com",
 *   "creation_date": "2024-03-21T04:22:27.517152Z",
 *   "modification_date": "2024-03-21T04:22:27.517152Z",
 *   "metadata": {},
 *   "notes": "",
 *   "tags": [],
 *   "secondary_id": null,
 *   "subscriber_type": "regular",
 *   "source": "api"
 * }
 */
export interface ButtondownSubscriber {
  id: string;
  email: string;
  creation_date: string;
  modification_date: string;
  metadata: Record<string, any>;
  notes: string;
  tags: string[];
  secondary_id: string | null;
  subscriber_type: string;
  source: string;
}

/**
 * Response from the /subscribers endpoint
 */
export interface ButtondownSubscribersResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ButtondownSubscriber[];
}

export interface ButtondownTag {
  id: string;
  name: string;
  description: string;
  creation_date: string;
  modification_date: string;
  subscriber_count: number;
}

export interface ButtondownTagsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ButtondownTag[];
}

/**
 * Response from the /emails?status=scheduled endpoint
 */
export interface ButtondownScheduledEmailsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ButtondownEmail[];
}

/**
 * A point in the timeseries analytics data
 */
export interface ButtondownTimeseriesPoint {
  date: string;
  subscribers: number;
  unsubscribes: number;
  opens: number;
  clicks: number;
}

/**
 * Timeseries analytics data
 */
export interface ButtondownTimeseriesAnalytics {
  start_date: string;
  end_date: string;
  interval: "day" | "week" | "month";
  data: ButtondownTimeseriesPoint[];
  totals: ButtondownAnalytics;
}

export interface ButtondownEmailAnalyticsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ButtondownEmailAnalytics[];
}

/**
 * Response from the /analytics/timeseries endpoint
 */
export interface ButtondownTimeseriesAnalyticsResponse {
  analytics: ButtondownTimeseriesAnalytics;
}
