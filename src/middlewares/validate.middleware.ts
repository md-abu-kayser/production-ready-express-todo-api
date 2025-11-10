import { Request, Response, NextFunction } from "express";

export const validateTodoCreate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { title, body } = req.body;

  if (!title || !body) {
    res.status(400).json({
      success: false,
      error: "Title and body are required",
    });
    return;
  }

  if (typeof title !== "string" || typeof body !== "string") {
    res.status(400).json({
      success: false,
      error: "Title and body must be strings",
    });
    return;
  }

  if (title.trim().length < 3) {
    res.status(400).json({
      success: false,
      error: "Title must be at least 3 characters long",
    });
    return;
  }

  if (body.trim().length === 0) {
    res.status(400).json({
      success: false,
      error: "Body cannot be empty",
    });
    return;
  }

  req.body.title = title.trim();
  req.body.body = body.trim();

  next();
};

export const validateTodoUpdate = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const { title, body, completed } = req.body;

  if (title && (typeof title !== "string" || title.trim().length < 3)) {
    res.status(400).json({
      success: false,
      error: "Title must be at least 3 characters long",
    });
    return;
  }

  if (body && (typeof body !== "string" || body.trim().length === 0)) {
    res.status(400).json({
      success: false,
      error: "Body cannot be empty",
    });
    return;
  }

  if (completed !== undefined && typeof completed !== "boolean") {
    res.status(400).json({
      success: false,
      error: "Completed must be a boolean",
    });
    return;
  }

  if (title) req.body.title = title.trim();
  if (body) req.body.body = body.trim();

  next();
};

export const validateId = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const id = parseInt(req.params.id);

  if (isNaN(id) || id <= 0) {
    res.status(400).json({
      success: false,
      error: "Invalid todo ID",
    });
    return;
  }

  next();
};
