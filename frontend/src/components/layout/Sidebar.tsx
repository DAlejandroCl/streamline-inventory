import { NavLink, Link } from "react-router-dom";
import { LayoutDashboard, Package, Plus, ChevronRight } from "lucide-react";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  end?: boolean;
};

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/products", label: "Inventory", icon: Package },
];

export default function Sidebar() {
  return (
    <aside
      className="h-screen w-64 fixed left-0 top-0 z-50 flex flex-col"
      style={{ background: "var(--color-sidebar-bg)" }}
    >
      {/* BRAND */}
      <div className="px-6 pt-7 pb-6 border-b border-white/8">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 btn-gradient rounded-lg flex items-center justify-center shadow-lifted shrink-0">
            <Package size={16} className="text-white" strokeWidth={2.5} />
          </div>
          <div>
            <h1 className="text-[15px] font-extrabold text-white font-headline leading-tight tracking-tight">
              Streamline
            </h1>
            <p className="text-[10px] text-slate-500 font-medium leading-none mt-0.5">
              Operational Ledger
            </p>
          </div>
        </div>
      </div>

      {/* NAV */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto no-scrollbar">
        <p className="text-[9px] font-bold uppercase tracking-widest text-slate-600 px-3 mb-3">
          Navigation
        </p>
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              [
                "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold",
                "transition-all duration-200 group",
                isActive
                  ? "sidebar-active bg-white/8 text-white"
                  : "text-slate-400 hover:bg-white/5 hover:text-slate-200 hover:translate-x-0.5",
              ].join(" ")
            }
          >
            {({ isActive }) => (
              <>
                <span className={["p-1.5 rounded-lg transition-colors", isActive ? "bg-[var(--color-primary)/30" : "group-hover:bg-white/5"].join(" ")}>
                  <Icon size={15} strokeWidth={isActive ? 2.5 : 2} />
                </span>
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight size={13} className="opacity-60" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="px-3 pb-5 space-y-3 border-t border-white/8 pt-4">
        <div className="flex items-center gap-3 px-2">
          <div className="w-8 h-8 btn-gradient rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-card">
            A
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">Admin User</p>
            <p className="text-[10px] text-slate-500">Full Access</p>
          </div>
        </div>
        <Link
          to="/products/new"
          className="flex items-center justify-center gap-2 w-full py-2.5 btn-gradient text-white text-xs font-bold rounded-xl transition-all hover:shadow-lifted active:scale-95"
        >
          <Plus size={14} strokeWidth={2.5} />
          Create New Product
        </Link>
      </div>
    </aside>
  );
}
