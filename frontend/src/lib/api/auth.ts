/* ============================================================
   AUTH API CLIENT
   Single source of truth for all /api/auth calls.
   The browser automatically sends the httpOnly cookie on
   every same-origin request — no manual token handling needed.
   ============================================================ */

const BASE = import.meta.env.VITE_API_URL;
const AUTH_URL = `${BASE}/api/auth`;

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

/* ---- LOGIN ----------------------------------------------- */

export async function loginRequest(
  email: string,
  password: string
): Promise<AuthUser> {
  const res = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { message?: string }).message ?? "Login failed");
  }

  const data = await res.json() as { user: AuthUser };
  return data.user;
}

/* ---- LOGOUT ---------------------------------------------- */

export async function logoutRequest(): Promise<void> {
  await fetch(`${AUTH_URL}/logout`, {
    method: "POST",
    credentials: "include",
  });
}

/* ---- ME -------------------------------------------------- */

export async function meRequest(): Promise<AuthUser> {
  const res = await fetch(`${AUTH_URL}/me`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Not authenticated");

  const data = await res.json() as { user: AuthUser };
  return data.user;
}
