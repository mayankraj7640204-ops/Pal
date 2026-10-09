export interface ActionTask {
  id: string;
  task_description: string;
  due_date?: string | null;
  source_context?: string;
  is_completed: boolean;
  is_revised?: boolean;
  requires_print?: boolean;
  user_id?: string;
}

export interface ExtractedLink {
  id: string;
  url: string;
  title: string;
  platform_type: string;
  shared_by: string;
  created_at: string;
  user_id?: string;
}

export interface SAARApiResponse<T> {
  data?: T;
  error?: string;
  details?: any;
}
