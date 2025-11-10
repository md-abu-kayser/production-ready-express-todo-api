import app from "./app";

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

// Handle Uncaught Exceptions
process.on("uncaughtException", (error: Error) => {
  console.error("UNCAUGHT EXCEPTION! Shutting down...");
  console.error(error.name, error.message);
  process.exit(1);
});

const server = app.listen(PORT, () => {
  console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
  console.log(
    `API Documentation available at http://localhost:${PORT}/api-docs`
  );
  console.log(`Health check at http://localhost:${PORT}/health`);
});

// Handle Unhandled Promise Rejections
process.on("unhandledRejection", (error: Error) => {
  console.error("UNHANDLED REJECTION! Shutting down...");
  console.error(error.name, error.message);
  server.close(() => {
    process.exit(1);
  });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM RECEIVED. Shutting down gracefully");
  server.close(() => {
    console.log("Process terminated!");
  });
});

export default server;
