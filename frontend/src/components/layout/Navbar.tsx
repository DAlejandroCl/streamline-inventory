import { useLocation } from "react-router-dom";
import { Search, Bell, ChevronDown } from "lucide-react";
import ThemeToggle from "../ui/ThemeToggle";

const TITLES: Record<string, string> = {
  "/":             "Dashboard Overview",
  "/products":     "Inventory Ledger",
  "/products/new": "New Product Entry",
};

function getTitle(pathname: string) {
  if (TITLES[pathname]) return TITLES[pathname];
  if (pathname.endsWith("/edit")) return "Edit Product";
  return "Streamline";
}

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="w-full sticky top-0 z-40 glass shadow-navbar flex items-center justify-between px-8 h-16 shrink-0 theme-transition">
      {/* LEFT — title + search */}
      <div className="flex items-center gap-6">
        <h2 className="text-lg font-extrabold font-headline gradient-text hidden lg:block select-none">
          {getTitle(pathname)}
        </h2>

        <div className="relative">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
            strokeWidth={2}
          />
          <input
            type="text"
            placeholder="Search products..."
            className={[
              "pl-9 pr-4 py-2 text-sm rounded-xl w-64 transition-all",
              "bg-[var(--color-surface-low)] border border-[var(--color-border)]",
              "placeholder:text-[var(--color-text-muted)] text-[var(--color-text-primary)]",
              "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)]",
            ].join(" ")}
          />
        </div>
      </div>

      {/* RIGHT — theme toggle + notifications + user */}
      <div className="flex items-center gap-1">
        {/* Theme toggle — icon mode in navbar */}
        <ThemeToggle variant="icon" />

        <button className="relative p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-container)] rounded-xl transition-all active:scale-95">
          <Bell size={17} strokeWidth={2} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[var(--color-error)] rounded-full" />
        </button>

        <div className="w-px h-5 bg-[var(--color-border)] mx-2" />

        <button className="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-xl hover:bg-[var(--color-surface-low)] transition-all active:scale-95 border border-transparent hover:border-[var(--color-border)]">
          <div className="w-7 h-7 btn-gradient rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0">
            A
          </div>
          <span className="text-sm font-semibold text-[var(--color-text-primary)]">Admin</span>
          <ChevronDown size={13} className="text-[var(--color-text-muted)]" strokeWidth={2} />
        </button>
      </div>
    </header>
  );
}
