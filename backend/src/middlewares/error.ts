/* ============================================================
   GLOBAL ERROR HANDLER
   Must be registered LAST in server.ts after all routes.
   Handles AppError (typed, operational errors) and unknown
   errors (bugs, unhandled rejections) separately.
   ============================================================ */

import { Request, Response, NextFunction } from "express";
import { AppError } from "../types/AppError.js";

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error(error);

  if (error instanceof AppError) {
    res.status(error.statusCode).json({ message: error.message });
    return;
  }

  res.status(500).json({ message: "Internal server error" });
};