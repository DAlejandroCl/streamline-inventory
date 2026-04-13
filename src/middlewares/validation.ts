import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

// VALIDATION MIDDLEWARE
export const handleInputErrors = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array()
    });
  }

  next();
};