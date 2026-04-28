/* ============================================================
   APP LAYOUT — Protected shell
   This layout is only rendered when authLoader succeeds.
   It wraps every /app/* route with Sidebar + Navbar.
   The authenticated user is passed into AuthContext so
   Sidebar, Navbar, and Settings can read it without prop drilling.
   ============================================================ */

import { Outlet, useLoaderData } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Navbar from "../components/layout/Navbar";
import { AuthProvider } from "../context/AuthContext";
import type { AuthUser } from "../lib/api/auth";

export default function AppLayout() {
  const user = useLoaderData() as AuthUser;

  return (
    <AuthProvider user={user}>
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
    </AuthProvider>
  );
}
