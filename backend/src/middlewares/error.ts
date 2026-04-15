import { Request, Response, NextFunction } from "express";

// GLOBAL ERROR HANDLER
export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  console.error(error);

  // CUSTOM ERROR
  if (error.message === "Product not found") {
    return res.status(404).json({
      message: error.message
    });
  }

  // DEFAULT ERROR
  res.status(500).json({
    message: "Internal server error"
  });
};