import { Link } from "react-router-dom";
import { Package, ArrowRight } from "lucide-react";
import type { Product } from "../types/products";
import Badge from "../../../components/ui/Badge";
import { formatCurrency } from "../../../lib/utils/formatCurrency";

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  return (
    <div className="flex items-center gap-4 py-3.5 px-3 rounded-xl hover:bg-[var(--color-surface-low) transition-colors duration-150 group">
      <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-container) flex items-center justify-center shrink-0">
        <Package size={15} className="text-[var(--color-primary)" strokeWidth={2} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[var(--color-text-primary) truncate">{product.name}</p>
        <p className="text-xs text-[var(--color-text-muted) font-semibold tabular mt-0.5">
          {formatCurrency(product.price)}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Badge variant={product.availability ? "success" : "danger"} dot>
          {product.availability ? "Available" : "Out"}
        </Badge>
        <Link
          to={`/products/${product.id}/edit`}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-primary) hover:text-[var(--color-primary-hover)"
        >
          <ArrowRight size={14} strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
}
