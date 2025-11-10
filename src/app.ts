import express, { Application, Request, Response } from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";
import todoRoutes from "./routes/todo.routes";
import { notFoundHandler } from "./middlewares/not-found.middleware";
import { errorHandler } from "./middlewares/error.middleware";
import { specs } from "./swagger/swagger";

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middleware
    this.app.use(helmet());

    // CORS middleware
    this.app.use(
      cors({
        origin: process.env.CORS_ORIGIN || "*",
        credentials: true,
      })
    );

    // Compression middleware
    this.app.use(compression());

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: {
        success: false,
        error: "Too many requests from this IP, please try again later.",
      },
    });
    this.app.use(limiter);

    // Body Parsing middleware
    this.app.use(express.json({ limit: "10kb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "10kb" }));

    // Logging middleware
    if (process.env.NODE_ENV === "development") {
      this.app.use(morgan("dev"));
    } else {
      this.app.use(morgan("combined"));
    }

    // Static files
    this.app.use(express.static("public"));
  }

  private initializeRoutes(): void {
    this.app.get("/health", (_req: Request, res: Response) => {
      res.status(200).json({
        success: true,
        message: "Server is healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    });

    // API routes
    this.app.use("/api/todos", todoRoutes);

    // Swagger Documentation
    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(specs, {
        explorer: true,
        customCss: ".swagger-ui .topbar { display: none }",
        customSiteTitle: "Todo API Documentation",
      })
    );

    // Home route
    this.app.get("/", (_req: Request, res: Response) => {
      res.json({
        success: true,
        message: "Welcome to Todo API",
        documentation: "/api-docs",
        endpoints: {
          todos: "/api/todos",
          health: "/health",
        },
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }
}

export default new App().app;
