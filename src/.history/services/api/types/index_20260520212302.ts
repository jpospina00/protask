export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  password?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  progress: number;
  owner: string;
  startDate: string;
  endDate: string;
  status: "active" | "completed" | "paused";
  teamMembers: string[];
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  assignedTo: string;
  status: "pending" | "in_progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: string;
  createdAt: string;
  attachments: string[];
  comments: string[];
}

export interface Notification {
  id: string;
  type: string;
  message: string;
  userId: string;
  projectId: string;
  taskId: string;
  read: boolean;
  createdAt: string;
}
