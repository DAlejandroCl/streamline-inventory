import { Link } from "react-router-dom";
import ProductForm from "../features/products/components/ProductForm";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";

const TIPS = [
  { icon: "label", text: "Product name must be at least 1 character." },
  { icon: "attach_money", text: "Price must be greater than 0." },
  { icon: "toggle_on", text: "Toggle availability to control catalog visibility." },
  { icon: "check_circle", text: "Products are available by default when created." },
];

export default function NewProductPage() {
  return (
    <div className="space-y-8">
      <PageHeader
        title="New Product Entry"
        description="Add a new item to the operational ledger."
        breadcrumbs={[
          { label: "Dashboard", to: "/" },
          { label: "Inventory", to: "/products" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* FORM */}
        <div className="lg:col-span-2">
          <ProductForm />
        </div>

        {/* TIPS PANEL */}
        <aside className="bg-[var(--color-surface-container-low)] rounded-2xl p-6 space-y-5">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)] font-label mb-1">
              Guidelines
            </p>
            <h3 className="text-base font-bold text-[var(--color-on-surface)] font-headline">
              Entry Requirements
            </h3>
          </div>

          <ul className="space-y-4">
            {TIPS.map((tip) => (
              <li key={tip.icon} className="flex items-start gap-3">
                <div className="w-7 h-7 rounded-lg bg-[var(--color-primary-fixed)]/40 flex items-center justify-center shrink-0 mt-0.5">
                  <span className="material-symbols-outlined text-sm text-[var(--color-primary)] leading-none">
                    {tip.icon}
                  </span>
                </div>
                <p className="text-sm text-[var(--color-on-surface-variant)] leading-relaxed">
                  {tip.text}
                </p>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-[var(--color-outline-variant)]/15">
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
