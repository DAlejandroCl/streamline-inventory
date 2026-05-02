/* ============================================================
   PRODUCT CARD
   Usado en Dashboard → Recent Products.
   Muestra la imagen del producto si existe, fallback a ícono.
   ============================================================ */

import { Link } from "react-router-dom";
import { Package, ArrowRight } from "lucide-react";
import type { Product } from "../types/products";
import Badge from "../../../components/ui/Badge";
import { useCurrency } from "../../../lib/utils/formatCurrency";

const API_BASE = import.meta.env.VITE_API_URL as string;
  const { format: formatCurrency } = useCurrency();

type Props = { product: Product };

export default function ProductCard({ product }: Props) {
  const imageUrl = product.image_url ? `${API_BASE}${product.image_url}` : null;

  return (
    <div className="flex items-center gap-4 py-3.5 px-3 rounded-xl hover:bg-[var(--color-surface-low)] transition-colors duration-150 group">
      {/* Thumbnail */}
      <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 bg-[var(--color-primary-container)] flex items-center justify-center">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <Package size={16} className="text-[var(--color-primary)]" strokeWidth={2} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-[var(--color-text-primary)] truncate">
          {product.name}
        </p>
        <p className="text-xs text-[var(--color-text-muted)] font-semibold tabular mt-0.5">
          {formatCurrency(product.price)}
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Badge variant={product.availability ? "success" : "danger"} dot>
          {product.availability ? "Available" : "Out"}
        </Badge>
        <Link
          to={`/app/products/${product.id}/edit`}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-[var(--color-primary)] hover:text-[var(--color-primary-hover)]"
        >
          <ArrowRight size={14} strokeWidth={2.5} />
        </Link>
      </div>
    </div>
  );
}
