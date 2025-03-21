export interface ButtondownEmail {
  id: string;
  subject: string;
  body: string;
  status: "draft" | "scheduled" | "published";
  created_at: string;
  updated_at: string;
  scheduled_for?: string | null;
  published_at?: string;
  creation_date?: string;
  modification_date?: string;
  analytics?: {
    recipients?: number;
    deliveries?: number;
    opens?: number;
    clicks?: number;
    open_rate?: number;
    click_rate?: number;
    unsubscribe_rate?: number;
  };
}
