import { useLoaderData, Link } from "react-router-dom";
import type { Product } from "../features/products/types/products";
import ProductForm from "../features/products/components/ProductForm";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { formatCurrency } from "../lib/utils/formatCurrency";

export default function EditProductPage() {
  const product = useLoaderData() as Product;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Edit Product"
        description="Update an existing entry in the operational ledger."
        breadcrumbs={[
          { label: "Dashboard", to: "/" },
          { label: "Inventory", to: "/products" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* FORM */}
        <div className="lg:col-span-2">
          <ProductForm
            defaultValues={{
              name: product.name,
              price: product.price,
              availability: product.availability,
            }}
            isEditing
          />
        </div>

        {/* CURRENT VALUES PANEL */}
        <aside className="bg-[var(--color-surface-container-low)] rounded-2xl p-6 space-y-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)] font-label mb-1">
              Current Record
            </p>
            <h3 className="text-base font-bold text-[var(--color-on-surface)] font-headline">
              Ledger Entry #{product.id}
            </h3>
          </div>

          <div className="space-y-4">
            {[
              { label: "Name", value: product.name, icon: "label" },
              { label: "Price", value: formatCurrency(product.price), icon: "attach_money" },
            ].map((field) => (
              <div key={field.label} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-[var(--color-surface-container-high)] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-sm text-[var(--color-on-surface-variant)] leading-none">
                    {field.icon}
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-wider text-[var(--color-on-surface-variant)] font-label font-bold">
                    {field.label}
                  </p>
                  <p className="text-sm font-semibold text-[var(--color-on-surface)] truncate">
                    {field.value}
                  </p>
                </div>
              </div>
            ))}

            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-[var(--color-surface-container-high)] flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-sm text-[var(--color-on-surface-variant)] leading-none">
                  toggle_on
                </span>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-on-surface-variant)] font-label font-bold mb-1">
                  Status
                </p>
                <Badge variant={product.availability ? "success" : "danger"}>
                  {product.availability ? "Available" : "Out of stock"}
                </Badge>
              </div>
            </div>

            {product.updatedAt && (
              <div className="pt-3 border-t border-[var(--color-outline-variant)]/15">
                <p className="text-[10px] uppercase tracking-wider text-[var(--color-on-surface-variant)] font-label font-bold mb-1">
                  Last Updated
                </p>
                <p className="text-xs text-[var(--color-on-surface-variant)]">
                  {new Date(product.updatedAt).toLocaleDateString("en-US", {
                    weekday: "short",
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-[var(--color-outline-variant)]/15">
            <Link to="/products">
              <Button variant="secondary" className="w-full" icon="arrow_back">
                Back to Inventory
              </Button>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
