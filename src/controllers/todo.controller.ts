import { Request, Response } from "express";
import { TodoService } from "../services/todo.service";
import { asyncHandler } from "../middlewares/async-handler";
import { PaginationParams } from "../types/todo";

const todoService = new TodoService();

export const getTodos = asyncHandler(async (_req: Request, res: Response) => {
  const response = await todoService.getAllTodos();

  const statusCode = response.success ? 200 : 400;
  res.status(statusCode).json(response);
});

export const getTodo = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const response = await todoService.getTodoById(id);

  const statusCode = response.success ? 200 : 404;
  res.status(statusCode).json(response);
});

export const createTodo = asyncHandler(async (req: Request, res: Response) => {
  const response = await todoService.createTodo(req.body);

  const statusCode = response.success ? 201 : 400;
  res.status(statusCode).json(response);
});

export const updateTodo = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const response = await todoService.updateTodo(id, req.body);

  const statusCode = response.success ? 200 : 400;
  res.status(statusCode).json(response);
});

export const deleteTodo = asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const response = await todoService.deleteTodo(id);

  const statusCode = response.success ? 200 : 404;
  res.status(statusCode).json(response);
});

export const getPaginatedTodos = asyncHandler(
  async (req: Request, res: Response) => {
    const paginationParams: PaginationParams = {
      page: req.query.page ? parseInt(req.query.page as string) : 1,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 10,
    };

    if (paginationParams.page && paginationParams.page < 1) {
      res.status(400).json({
        success: false,
        error: "Page must be greater than 0",
      });
      return;
    }

    if (
      paginationParams.limit &&
      (paginationParams.limit < 1 || paginationParams.limit > 100)
    ) {
      res.status(400).json({
        success: false,
        error: "Limit must be between 1 and 100",
      });
      return;
    }

    const response = await todoService.getPaginatedTodos(paginationParams);
    res.status(200).json(response);
  }
);

export const getStats = asyncHandler(async (_req: Request, res: Response) => {
  const response = await todoService.getTodoStats();

  const statusCode = response.success ? 200 : 400;
  res.status(statusCode).json(response);
});
