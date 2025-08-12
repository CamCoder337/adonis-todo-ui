export interface User {
  id: number;
  email: string;
  fullName: string | null;
  createdAt: string;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  isCompleted: boolean;
  isPublic: boolean;
  userId: number;
  createdAt: string;
  updatedAt: string;
  owner: User;
  subscribers?: User[];
}

export interface Notification {
  id: number;
  userId: number;
  message: string;
  type: 'task_updated' | 'task_completed' | 'task_deleted' | 'new_subscriber';
  isRead: boolean;
  relatedTaskId: number | null;
  createdAt: string;
  relatedTask?: Task;
}

export interface TaskSubscription {
  id: number;
  userId: number;
  taskId: number;
  createdAt: string;
  task: Task;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ApiError {
  message: string;
  statusCode?: number;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface TaskFilters {
  search?: string;
  isCompleted?: boolean;
  isPublic?: boolean;
  page?: number;
  limit?: number;
}

export interface NotificationFilters {
  isRead?: boolean;
  type?: Notification['type'];
  page?: number;
  limit?: number;
}

export interface TaskFormData {
  title: string;
  description?: string;
  isPublic?: boolean;
}

export interface AuthFormData {
  email: string;
  password: string;
  fullName?: string;
}

export interface UserProfile {
  fullName?: string;
  email: string;
}