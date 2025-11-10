import { TodoRepository } from "../repositories/todo.repository";
import {
  CreateTodoRequest,
  UpdateTodoRequest,
  TodoResponse,
  PaginationParams,
  PaginatedResponse,
} from "../types/todo";

export class TodoService {
  private todoRepository: TodoRepository;

  constructor() {
    this.todoRepository = new TodoRepository();
  }

  async getAllTodos(): Promise<TodoResponse> {
    try {
      const todos = await this.todoRepository.getAll();
      return {
        success: true,
        data: todos,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch todos",
      };
    }
  }

  async getTodoById(id: number): Promise<TodoResponse> {
    try {
      const todo = await this.todoRepository.getById(id);

      if (!todo) {
        return {
          success: false,
          error: `Todo with ID ${id} not found`,
        };
      }

      return {
        success: true,
        data: todo,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch todo",
      };
    }
  }

  async createTodo(todoData: CreateTodoRequest): Promise<TodoResponse> {
    try {
      if (!todoData.title || !todoData.body) {
        return {
          success: false,
          error: "Title and body are required",
        };
      }

      if (todoData.title.length < 3) {
        return {
          success: false,
          error: "Title must be at least 3 characters long",
        };
      }

      const todo = await this.todoRepository.create(todoData);

      return {
        success: true,
        data: todo,
        message: "Todo created successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to create todo",
      };
    }
  }

  async updateTodo(
    id: number,
    todoData: UpdateTodoRequest
  ): Promise<TodoResponse> {
    try {
      const existingTodo = await this.todoRepository.getById(id);

      if (!existingTodo) {
        return {
          success: false,
          error: `Todo with ID ${id} not found`,
        };
      }

      const updatedTodo = await this.todoRepository.update(id, todoData);

      if (!updatedTodo) {
        return {
          success: false,
          error: "Failed to update todo",
        };
      }

      return {
        success: true,
        data: updatedTodo,
        message: "Todo updated successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to update todo",
      };
    }
  }

  async deleteTodo(id: number): Promise<TodoResponse> {
    try {
      const existingTodo = await this.todoRepository.getById(id);

      if (!existingTodo) {
        return {
          success: false,
          error: `Todo with ID ${id} not found`,
        };
      }

      const deleted = await this.todoRepository.delete(id);

      if (!deleted) {
        return {
          success: false,
          error: "Failed to delete todo",
        };
      }

      return {
        success: true,
        message: "Todo deleted successfully",
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to delete todo",
      };
    }
  }

  async getPaginatedTodos(
    params: PaginationParams
  ): Promise<PaginatedResponse> {
    try {
      const { data, total } = await this.todoRepository.paginate(params);
      const page = params.page || 1;
      const limit = params.limit || 10;
      const totalPages = Math.ceil(total / limit);

      return {
        success: true,
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      };
    } catch (error) {
      throw new Error("Failed to fetch paginated todos");
    }
  }

  async getTodoStats(): Promise<TodoResponse> {
    try {
      const stats = await this.todoRepository.getStats();

      return {
        success: true,
        data: stats as any,
      };
    } catch (error) {
      return {
        success: false,
        error: "Failed to fetch todo statistics",
      };
    }
  }
}
