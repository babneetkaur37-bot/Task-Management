export interface Task {
  task_id?: number;
  task_type_id: number;
  title: string;
  description: string;
  created_by: number;
  assigned_to: number;
  assignee_name?: string; // From the Join
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  task_state_id: number;
  org_id: number;
}

export interface User {
  id: number;
  username: string;
}
