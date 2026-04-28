/* ============================================================
   AUTH CONTEXT
   Provides the authenticated user to every component inside
   the protected /app layout without prop drilling.

   The user data comes from the authLoader — it is always
   present when this context is rendered (the loader redirects
   to /login if no valid session exists).
   ============================================================ */

import { createContext, useContext } from "react";
import type { AuthUser } from "../lib/api/auth";

type AuthContextValue = {
  user: AuthUser;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  user,
  children,
}: {
  user: AuthUser;
  children: React.ReactNode;
}) {
  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
