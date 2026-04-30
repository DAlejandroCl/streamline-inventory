/* ============================================================
   NEW PRODUCT PAGE
   Fix: breadcrumbs y "Back to Inventory" link usaban paths
   sin prefijo /app/ — corregidos.
   ============================================================ */

import { useLoaderData, Link } from "react-router-dom";
import { Tag, DollarSign, ToggleRight, CheckCircle, ArrowLeft } from "lucide-react";
import type { Category } from "../features/products/types/products";
import ProductForm from "../features/products/components/ProductForm";
import PageHeader  from "../components/layout/PageHeader";
import Button      from "../components/ui/Button";

const TIPS = [
  { icon: Tag,         text: "Product name must be at least 1 character." },
  { icon: DollarSign,  text: "Price must be greater than 0." },
  { icon: ToggleRight, text: "Toggle availability to control catalog visibility." },
  { icon: CheckCircle, text: "Products are available by default when created." },
];

type LoaderData = { categories: Category[] };

export default function NewProductPage() {
  const { categories } = useLoaderData() as LoaderData;

  return (
    <div className="space-y-8">
      <PageHeader
        title="New Product Entry"
        description="Add a new item to the operational ledger."
        breadcrumbs={[
          { label: "Dashboard", to: "/app" },
          { label: "Inventory", to: "/app/products" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2">
          <ProductForm categories={categories} />
        </div>

        <aside className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-card border border-[var(--color-border)]/40 space-y-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)] mb-1">
              Guidelines
            </p>
            <h3 className="text-base font-bold text-[var(--color-text-primary)] font-headline">
              Entry Requirements
            </h3>
          </div>

          <ul className="space-y-4">
            {TIPS.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-[var(--color-primary-container)] flex items-center justify-center shrink-0 mt-0.5">
                  <Icon size={13} className="text-[var(--color-primary)]" strokeWidth={2.2} />
                </div>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{text}</p>
              </li>
            ))}
          </ul>

          <div className="pt-2 border-t border-[var(--color-border)]/40">
            <Link to="/app/products">
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
