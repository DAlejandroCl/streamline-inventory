/* ============================================================
   PRODUCTS PAGE — Inventory Ledger
   Filter tabs, stats bar, sortable table.
   All CSS custom property references are fully closed.
   ============================================================ */

import { useLoaderData, useNavigation, Link } from "react-router-dom";
import { useState } from "react";
import { Plus, Download, PackageX, SlidersHorizontal } from "lucide-react";
import type { Product } from "../features/products/types/products";
import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import ProductsTableSkeleton from "../components/ui/ProductsTableSkeleton";
import ProductsTable from "../features/products/components/ProductsTable";
import PageHeader from "../components/layout/PageHeader";
import { formatCurrency } from "../lib/utils/formatCurrency";

type FilterKey = "all" | "available" | "out";

/* ---- Export helper --------------------------------------- */

function exportCSV(products: Product[]) {
  const headers = ["ID", "Name", "SKU", "Price", "Cost", "Stock", "Status", "Created"];
  const rows = products.map((p) => [
    p.id,
    `"${p.name}"`,
    p.sku ?? "",
    p.price,
    p.cost ?? "",
    p.stock,
    p.availability ? "Available" : "Out of stock",
    p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "",
  ]);
  const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `streamline-inventory-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ---- Page ------------------------------------------------ */

export default function ProductsPage() {
  const products = useLoaderData() as Product[];
  const navigation = useNavigation();
  const [filter, setFilter] = useState<FilterKey>("all");

  if (navigation.state === "loading") {
    return <ProductsTableSkeleton />;
  }

  const total      = products.length;
  const available  = products.filter((p) => p.availability).length;
  const outOfStock = total - available;
  const totalValue = products.reduce((s, p) => s + p.price, 0);

  const filtered =
    filter === "available" ? products.filter((p) => p.availability) :
    filter === "out"       ? products.filter((p) => !p.availability) :
    products;

  if (!total) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Inventory Ledger"
          description="Manage and monitor your product inventory."
          breadcrumbs={[{ label: "Dashboard", to: "/app" }]}
          action={
            <Link to="/app/products/new">
              <Button icon={Plus} size="lg">Add Product</Button>
            </Link>
          }
        />
        <EmptyState
          title="No products yet"
          description="Your inventory ledger is empty. Create your first product to get started."
          icon={PackageX}
          action={
            <Link to="/app/products/new">
              <Button icon={Plus} size="lg">Create First Product</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="Inventory Ledger"
        description="Manage and monitor high-precision inventory with real-time signals."
        breadcrumbs={[{ label: "Dashboard", to: "/app" }]}
        action={
          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              icon={Download}
              size="lg"
              onClick={() => exportCSV(products)}
            >
              Export CSV
            </Button>
            <Link to="/app/products/new">
              <Button icon={Plus} size="lg">Add Product</Button>
            </Link>
          </div>
        }
      />

      {/* STATS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Items",
            value: total.toString(),
            color: "text-[var(--color-primary)]",
          },
          {
            label: "Available",
            value: available.toString(),
            color: "text-[var(--color-secondary)]",
          },
          {
            label: "Out of Stock",
            value: outOfStock.toString(),
            color: outOfStock > 0
              ? "text-[var(--color-error)]"
              : "text-[var(--color-text-muted)]",
          },
          {
            label: "Total Value",
            value: formatCurrency(totalValue),
            color: "text-[var(--color-text-primary)]",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[var(--color-surface)] px-5 py-4 rounded-2xl shadow-card border border-[var(--color-border)]/40"
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">
              {s.label}
            </p>
            <p className={["text-2xl font-extrabold font-headline tabular", s.color].join(" ")}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* FILTER TABS */}
      <div className="flex items-center gap-3">
        <SlidersHorizontal
          size={14}
          className="text-[var(--color-text-muted)]"
          strokeWidth={2}
        />
        <div className="bg-[var(--color-surface-low)] border border-[var(--color-border)]/50 p-1 rounded-xl inline-flex gap-1">
          {(
            [
              { key: "all",       label: `All (${total})` },
              { key: "available", label: `Available (${available})` },
              { key: "out",       label: `Out of stock (${outOfStock})` },
            ] as { key: FilterKey; label: string }[]
          ).map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={[
                "px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
                filter === tab.key
                  ? "bg-[var(--color-surface)] text-[var(--color-primary)] shadow-card"
                  : "text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]",
              ].join(" ")}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TABLE */}
      {filtered.length > 0 ? (
        <ProductsTable products={filtered} />
      ) : (
        <EmptyState
          title="No matching products"
          description="Try a different filter to find what you're looking for."
          icon={SlidersHorizontal}
        />
      )}
    </div>
  );
}
