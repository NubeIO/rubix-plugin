export interface Project {
  id: number;
  org_id: string;
  name: string;
  description: string;
  status: 'active' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Task {
  id: number;
  org_id: string;
  project_id: number;
  title: string;
  description: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  assigned_user_id: string;
  assigned_user_name: string;
  due_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface TaskStats {
  projectCount: number;
  taskCount: number;
  activeCount: number;
  completedCount: number;
}

export interface PluginContext {
  orgId: string;
  deviceId: string;
  token?: string;
  baseUrl?: string;
}
