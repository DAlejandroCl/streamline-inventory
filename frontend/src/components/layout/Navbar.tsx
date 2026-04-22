import { useLocation } from "react-router-dom";

const PAGE_TITLES: Record<string, string> = {
  "/":              "Dashboard Overview",
  "/products":      "Inventory Ledger",
  "/products/new":  "New Product Entry",
};

function getTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.endsWith("/edit")) return "Edit Product";
  return "Streamline";
}

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="w-full sticky top-0 z-40 glass-nav border-b border-[var(--color-outline-variant)]/30 shadow-sm flex items-center justify-between px-8 h-16">
      {/* LEFT — brand + search */}
      <div className="flex items-center gap-6">
        <span className="text-xl font-extrabold bg-gradient-to-br from-indigo-700 to-indigo-500 bg-clip-text text-transparent font-headline tracking-tight hidden lg:block">
          {getTitle(pathname)}
        </span>
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-outline)] text-lg pointer-events-none">
            search
          </span>
          <input
            type="text"
            placeholder="Search products..."
            className="pl-10 pr-4 py-2 bg-[var(--color-surface-container-low)] border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 w-72 transition-all placeholder:text-[var(--color-outline)]"
          />
        </div>
      </div>

      {/* RIGHT — actions + user */}
      <div className="flex items-center gap-2">
        <button className="p-2 text-[var(--color-on-surface-variant)] hover:text-[var(--color-primary)] hover:bg-[var(--color-surface-container-low)] rounded-full transition-all active:scale-95">
          <span className="material-symbols-outlined text-xl leading-none">notifications</span>
        </button>

        <div className="w-px h-6 bg-[var(--color-outline-variant)]/40 mx-2" />

        <button className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-[var(--color-surface-container-low)] transition-all active:scale-95">
          <div className="w-8 h-8 rounded-full bg-[var(--color-primary-fixed)] flex items-center justify-center">
            <span className="material-symbols-outlined text-[var(--color-primary)] text-xl leading-none" style={{ fontVariationSettings: "'FILL' 1" }}>
              account_circle
            </span>
          </div>
          <span className="text-sm font-semibold text-[var(--color-on-surface)]">Admin</span>
        </button>
      </div>
    </header>
  );
}
