export interface Draft {
  id: string;
  title: string;
  content: string;
  status: "draft" | "scheduled" | "published";
  created_at: string;
  updated_at: string;
  scheduled_for?: string;
  published_at?: string;
  subscriber_count?: number;
  open_rate?: number;
  click_rate?: number;
  scheduled_time?: string;
}
