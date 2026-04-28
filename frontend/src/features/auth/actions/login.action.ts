/* ============================================================
   LOGIN ACTION
   React Router 7 action for the /login route.
   On success: redirects to /app (the protected layout).
   On failure: returns the error message for the form to show.
   ============================================================ */

import { redirect, type ActionFunctionArgs } from "react-router-dom";
import { loginRequest } from "../../../lib/api/auth";

type LoginActionResult = { error: string } | Response;

export async function loginAction({
  request,
}: ActionFunctionArgs): Promise<LoginActionResult> {
  const formData = await request.formData();
  const email    = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  try {
    await loginRequest(email, password);
    return redirect("/app");
  } catch (err) {
    const message = err instanceof Error ? err.message : "Login failed.";
    return { error: message };
  }
}
