/* ============================================================
   PRODUCTS TABLE
   Consume SettingsContext a través de hooks:
   - useCurrency() → respeta currency seleccionada en Settings
   - useDate()     → respeta dateFormat seleccionado en Settings
   - useSettings() → respeta compactMode y showCostPrice
   ============================================================ */

import { Link, Form } from "react-router-dom";
import { Edit2, Trash2, Package } from "lucide-react";
import type { Product } from "../types/products";
import Badge  from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import { useCurrency } from "../../../lib/utils/formatCurrency";
import { useDate }     from "../../../lib/utils/formatDate";
import { useSettings } from "../../../context/SettingsContext";

const API_BASE = import.meta.env.VITE_API_URL as string;

type Props = { products: Product[] };

export default function ProductsTable({ products }: Props) {
  const { format: formatPrice }    = useCurrency();
  const { format: formatDateStr }  = useDate();
  const { settings }               = useSettings();
  const { compactMode, showCostPrice } = settings.display;

  const rowPy = compactMode ? "py-2" : "py-4";

  return (
    <div className="bg-[var(--color-surface)] rounded-2xl shadow-card overflow-hidden border border-[var(--color-border)]/40">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[var(--color-surface-low)] border-b border-[var(--color-border)]/50">
              {[
                "Product",
                "Price",
                ...(showCostPrice ? ["Cost"] : []),
                "Stock",
                "Status",
                "Added",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-left text-[10px] font-bold uppercase tracking-widest text-[var(--color-text-muted)]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className={`border-b border-[var(--color-border)]/20 hover:bg-[var(--color-surface-low)]/60 transition-colors duration-100 group`}
              >
                {/* PRODUCT */}
                <td className={`px-6 ${rowPy}`}>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl overflow-hidden bg-[var(--color-primary-container)] flex items-center justify-center shrink-0">
                      {p.image_url ? (
                        <img
                          src={`${API_BASE}${p.image_url}`}
                          alt={p.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const t = e.currentTarget;
                            t.style.display = "none";
                            t.nextElementSibling?.classList.remove("hidden");
                          }}
                        />
                      ) : null}
                      <Package
                        size={15}
                        className={["text-[var(--color-primary)]", p.image_url ? "hidden" : ""].join(" ")}
                        strokeWidth={2}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--color-text-primary)]">
                        {p.name}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)] font-medium">
                        {p.sku ? `SKU: ${p.sku}` : `ID #${p.id}`}
                      </p>
                    </div>
                  </div>
                </td>

                {/* PRICE — respeta currency del contexto */}
                <td className={`px-6 ${rowPy}`}>
                  <span className="text-sm font-bold text-[var(--color-text-primary)] tabular">
                    {formatPrice(p.price)}
                  </span>
                </td>

                {/* COST — solo si showCostPrice está activo */}
                {showCostPrice && (
                  <td className={`px-6 ${rowPy}`}>
                    <span className="text-sm text-[var(--color-text-muted)] tabular">
                      {p.cost != null ? formatPrice(p.cost) : "—"}
                    </span>
                  </td>
                )}

                {/* STOCK */}
                <td className={`px-6 ${rowPy}`}>
                  <span
                    className={[
                      "text-sm font-bold tabular",
                      p.stock === 0
                        ? "text-[var(--color-error)]"
                        : p.stock <= 5
                        ? "text-[var(--color-warning)]"
                        : "text-[var(--color-text-primary)]",
                    ].join(" ")}
                  >
                    {p.stock}
                  </span>
                </td>

                {/* STATUS */}
                <td className={`px-6 ${rowPy}`}>
                  <Form method="post" action="/app/products/toggle">
                    <input type="hidden" name="id"           value={p.id} />
                    <input type="hidden" name="name"         value={p.name} />
                    <input type="hidden" name="availability" value={String(p.availability)} />
                    <button
                      type="submit"
                      className="focus:outline-none rounded-full transition-transform hover:scale-105 active:scale-95"
                      title="Click to toggle availability"
                    >
                      <Badge variant={p.availability ? "success" : "danger"} dot>
                        {p.availability ? "Available" : "Out of stock"}
                      </Badge>
                    </button>
                  </Form>
                </td>

                {/* ADDED — respeta dateFormat del contexto */}
                <td className={`px-6 ${rowPy} text-xs text-[var(--color-text-muted)] font-medium tabular`}>
                  {formatDateStr(p.createdAt)}
                </td>

                {/* ACTIONS */}
                <td className={`px-6 ${rowPy}`}>
                  <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity duration-150">
                    <Link to={`/app/products/${p.id}/edit`}>
                      <Button variant="ghost" size="sm" icon={Edit2}>Edit</Button>
                    </Link>
                    <Form method="post" action="/app/products/delete">
                      <input type="hidden" name="id"   value={p.id} />
                      <input type="hidden" name="name" value={p.name} />
                      <Button variant="danger" size="sm" icon={Trash2} type="submit">
                        Delete
                      </Button>
                    </Form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-6 py-4 bg-[var(--color-surface-low)]/50 border-t border-[var(--color-border)]/30">
        <p className="text-xs text-[var(--color-text-muted)] font-medium">
          Showing{" "}
          <span className="font-bold text-[var(--color-text-secondary)]">
            {products.length}
          </span>{" "}
          {products.length === 1 ? "entry" : "entries"}
        </p>
      </div>
    </div>
  );
}
