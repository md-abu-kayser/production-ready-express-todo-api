import fs from "fs/promises";
import path from "path";
import { Todo } from "../types/todo";

const DB_PATH = path.join(__dirname, "../../db/todo.json");

export class FileDB {
  private static instance: FileDB;
  private data: Todo[] = [];
  private initialized = false;

  private constructor() {}

  public static getInstance(): FileDB {
    if (!FileDB.instance) {
      FileDB.instance = new FileDB();
    }
    return FileDB.instance;
  }

  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      await fs.access(DB_PATH);
      const data = await fs.readFile(DB_PATH, "utf-8");
      this.data = JSON.parse(data);
    } catch (error) {
      await this.saveToFile();
    }

    this.initialized = true;
  }

  private async saveToFile(): Promise<void> {
    try {
      await fs.writeFile(DB_PATH, JSON.stringify(this.data, null, 2));
    } catch (error) {
      throw new Error(`Failed to save data to file: ${error}`);
    }
  }

  async findAll(): Promise<Todo[]> {
    await this.initialize();
    return [...this.data];
  }

  async findById(id: number): Promise<Todo | undefined> {
    await this.initialize();
    return this.data.find((todo) => todo.id === id);
  }

  async create(
    todo: Omit<Todo, "id" | "createdAt" | "updatedAt">
  ): Promise<Todo> {
    await this.initialize();

    const newTodo: Todo = {
      id: this.generateId(),
      ...todo,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.push(newTodo);
    await this.saveToFile();

    return newTodo;
  }

  async update(
    id: number,
    updates: Partial<Omit<Todo, "id" | "createdAt">>
  ): Promise<Todo | undefined> {
    await this.initialize();

    const index = this.data.findIndex((todo) => todo.id === id);
    if (index === -1) return undefined;

    this.data[index] = {
      ...this.data[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    await this.saveToFile();
    return this.data[index];
  }

  async delete(id: number): Promise<boolean> {
    await this.initialize();

    const index = this.data.findIndex((todo) => todo.id === id);
    if (index === -1) return false;

    this.data.splice(index, 1);
    await this.saveToFile();

    return true;
  }

  async paginate(
    page: number = 1,
    limit: number = 10
  ): Promise<{ data: Todo[]; total: number }> {
    await this.initialize();

    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return {
      data: this.data.slice(startIndex, endIndex),
      total: this.data.length,
    };
  }

  async getStats(): Promise<{
    total: number;
    completed: number;
    pending: number;
  }> {
    await this.initialize();
    const todos = await this.findAll();

    return {
      total: todos.length,
      completed: todos.filter((todo) => todo.completed).length,
      pending: todos.filter((todo) => !todo.completed).length,
    };
  }

  private generateId(): number {
    if (this.data.length === 0) return 1;
    return Math.max(...this.data.map((todo) => todo.id)) + 1;
  }
}
