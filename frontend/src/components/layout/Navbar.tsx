/* ============================================================
   NAVBAR
   Campana: abre un dropdown con historial de notificaciones.
   useNotifications provee la lista, unreadCount y markAllRead.
   ============================================================ */

import { useLocation, Link } from "react-router-dom";
import { useRef, useState, useEffect } from "react";
import {
  Search, Bell, Settings,
  CheckCheck, Trash2, Info, CheckCircle, AlertTriangle, XCircle,
} from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";
import { useAuth }          from "../../context/AuthContext";
import { useNotifications } from "../../context/NotificationsContext";
import type { Notification, NotificationType } from "../../context/NotificationsContext";

/* ---- Route title map ------------------------------------- */

const TITLES: Record<string, string> = {
  "/app":              "Dashboard Overview",
  "/app/products":     "Inventory Ledger",
  "/app/products/new": "New Product Entry",
  "/app/settings":     "Settings",
};

function getTitle(pathname: string): string {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.endsWith("/edit")) return "Edit Product";
  return "Streamline";
}

/* ---- Notification icon by type --------------------------- */

const TYPE_ICON: Record<NotificationType, React.ReactNode> = {
  success: <CheckCircle size={14} strokeWidth={2.5} className="text-[var(--color-secondary)]" />,
  error:   <XCircle    size={14} strokeWidth={2.5} className="text-[var(--color-error)]" />,
  warning: <AlertTriangle size={14} strokeWidth={2.5} className="text-[var(--color-warning)]" />,
  info:    <Info       size={14} strokeWidth={2.5} className="text-[var(--color-primary)]" />,
};

const TYPE_BG: Record<NotificationType, string> = {
  success: "bg-[var(--color-secondary-container)]",
  error:   "bg-[var(--color-error-container)]",
  warning: "bg-[var(--color-warning-container)]",
  info:    "bg-[var(--color-primary-container)]",
};

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60)  return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

/* ---- Notification item ----------------------------------- */

function NotificationItem({ n }: { n: Notification }) {
  return (
    <div
      className={[
        "flex items-start gap-3 px-4 py-3 transition-colors",
        !n.read ? "bg-[var(--color-primary-container)]/20" : "",
        "hover:bg-[var(--color-surface-low)]",
      ].join(" ")}
    >
      <div className={["w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5", TYPE_BG[n.type]].join(" ")}>
        {TYPE_ICON[n.type]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-bold text-[var(--color-text-primary)] leading-snug">
            {n.title}
          </p>
          {!n.read && (
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] shrink-0 mt-1" />
          )}
        </div>
        {n.description && (
          <p className="text-xs text-[var(--color-text-muted)] mt-0.5 leading-relaxed truncate">
            {n.description}
          </p>
        )}
        <p className="text-[10px] text-[var(--color-text-muted)] mt-1 font-medium">
          {timeAgo(n.timestamp)}
        </p>
      </div>
    </div>
  );
}

/* ---- Main component -------------------------------------- */

export default function Navbar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const { notifications, unreadCount, markAllRead, clearAll } = useNotifications();

  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const initials = user.name
    .split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

  /* Close on outside click */
  useEffect(() => {
    function handle(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [open]);

  function handleOpen() {
    setOpen((v) => !v);
    if (!open && unreadCount > 0) {
      /* Small delay so the badge disappears after the dropdown opens */
      setTimeout(markAllRead, 600);
    }
  }

  return (
    <header className="w-full sticky top-0 z-40 glass shadow-navbar flex items-center justify-between px-8 h-16 shrink-0 theme-transition">

      {/* LEFT */}
      <div className="flex items-center gap-6">
        <h2 className="text-lg font-extrabold font-headline gradient-text hidden lg:block select-none">
          {getTitle(pathname)}
        </h2>
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
            strokeWidth={2}
            style={{ color: "var(--color-text-muted)" }}
          />
          <input
            type="text"
            placeholder="Search products..."
            className="pl-9 pr-4 py-2 text-sm rounded-xl w-64 transition-all bg-[var(--color-surface-low)] border border-[var(--color-border)] placeholder:text-[var(--color-text-muted)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]"
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-1">
        <ThemeToggle variant="icon" />

        {/* ---- BELL + DROPDOWN ---- */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={handleOpen}
            className="relative p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-container)] rounded-xl transition-all active:scale-95"
            aria-label="Notifications"
          >
            <Bell size={17} strokeWidth={2} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-4 px-0.5 bg-[var(--color-error)] rounded-full flex items-center justify-center text-white text-[9px] font-bold leading-none">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div
              className="absolute right-0 top-full mt-2 w-80 rounded-2xl shadow-lifted border border-[var(--color-border)]/40 overflow-hidden z-50"
              style={{ background: "var(--color-surface)" }}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]/30">
                <div>
                  <h3 className="text-sm font-bold text-[var(--color-text-primary)]">
                    Notifications
                  </h3>
                  <p className="text-[10px] text-[var(--color-text-muted)] font-medium">
                    {notifications.length === 0
                      ? "No notifications"
                      : `${notifications.length} total`}
                  </p>
                </div>
                {notifications.length > 0 && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={markAllRead}
                      title="Mark all read"
                      className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-container)] transition-colors"
                    >
                      <CheckCheck size={13} strokeWidth={2.5} />
                    </button>
                    <button
                      onClick={clearAll}
                      title="Clear all"
                      className="p-1.5 rounded-lg text-[var(--color-text-muted)] hover:text-[var(--color-error)] hover:bg-[var(--color-error-container)] transition-colors"
                    >
                      <Trash2 size={13} strokeWidth={2.5} />
                    </button>
                  </div>
                )}
              </div>

              {/* List */}
              <div className="max-h-80 overflow-y-auto no-scrollbar divide-y divide-[var(--color-border)]/20">
                {notifications.length === 0 ? (
                  <div className="py-10 text-center">
                    <Bell
                      size={28}
                      className="mx-auto text-[var(--color-text-muted)] opacity-30 mb-3"
                      strokeWidth={1.5}
                    />
                    <p className="text-xs text-[var(--color-text-muted)] font-medium">
                      No notifications yet
                    </p>
                    <p className="text-[10px] text-[var(--color-text-muted)] mt-1 opacity-70">
                      Actions like creating or deleting products will appear here
                    </p>
                  </div>
                ) : (
                  notifications.map((n) => <NotificationItem key={n.id} n={n} />)
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div className="px-4 py-2.5 border-t border-[var(--color-border)]/30 bg-[var(--color-surface-low)]/50">
                  <p className="text-[10px] text-[var(--color-text-muted)] text-center font-medium">
                    Last {notifications.length} action{notifications.length !== 1 ? "s" : ""} · session only
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="w-px h-5 bg-[var(--color-border)] mx-2" />

        <Link
          to="/app/settings"
          className="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-xl hover:bg-[var(--color-surface-low)] transition-all active:scale-95 border border-transparent hover:border-[var(--color-border)]"
        >
          <div className="w-7 h-7 btn-gradient rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0">
            {initials}
          </div>
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">
            {user.name.split(" ")[0]}
          </span>
          <Settings size={12} className="text-[var(--color-text-muted)]" strokeWidth={2} />
        </Link>
      </div>
    </header>
  );
}
