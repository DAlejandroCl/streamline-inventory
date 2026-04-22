import { useLoaderData, Link } from "react-router-dom";
import {
  Plus, TrendingUp, AlertTriangle, Package, BarChart3,
  ArrowRight, FileText, ArrowUpRight,
} from "lucide-react";
import type { Product } from "../features/products/types/products";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import PageHeader from "../components/layout/PageHeader";
import ProductCard from "../features/products/components/ProductCard";
import { formatCurrency } from "../lib/utils/formatCurrency";

/* ---- Compute metrics from loader data -------------------- */

function useMetrics(products: Product[]) {
  const total = products.length;
  const available = products.filter((p) => p.availability).length;
  const outOfStock = total - available;
  const totalValue = products.reduce((s, p) => s + p.price, 0);
  const avgPrice = total > 0 ? totalValue / total : 0;
  const stockRate = total > 0 ? Math.round((available / total) * 100) : 0;
  return { total, available, outOfStock, totalValue, avgPrice, stockRate };
}

/* ---- MetricCard ------------------------------------------ */

type MetricCardProps = {
  label: string;
  value: string;
  sub: string;
  icon: React.ReactNode;
  accent: "primary" | "error" | "secondary" | "none";
  trend?: { value: string; up: boolean };
};

function MetricCard({ label, value, sub, icon, accent, trend }: MetricCardProps) {
  const valueColors: Record<string, string> = {
    primary:   "text-[var(--color-primary)]",
    error:     "text-[var(--color-error)]",
    secondary: "text-[var(--color-secondary)]",
    none:      "text-[var(--color-text-primary)]",
  };
  const iconBg: Record<string, string> = {
    primary:   "bg-[var(--color-primary-container)]",
    error:     "bg-[var(--color-error-container)]",
    secondary: "bg-[var(--color-secondary-container)]",
    none:      "bg-[var(--color-surface-high)]",
  };

  return (
    <Card accent={accent}>
      <div className="flex items-start justify-between mb-4">
        <div className={["w-10 h-10 rounded-xl flex items-center justify-center", iconBg[accent]].join(" ")}>
          {icon}
        </div>
        {trend && (
          <span className={["flex items-center gap-0.5 text-xs font-bold", trend.up ? "text-[var(--color-secondary)" : "text-[var(--color-error)"].join(" ")}>
            <ArrowUpRight size={12} strokeWidth={3} className={trend.up ? "" : "rotate-90"} />
            {trend.value}
          </span>
        )}
      </div>
      <p className="text-[11px] font-bold uppercase tracking-widest text-[var(--color-text-muted) mb-1">
        {label}
      </p>
      <p className={["text-3xl font-extrabold font-headline tabular", valueColors[accent]].join(" ")}>
        {value}
      </p>
      <p className="text-xs text-[var(--color-text-muted) font-medium mt-1.5">{sub}</p>
    </Card>
  );
}

/* ---- Page ------------------------------------------------- */

export default function DashboardPage() {
  const products = useLoaderData() as Product[];
  const { total, available, outOfStock, totalValue, avgPrice, stockRate } = useMetrics(products);

  const recentProducts = [...products]
    .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
    .slice(0, 5);

  const QUICK_ACTIONS = [
    { to: "/products/new", icon: <Plus size={18} className="text-[var(--color-primary)" strokeWidth={2} />, label: "Add Product", sub: "Create new entry", bg: "bg-[var(--color-primary-container)" },
    { to: "/products",     icon: <Package size={18} className="text-[var(--color-secondary)" strokeWidth={2} />, label: "View Inventory", sub: `${total} entries`, bg: "bg-[var(--color-secondary-container)" },
    { to: "http://localhost:3000/docs", icon: <FileText size={18} className="text-[var(--color-text-secondary)" strokeWidth={2} />, label: "API Docs", sub: "Swagger UI", bg: "bg-[var(--color-surface-high)", external: true },
  ];

  return (
    <div className="space-y-10">
      <PageHeader
        title="Dashboard Overview"
        description="Real-time status of the operational ledger."
        action={
          <Link to="/products/new">
            <Button icon={Plus} size="lg">Create New Product</Button>
          </Link>
        }
      />

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <MetricCard
          label="Inventory Value"
          value={formatCurrency(totalValue)}
          sub="Total asset value"
          icon={<TrendingUp size={18} className="text-[var(--color-primary)" strokeWidth={2} />}
          accent="primary"
        />
        <MetricCard
          label="Out of Stock"
          value={outOfStock.toString()}
          sub={outOfStock > 0 ? "Requires attention" : "All items stocked"}
          icon={<AlertTriangle size={18} className="text-[var(--color-error)" strokeWidth={2} />}
          accent={outOfStock > 0 ? "error" : "none"}
        />
        <MetricCard
          label="Total Products"
          value={total.toString()}
          sub={`${available} available`}
          icon={<Package size={18} className="text-[var(--color-text-secondary)" strokeWidth={2} />}
          accent="none"
        />
        <MetricCard
          label="Avg. Price"
          value={formatCurrency(avgPrice)}
          sub="Across catalog"
          icon={<BarChart3 size={18} className="text-[var(--color-secondary)" strokeWidth={2} />}
          accent="secondary"
        />
      </div>

      {/* CENTRAL GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* RECENT PRODUCTS */}
        <div className="lg:col-span-2 bg-[var(--color-surface) rounded-2xl shadow-card border border-[var(--color-border)/40 overflow-hidden">
          <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-[var(--color-border)/30">
            <div>
              <h2 className="text-base font-bold text-[var(--color-text-primary) font-headline">Recent Products</h2>
              <p className="text-xs text-[var(--color-text-muted) mt-0.5">Latest additions to the ledger</p>
            </div>
            <Link
              to="/products"
              className="flex items-center gap-1 text-xs font-bold text-[var(--color-primary) hover:text-[var(--color-primary-hover) transition-colors"
            >
              View all <ArrowRight size={12} strokeWidth={2.5} />
            </Link>
          </div>

          <div className="px-3 py-2">
            {recentProducts.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <Package size={36} className="mx-auto text-[var(--color-text-muted) opacity-30" strokeWidth={1.5} />
                <p className="text-sm text-[var(--color-text-muted)">
                  No products yet.{" "}
                  <Link to="/products/new" className="text-[var(--color-primary) font-semibold hover:underline">
                    Create one
                  </Link>
                </p>
              </div>
            ) : (
              recentProducts.map((p) => <ProductCard key={p.id} product={p} />)
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="flex flex-col gap-5">

          {/* QUICK ACTIONS */}
          <div className="bg-[var(--color-surface) rounded-2xl shadow-card border border-[var(--color-border)/40 p-5">
            <h2 className="text-sm font-bold text-[var(--color-text-primary) font-headline mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {QUICK_ACTIONS.map((item) => {
                const inner = (
                  <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--color-surface-low) transition-colors duration-150 group cursor-pointer">
                    <div className={["w-9 h-9 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200", item.bg].join(" ")}>
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[var(--color-text-primary)">{item.label}</p>
                      <p className="text-xs text-[var(--color-text-muted)">{item.sub}</p>
                    </div>
                    <ArrowRight size={13} className="text-[var(--color-text-muted) opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={2.5} />
                  </div>
                );
                return item.external ? (
                  <a key={item.label} href={item.to} target="_blank" rel="noopener noreferrer">{inner}</a>
                ) : (
                  <Link key={item.label} to={item.to}>{inner}</Link>
                );
              })}
            </div>
          </div>

          {/* STOCK SUMMARY */}
          <div className="bg-[var(--color-surface) rounded-2xl shadow-card border border-[var(--color-border)/40 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-[var(--color-text-primary) font-headline">Stock Summary</h2>
              <Badge variant={stockRate >= 75 ? "success" : stockRate >= 50 ? "warning" : "danger"}>
                {stockRate}% stocked
              </Badge>
            </div>

            <div className="space-y-4">
              {[
                { label: "Available", count: available, color: "bg-[var(--color-secondary)]", variant: "success" as const },
                { label: "Out of stock", count: outOfStock, color: "bg-[var(--color-error)]", variant: "danger" as const },
              ].map(({ label, count, color }) => (
                <div key={label}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-semibold text-[var(--color-text-secondary) flex items-center gap-1.5">
                      <span className={["w-2 h-2 rounded-full", color].join(" ")} />
                      {label}
                    </span>
                    <span className="font-bold text-[var(--color-text-primary) tabular">{count}</span>
                  </div>
                  <div className="w-full h-1.5 bg-[var(--color-surface-high) rounded-full overflow-hidden">
                    <div
                      className={["h-full rounded-full transition-all duration-700", color].join(" ")}
                      style={{ width: total > 0 ? `${(count / total) * 100}%` : "0%" }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
