/* ============================================================
   PRODUCTS PAGE — Inventory Ledger
   Paginación server-side: los controles de página y búsqueda
   actualizan los searchParams de la URL, lo que dispara el
   loader automáticamente (React Router revalida en navegación).

   La búsqueda usa un debounce manual con useEffect para no
   disparar el loader en cada keystroke.
   ============================================================ */

import {
  useLoaderData, useNavigation, Link,
  useSearchParams, useSubmit,
} from "react-router-dom";
import { useState, useEffect } from "react";
import {
  Plus, Download, PackageX, SlidersHorizontal,
  ChevronLeft, ChevronRight, Search,
} from "lucide-react";
import type { PaginatedProducts } from "../features/products/types/products";
import Button               from "../components/ui/Button";
import EmptyState           from "../components/ui/EmptyState";
import ProductsTableSkeleton from "../components/ui/ProductsTableSkeleton";
import ProductsTable        from "../features/products/components/ProductsTable";
import PageHeader           from "../components/layout/PageHeader";
import { useCurrency } from "../lib/utils/formatCurrency";

/* ---- CSV export ------------------------------------------ */

function exportCSV(result: PaginatedProducts) {
  const headers = ["ID", "Name", "SKU", "Price", "Cost", "Stock", "Status", "Created"];
  const rows = result.data.map((p) => [
    p.id,
    `"${p.name}"`,
    p.sku ?? "",
    p.price,
    p.cost ?? "",
    p.stock,
    p.availability ? "Available" : "Out of stock",
    p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "",
  ]);
  const csv  = [headers, ...rows].map((r) => r.join(",")).join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `streamline-inventory-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ---- Page ------------------------------------------------ */

export default function ProductsPage() {
  const result     = useLoaderData() as PaginatedProducts;
  const { format: formatCurrency } = useCurrency();
  const navigation = useNavigation();
  const [searchParams, setSearchParams] = useSearchParams();
  const submit = useSubmit();

  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") ?? ""
  );

  /* Debounce search — espera 400ms después del último keystroke */
  useEffect(() => {
    const timer = setTimeout(() => {
      const current = searchParams.get("search") ?? "";
      if (searchInput !== current) {
        const next = new URLSearchParams(searchParams);
        if (searchInput) {
          next.set("search", searchInput);
        } else {
          next.delete("search");
        }
        next.set("page", "1");
        setSearchParams(next, { replace: true });
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, searchParams, setSearchParams]);

  if (navigation.state === "loading") {
    return <ProductsTableSkeleton />;
  }

  const { data: products, total, page, totalPages, hasNext, hasPrev } = result;

  const available  = products.filter((p) => p.availability).length;
  const outOfStock = products.filter((p) => !p.availability).length;
  const totalValue = products.reduce((s, p) => s + p.price, 0);

  function goToPage(p: number) {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(p));
    setSearchParams(next);
  }

  if (total === 0 && !searchParams.get("search")) {
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
              onClick={() => exportCSV(result)}
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
            label: "Page Value",
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

      {/* SEARCH + FILTER BAR */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] pointer-events-none"
            strokeWidth={2}
          />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name or SKU..."
            className="pl-9 pr-4 py-2 text-sm rounded-xl w-64 bg-[var(--color-surface)] border border-[var(--color-border)] placeholder:text-[var(--color-text-muted)] text-[var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/20 focus:border-[var(--color-primary)] transition-all"
          />
        </div>

        {searchParams.get("search") && (
          <button
            onClick={() => {
              setSearchInput("");
              const next = new URLSearchParams(searchParams);
              next.delete("search");
              next.set("page", "1");
              setSearchParams(next, { replace: true });
            }}
            className="text-xs font-semibold text-[var(--color-primary)] hover:underline"
          >
            Clear search
          </button>
        )}

        <span className="text-xs text-[var(--color-text-muted)] ml-auto">
          {total} product{total !== 1 ? "s" : ""}
          {searchParams.get("search") && ` matching "${searchParams.get("search")}"`}
        </span>
      </div>

      {/* TABLE */}
      {products.length > 0 ? (
        <ProductsTable products={products} />
      ) : (
        <EmptyState
          title="No products found"
          description={`No results for "${searchParams.get("search")}". Try a different search term.`}
          icon={SlidersHorizontal}
          action={
            <button
              onClick={() => {
                setSearchInput("");
                setSearchParams({});
              }}
              className="text-sm font-semibold text-[var(--color-primary)] hover:underline"
            >
              Clear search
            </button>
          }
        />
      )}

      {/* PAGINATION CONTROLS */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between py-2">
          <p className="text-xs text-[var(--color-text-muted)] font-medium">
            Page{" "}
            <span className="font-bold text-[var(--color-text-primary)]">{page}</span>
            {" "}of{" "}
            <span className="font-bold text-[var(--color-text-primary)]">{totalPages}</span>
          </p>

          <div className="flex items-center gap-1.5">
            <Button
              variant="secondary"
              size="sm"
              icon={ChevronLeft}
              onClick={() => goToPage(page - 1)}
              disabled={!hasPrev}
            >
              Prev
            </Button>

            {/* Page number pills */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let p: number;
                if (totalPages <= 5) {
                  p = i + 1;
                } else if (page <= 3) {
                  p = i + 1;
                } else if (page >= totalPages - 2) {
                  p = totalPages - 4 + i;
                } else {
                  p = page - 2 + i;
                }
                return (
                  <button
                    key={p}
                    onClick={() => goToPage(p)}
                    className={[
                      "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                      p === page
                        ? "bg-[var(--color-primary)] text-white shadow-card"
                        : "text-[var(--color-text-muted)] hover:bg-[var(--color-surface-low)] hover:text-[var(--color-text-primary)]",
                    ].join(" ")}
                  >
                    {p}
                  </button>
                );
              })}
            </div>

            <Button
              variant="secondary"
              size="sm"
              icon={ChevronRight}
              onClick={() => goToPage(page + 1)}
              disabled={!hasNext}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
