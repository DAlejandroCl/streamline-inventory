/* ============================================================
   APP LAYOUT — Protected shell
   Sin lazy loading en este componente — es el shell de la app
   y debe estar disponible síncronamente cuando authLoader resuelve.

   useLoaderData() aquí devuelve el resultado de authLoader,
   que siempre es AuthUser (o redirige a /login si falla).
   ============================================================ */

import { Outlet, useLoaderData } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar  from "../components/layout/Navbar";
import { AuthProvider }          from "../context/AuthContext";
import { NotificationsProvider } from "../context/NotificationsContext";
import type { AuthUser } from "../lib/api/auth";

export default function AppLayout() {
  const user = useLoaderData() as AuthUser;

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
