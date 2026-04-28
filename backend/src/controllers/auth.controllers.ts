/* ============================================================
   AUTH CONTROLLERS
   Thin orchestrators — delegate all logic to auth.service.ts.
   Express 5 async errors propagate without try-catch.

   Cookie strategy:
   - httpOnly: JS cannot read the token (XSS safe)
   - sameSite: "strict" prevents CSRF on same-origin
   - secure: true in production (HTTPS only)
   - maxAge: 7 days in ms matching JWT expiry
   ============================================================ */

import { Request, Response } from "express";
import * as authService from "../services/auth.service.js";

const COOKIE_NAME = "token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "strict" as const,
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
  };
}

/* POST /api/auth/login */
export async function login(req: Request, res: Response): Promise<void> {
  const { token, user } = await authService.login(req.body);
  res.cookie(COOKIE_NAME, token, cookieOptions());
  res.status(200).json({ user });
}

/* POST /api/auth/logout */
export function logout(_req: Request, res: Response): void {
  res.clearCookie(COOKIE_NAME, cookieOptions());
  res.status(200).json({ message: "Logged out successfully" });
}

/* GET /api/auth/me */
export async function me(_req: Request, res: Response): Promise<void> {
  const user = await authService.getUserById(res.locals.user.id);
  res.status(200).json({ user });
}
