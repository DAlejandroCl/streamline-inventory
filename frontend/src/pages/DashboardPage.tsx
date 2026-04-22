import { useLoaderData, Link } from "react-router-dom";
import type { Product } from "../features/products/types/products";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import PageHeader from "../components/layout/PageHeader";
import ProductCard from "../features/products/components/ProductCard";
import { formatCurrency } from "../lib/utils/formatCurrency";

/* ---- Metric helpers --------------------------------------- */

function computeMetrics(products: Product[]) {
  const total = products.length;
  const available = products.filter((p) => p.availability).length;
  const outOfStock = total - available;
  const totalValue = products.reduce((sum, p) => sum + p.price, 0);
  const avgPrice = total > 0 ? totalValue / total : 0;
  return { total, available, outOfStock, totalValue, avgPrice };
}

/* ---- MetricBlock ------------------------------------------ */

type MetricBlockProps = {
  label: string;
  value: string;
  sub?: string;
  icon: string;
  accent: "primary" | "error" | "secondary" | "none";
  iconColor?: string;
};

function MetricBlock({ label, value, sub, icon, accent, iconColor = "text-[var(--color-primary)]" }: MetricBlockProps) {
  return (
    <Card accent={accent} className="relative overflow-hidden">
      <div className="flex justify-between items-start mb-4">
        <span className={`text-[10px] font-bold uppercase tracking-widest font-label ${iconColor}`}>
          {label}
        </span>
        <span className={`material-symbols-outlined text-2xl opacity-30 ${iconColor}`}>
          {icon}
        </span>
      </div>
      <div className={`text-3xl font-extrabold font-headline ${iconColor}`}>
        {value}
      </div>
      {sub && (
        <p className="mt-2 text-xs font-medium text-[var(--color-on-surface-variant)] flex items-center gap-1">
          {sub}
        </p>
      )}
    </Card>
  );
}

/* ---- Page ------------------------------------------------- */

export default function DashboardPage() {
  const products = useLoaderData() as Product[];
  const { total, available, outOfStock, totalValue, avgPrice } = computeMetrics(products);

  const recentProducts = [...products]
    .sort((a, b) => {
      const dA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dB - dA;
    })
    .slice(0, 5);

  return (
    <div className="space-y-10">
      <PageHeader
        title="Dashboard Overview"
        description="Real-time status of the operational ledger"
        action={
          <Link to="/products/new">
            <Button icon="add" size="lg">Create New Product</Button>
          </Link>
        }
      />

      {/* METRIC BLOCKS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        <MetricBlock
          label="Inventory Value"
          value={formatCurrency(totalValue)}
          sub="Total asset value"
          icon="payments"
          accent="primary"
          iconColor="text-[var(--color-primary)]"
        />
        <MetricBlock
          label="Out of Stock"
          value={outOfStock.toString()}
          sub={outOfStock > 0 ? "Requires attention" : "All stocked"}
          icon="warning"
          accent="error"
          iconColor="text-[var(--color-error)]"
        />
        <MetricBlock
          label="Total Products"
          value={total.toString()}
          sub={`${available} available`}
          icon="inventory_2"
          accent="none"
          iconColor="text-[var(--color-on-surface)]"
        />
        <MetricBlock
          label="Avg. Price"
          value={formatCurrency(avgPrice)}
          sub="Across catalog"
          icon="analytics"
          accent="secondary"
          iconColor="text-[var(--color-secondary)]"
        />
      </div>

      {/* CENTRAL GRID — Recent + Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* RECENT PRODUCTS */}
        <div className="lg:col-span-2 bg-[var(--color-surface-container-lowest)] rounded-2xl shadow-ambient overflow-hidden">
          <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-[var(--color-outline-variant)]/10">
            <div>
              <h2 className="text-lg font-bold text-[var(--color-on-surface)] font-headline">
                Recent Products
              </h2>
              <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">
                Latest additions to the ledger
              </p>
            </div>
            <Link
              to="/products"
              className="text-xs font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-container)] transition-colors flex items-center gap-1"
            >
              View all
              <span className="material-symbols-outlined text-sm leading-none">arrow_forward</span>
            </Link>
          </div>

          <div className="px-4 py-2">
            {recentProducts.length === 0 ? (
              <div className="py-12 text-center">
                <span className="material-symbols-outlined text-4xl text-[var(--color-outline)] opacity-40">
                  inventory_2
                </span>
                <p className="text-sm text-[var(--color-on-surface-variant)] mt-3">
                  No products yet.{" "}
                  <Link to="/products/new" className="text-[var(--color-primary)] hover:underline font-medium">
                    Create one
                  </Link>
                </p>
              </div>
            ) : (
              recentProducts.map((p) => <ProductCard key={p.id} product={p} />)
            )}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-bold text-[var(--color-on-surface)] font-headline px-1">
            Quick Actions
          </h2>

          {[
            {
              to: "/products/new",
              icon: "add_box",
              label: "Add Product",
              sub: "Create new inventory entry",
              color: "text-[var(--color-primary)]",
              bg: "bg-[var(--color-primary-fixed)]/40",
            },
            {
              to: "/products",
              icon: "list_alt",
              label: "View Inventory",
              sub: `${total} products in ledger`,
              color: "text-[var(--color-secondary)]",
              bg: "bg-[var(--color-secondary-container)]/30",
            },
            {
              to: "http://localhost:3000/docs",
              icon: "description",
              label: "API Docs",
              sub: "Open Swagger UI",
              color: "text-[var(--color-on-surface-variant)]",
              bg: "bg-[var(--color-surface-container-high)]",
              external: true,
            },
          ].map((item) => {
            const inner = (
              <div className="bg-[var(--color-surface-container-lowest)] rounded-xl p-4 flex items-center gap-4 shadow-ambient hover:shadow-[rgba(36,56,156,0.1)_0px_8px_24px] transition-all duration-200 group cursor-pointer border border-transparent hover:border-[var(--color-outline-variant)]/20">
                <div className={`w-10 h-10 ${item.bg} rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <span className={`material-symbols-outlined text-xl leading-none ${item.color}`}>
                    {item.icon}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-[var(--color-on-surface)]">{item.label}</p>
                  <p className="text-xs text-[var(--color-on-surface-variant)] mt-0.5">{item.sub}</p>
                </div>
                <span className="material-symbols-outlined text-sm text-[var(--color-outline)] ml-auto opacity-0 group-hover:opacity-100 transition-opacity leading-none">
                  arrow_forward
                </span>
              </div>
            );

            return item.external ? (
              <a key={item.label} href={item.to} target="_blank" rel="noopener noreferrer">
                {inner}
              </a>
            ) : (
              <Link key={item.label} to={item.to}>{inner}</Link>
            );
          })}

          {/* STOCK SUMMARY */}
          <div className="bg-[var(--color-surface-container-lowest)] rounded-xl p-5 shadow-ambient mt-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)] mb-4 font-label">
              Stock Summary
            </p>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-[var(--color-on-surface-variant)]">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-secondary)]" />
                  Available
                </span>
                <span className="font-bold text-[var(--color-on-surface)] tabular-nums">{available}</span>
              </div>
              <div className="w-full h-1.5 bg-[var(--color-surface-container-high)] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[var(--color-secondary)] to-[var(--color-secondary-fixed-dim)] rounded-full transition-all duration-700"
                  style={{ width: total > 0 ? `${(available / total) * 100}%` : "0%" }}
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-[var(--color-on-surface-variant)]">
                  <span className="w-2 h-2 rounded-full bg-[var(--color-error)]" />
                  Out of stock
                </span>
                <span className="font-bold text-[var(--color-on-surface)] tabular-nums">{outOfStock}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
