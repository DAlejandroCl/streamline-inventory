import { useLoaderData, useNavigation, Link } from "react-router-dom";
import type { Product } from "../features/products/types/products";
import { useState } from "react";

import Button from "../components/ui/Button";
import EmptyState from "../components/ui/EmptyState";
import ProductsTableSkeleton from "../components/ui/ProductsTableSkeleton";
import ProductsTable from "../features/products/components/ProductsTable";
import PageHeader from "../components/layout/PageHeader";
import { formatCurrency } from "../lib/utils/formatCurrency";

type Filter = "all" | "available" | "out";

export default function ProductsPage() {
  const products = useLoaderData() as Product[];
  const navigation = useNavigation();
  const [filter, setFilter] = useState<Filter>("all");

  if (navigation.state === "loading") {
    return <ProductsTableSkeleton />;
  }

  const total = products.length;
  const available = products.filter((p) => p.availability).length;
  const outOfStock = total - available;
  const totalValue = products.reduce((sum, p) => sum + p.price, 0);

  const filtered = products.filter((p) => {
    if (filter === "available") return p.availability;
    if (filter === "out") return !p.availability;
    return true;
  });

  if (!products.length) {
    return (
      <div className="space-y-8">
        <PageHeader
          title="Inventory Ledger"
          description="Manage and monitor your product inventory"
          breadcrumbs={[{ label: "Dashboard", to: "/" }]}
          action={
            <Link to="/products/new">
              <Button icon="add" size="lg">Add Product</Button>
            </Link>
          }
        />
        <EmptyState
          title="No products yet"
          description="Your inventory ledger is empty. Create your first product to get started."
          icon="inventory_2"
          action={
            <Link to="/products/new">
              <Button icon="add_box" size="lg">Create First Product</Button>
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
        breadcrumbs={[{ label: "Dashboard", to: "/" }]}
        action={
          <div className="flex items-center gap-3">
            <Button variant="secondary" icon="download" size="lg">
              Export CSV
            </Button>
            <Link to="/products/new">
              <Button icon="add_box" size="lg">Add Product</Button>
            </Link>
          </div>
        }
      />

      {/* STATS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Inventory",
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
            color: outOfStock > 0 ? "text-[var(--color-error)]" : "text-[var(--color-on-surface-variant)]",
          },
          {
            label: "Total Value",
            value: formatCurrency(totalValue),
            color: "text-[var(--color-on-surface)]",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-[var(--color-surface-container-lowest)] px-5 py-4 rounded-xl shadow-ambient"
          >
            <p className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-on-surface-variant)] font-label mb-1">
              {s.label}
            </p>
            <p className={`text-2xl font-extrabold font-headline ${s.color}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* FILTER TABS */}
      <div className="bg-[var(--color-surface-container-low)] p-2 rounded-xl inline-flex gap-1">
        {(
          [
            { key: "all", label: "All" },
            { key: "available", label: "Available" },
            { key: "out", label: "Out of Stock" },
          ] as { key: Filter; label: string }[]
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={[
              "px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200",
              filter === tab.key
                ? "bg-[var(--color-surface-container-lowest)] text-[var(--color-primary)] shadow-ambient"
                : "text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]",
            ].join(" ")}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TABLE */}
      {filtered.length > 0 ? (
        <ProductsTable products={filtered} />
      ) : (
        <EmptyState
          title={`No ${filter === "out" ? "out-of-stock" : "available"} products`}
          description="Try a different filter."
          icon="filter_list"
        />
      )}
    </div>
  );
}
