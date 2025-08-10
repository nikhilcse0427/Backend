import { ApiError } from "../utils/ApiError.js";

/**
 * Global Error Handler Middleware
 * Handles all errors thrown in the application
 */
export const errorHandler = (err, req, res, next) => {
  let error = err;

  // Log error for debugging (in production, you might want to use a logging service)
  console.error("🚨 Error occurred:", {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
    userAgent: req.get('User-Agent'),
    ip: req.ip
  });

  // If the error is not an instance of ApiError, convert it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error?.errors, error.stack);
  }

  // Handle specific error types
  if (error.name === "ValidationError") {
    const message = Object.values(error.errors).map(val => val.message).join(", ");
    error = new ApiError(400, message);
  }

  if (error.name === "CastError") {
    const message = `Invalid ${error.path}: ${error.value}`;
    error = new ApiError(400, message);
  }

  if (error.code === 11000) {
    const message = `Duplicate ${Object.keys(error.keyValue)} entered`;
    error = new ApiError(409, message);
  }

  if (error.name === "JsonWebTokenError") {
    const message = "Invalid token";
    error = new ApiError(401, message);
  }

  if (error.name === "TokenExpiredError") {
    const message = "Token expired";
    error = new ApiError(401, message);
  }

  // Handle multer errors
  if (error.code === "LIMIT_FILE_SIZE") {
    const message = "File size too large";
    error = new ApiError(400, message);
  }

  if (error.code === "LIMIT_UNEXPECTED_FILE") {
    const message = "Unexpected file field";
    error = new ApiError(400, message);
  }

  // Prepare response based on environment
  const response = {
    success: false,
    message: error.message,
    ...(process.env.NODE_ENV === "development" && { stack: error.stack })
  };

  // Add errors array if present
  if (error.errors && error.errors.length > 0) {
    response.errors = error.errors;
  }

  // Send response
  return res.status(error.statusCode).json(response);
};

/**
 * Async Error Handler Wrapper
 * Wraps async functions to automatically catch errors
 */
export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 Handler for undefined routes
 */
export const notFoundHandler = (req, res, next) => {
  const error = new ApiError(404, `Route ${req.originalUrl} not found`);
  next(error);
}; 