import { Link } from "react-router-dom";
import type { Product } from "../types/products";
import Badge from "../../../components/ui/Badge";
import { formatCurrency } from "../../../lib/utils/formatCurrency";

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  return (
    <div className="flex items-center justify-between gap-4 py-3.5 px-1 border-b border-[var(--color-outline-variant)]/10 last:border-b-0 hover:bg-[var(--color-surface-container-low)]/50 transition-colors rounded-lg px-3 group">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-fixed)]/40 flex items-center justify-center shrink-0">
          <span className="material-symbols-outlined text-sm text-[var(--color-primary)] leading-none">
            inventory_2
          </span>
        </div>
        <div className="min-w-0">
          <p className="font-semibold text-sm text-[var(--color-on-surface)] truncate">
            {product.name}
          </p>
          <p className="text-xs text-[var(--color-on-surface-variant)] font-medium mt-0.5">
            {formatCurrency(product.price)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Badge variant={product.availability ? "success" : "danger"}>
          {product.availability ? "Available" : "Out"}
        </Badge>
        <Link
          to={`/products/${product.id}/edit`}
          className="text-xs font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-container)] transition-colors opacity-0 group-hover:opacity-100"
        >
          Edit →
        </Link>
      </div>
    </div>
  );
}
