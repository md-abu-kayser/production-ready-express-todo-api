import { FileDB } from '../utils/file-db';
import { Todo, CreateTodoRequest, UpdateTodoRequest, PaginationParams } from '../types/todo';

export class TodoRepository {
  private db: FileDB;

  constructor() {
    this.db = FileDB.getInstance();
  }

  async getAll(): Promise<Todo[]> {
    return await this.db.findAll();
  }

  async getById(id: number): Promise<Todo | undefined> {
    return await this.db.findById(id);
  }

  async create(todoData: CreateTodoRequest): Promise<Todo> {
    return await this.db.create({
      ...todoData,
      completed: false
    });
  }

  async update(id: number, todoData: UpdateTodoRequest): Promise<Todo | undefined> {
    return await this.db.update(id, todoData);
  }

  async delete(id: number): Promise<boolean> {
    return await this.db.delete(id);
  }

  async paginate(params: PaginationParams): Promise<{ data: Todo[]; total: number }> {
    const page = params.page || 1;
    const limit = params.limit || 10;
    
    return await this.db.paginate(page, limit);
  }

  async getStats(): Promise<{ total: number; completed: number; pending: number }> {
    return await this.db.getStats();
  }
}