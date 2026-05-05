/* ============================================================
   APP LAYOUT — Protected shell
   
   FIX: useLoaderData() con lazy loading puede devolver undefined
   en el primer render mientras el chunk se descarga en paralelo.
   Agregamos un guard explícito que redirige a /login si user
   es undefined en lugar de dejar que AuthProvider lance error.
   
   Orden de providers es crítico:
   1. AuthProvider    — Navbar y Sidebar leen user
   2. NotificationsProvider — Navbar lee notifications
   ============================================================ */

import { Outlet, useLoaderData, redirect } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar  from "../components/layout/Navbar";
import { AuthProvider }          from "../context/AuthContext";
import { NotificationsProvider } from "../context/NotificationsContext";
import type { AuthUser } from "../lib/api/auth";

export default function AppLayout() {
  const user = useLoaderData() as AuthUser | undefined;
  const navigate = useNavigate();

  /*
   * Guard defensivo: si por cualquier razón user es undefined
   * (chunk lazy cargando, race condition), redirigir a login.
   * En condiciones normales authLoader siempre devuelve AuthUser
   * o lanza redirect — este caso es el edge case de lazy loading.
   */
  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  if (!user) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "var(--color-background)" }}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="relative w-10 h-10">
            <div
              className="absolute inset-0 rounded-full border-2 border-transparent animate-spin"
              style={{
                borderTopColor: "var(--color-primary)",
                animationDuration: "600ms",
              }}
            />
          </div>
          <p className="text-sm text-[var(--color-text-muted)] font-medium">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider user={user}>
      <NotificationsProvider>
        <div className="flex h-screen bg-[var(--color-background)] overflow-hidden">
          <Sidebar />
          <div className="flex-1 flex flex-col ml-64 overflow-hidden">
            <Navbar />
            <main className="flex-1 overflow-y-auto p-8 no-scrollbar">
              <div className="max-w-7xl mx-auto">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </NotificationsProvider>
    </AuthProvider>
  );
}
