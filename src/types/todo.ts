export interface Todo {
  id: number;
  title: string;
  body: string;
  completed: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateTodoRequest {
  title: string;
  body: string;
}

export interface UpdateTodoRequest {
  title?: string;
  body?: string;
  completed?: boolean;
}

export interface TodoResponse {
  success: boolean;
  data?: Todo | Todo[];
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginatedResponse {
  success: boolean;
  data: Todo[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
