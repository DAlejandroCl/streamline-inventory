import { NavLink, Link } from "react-router-dom";

type NavItem = {
  to: string;
  label: string;
  icon: string;
  end?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Dashboard", icon: "dashboard", end: true },
  { to: "/products", label: "Inventory", icon: "inventory_2" },
];

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 fixed left-0 top-0 z-50 flex flex-col p-4 gap-1 bg-slate-50 dark:bg-slate-950">
      {/* BRAND */}
      <div className="px-2 py-4 mb-4">
        <h1 className="text-lg font-extrabold text-slate-900 dark:text-white font-headline tracking-tight">
          Streamline
        </h1>
        <p className="text-xs text-[var(--color-on-surface-variant)] font-medium mt-0.5">
          Operational Ledger
        </p>
      </div>

      {/* NAV */}
      <nav className="flex flex-col gap-1 flex-1">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              [
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium",
                "transition-all duration-200 hover:translate-x-1",
                isActive
                  ? "bg-white dark:bg-slate-900 text-[var(--color-primary)] shadow-ambient"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-100",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className="material-symbols-outlined text-xl leading-none"
                  style={isActive ? { fontVariationSettings: "'FILL' 1" } : undefined}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* FOOTER — user + CTA */}
      <div className="p-3 bg-slate-100 dark:bg-slate-900 rounded-xl space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white text-xs font-bold shrink-0">
            A
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-[var(--color-on-surface)] truncate">Admin User</p>
            <p className="text-[10px] text-[var(--color-on-surface-variant)]">Full Access</p>
          </div>
        </div>
        <Link
          to="/products/new"
          className="flex items-center justify-center gap-2 w-full py-2.5 btn-primary-gradient text-white text-xs font-bold rounded-lg shadow-sm hover:scale-[1.02] active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-base leading-none">add</span>
          Create New Product
        </Link>
      </div>
    </aside>
  );
}
