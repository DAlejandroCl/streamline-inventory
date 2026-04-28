/* ============================================================
   LOGOUT ACTION
   Calls the backend logout endpoint (clears the httpOnly cookie)
   then redirects to /login.
   ============================================================ */

import { redirect } from "react-router-dom";
import { logoutRequest } from "../../../lib/api/auth";

export async function logoutAction(): Promise<Response> {
  await logoutRequest();
  return redirect("/login");
}
