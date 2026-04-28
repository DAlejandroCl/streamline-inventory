/* ============================================================
   AUTH LOADER
   Used as the loader for the protected /app layout route.
   Calls GET /api/auth/me (sends the httpOnly cookie).
   - Valid cookie  → returns AuthUser, layout renders
   - 401 / no cookie → throws redirect to /login
   ============================================================ */

import { redirect } from "react-router-dom";
import { meRequest } from "../../../lib/api/auth";
import type { AuthUser } from "../../../lib/api/auth";

export async function authLoader(): Promise<AuthUser> {
  try {
    return await meRequest();
  } catch {
    throw redirect("/login");
  }
}
