import { useLoaderData, Link } from "react-router-dom";
import { Tag, DollarSign, ToggleRight, Clock, ArrowLeft } from "lucide-react";
import type { Product } from "../features/products/types/products";
import ProductForm from "../features/products/components/ProductForm";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import { formatCurrency } from "../lib/utils/formatCurrency";

export default function EditProductPage() {
  const product = useLoaderData() as Product;

  const FIELDS = [
    { icon: Tag,        label: "Name",  value: product.name },
    { icon: DollarSign, label: "Price", value: formatCurrency(product.price) },
  ];

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

        <aside className="bg-[var(--color-surface) rounded-2xl p-6 shadow-card border border-[var(--color-border)/40 space-y-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted) mb-1">
              Current Record
            </p>
            <h3 className="text-base font-bold text-[var(--color-text-primary) font-headline">
              Ledger Entry #{product.id}
            </h3>
          </div>

          <div className="space-y-4">
            {FIELDS.map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[var(--color-surface-low) border border-[var(--color-border)/50 flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-[var(--color-text-secondary)" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--color-text-muted)">{label}</p>
                  <p className="text-sm font-bold text-[var(--color-text-primary) mt-0.5">{value}</p>
                </div>
              </div>
            ))}

            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[var(--color-surface-low) border border-[var(--color-border)/50 flex items-center justify-center shrink-0">
                <ToggleRight size={14} className="text-[var(--color-text-secondary)" strokeWidth={2} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--color-text-muted) mb-1">Status</p>
                <Badge variant={product.availability ? "success" : "danger"}>
                  {product.availability ? "Available" : "Out of stock"}
                </Badge>
              </div>
            </div>

            {product.updatedAt && (
              <div className="flex items-center gap-3 pt-3 border-t border-[var(--color-border)/40">
                <div className="w-8 h-8 rounded-xl bg-[var(--color-surface-low) border border-[var(--color-border)/50 flex items-center justify-center shrink-0">
                  <Clock size={13} className="text-[var(--color-text-muted)" strokeWidth={2} />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-[var(--color-text-muted)">Last Updated</p>
                  <p className="text-xs text-[var(--color-text-secondary) font-semibold mt-0.5">
                    {new Date(product.updatedAt).toLocaleDateString("en-US", {
                      weekday: "short", month: "short", day: "numeric", year: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-[var(--color-border)/40">
            <Link to="/products">
              <Button variant="secondary" icon={ArrowLeft} className="w-full justify-center">
                Back to Inventory
              </Button>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
