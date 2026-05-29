/* ============================================================
   AUTH CONTROLLERS
   Thin orchestrators — delegate all logic to auth.service.ts.
   Express 5 async errors propagate without try-catch.

   Cookie strategy:
   - httpOnly: JS cannot read the token (XSS safe)
   - sameSite: "lax" — permite cookies en requests cross-origin
     de primera parte (navegación top-level). Compatible con el
     setup de CI donde frontend (4173) y backend (3000) son
     puertos distintos en localhost.
     En producción, frontend y backend comparten dominio via
     proxy (Vercel → Render), por lo que "lax" es igualmente
     seguro y suficiente contra CSRF.
   - secure: true en producción (HTTPS only)
   - maxAge: 7 días en ms
   ============================================================ */

import { Request, Response } from "express";
import * as authService from "../services/auth.service.js";

const COOKIE_NAME    = "token";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,   // "strict" bloqueaba cookies en cross-origin (CI/dev)
    secure:   process.env.NODE_ENV === "production",
    maxAge:   COOKIE_MAX_AGE,
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
