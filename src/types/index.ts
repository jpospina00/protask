export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  password?: string;
}

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'overdue';
export type TaskPriority = 'low' | 'medium' | 'high';
export type ProjectStatus = 'active' | 'on_hold' | 'completed';

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  date: string;
}

export interface Attachment {
  id: string;
  name: string;
  type: 'pdf' | 'image';
  url: string;
  uploadedBy: string;
  uploadedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assignedTo: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string;
  createdAt: string;
  attachments: Attachment[];
  comments: Comment[];
}

export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  owner: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
  teamMembers: string[];
}

export interface Notification {
  id: string;
  type: 'task_assigned' | 'task_completed' | 'task_overdue' | 'project_updated' | 'user_added' | 'comment_added';
  message: string;
  userId: string;
  projectId?: string;
  taskId?: string;
  read: boolean;
  createdAt: string;
}
