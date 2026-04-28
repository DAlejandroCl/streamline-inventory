/* ============================================================
   AUTH MIDDLEWARE
   requireAuth: reads the httpOnly cookie, verifies the JWT,
   and attaches the decoded payload to res.locals.user.

   Express 5 + async: no try-catch needed — errors propagate
   to the global errorHandler automatically.
   ============================================================ */

import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../services/auth.service.js";
import type { JwtPayload } from "../types/auth.dto.js";

/* Extend Express locals for type safety */
declare module "express-serve-static-core" {
  interface Locals {
    user: JwtPayload;
  }
}

export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token: string | undefined = req.cookies?.token;

  if (!token) {
    res.status(401).json({ message: "Authentication required" });
    return;
  }

  const payload = verifyToken(token);
  res.locals.user = payload;
  next();
}
