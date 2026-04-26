import { Link, Form } from "react-router-dom";
import { Edit2, Trash2, Package } from "lucide-react";
import type { Product } from "../types/products";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import { formatCurrency } from "../../../lib/utils/formatCurrency";

type Props = { products: Product[] };

export default function ProductsTable({ products }: Props) {
  return (
    <div className="bg-[var(--color-surface)] rounded-2xl shadow-card overflow-hidden border border-[var(--color-border)]/40">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[var(--color-surface-low)] border-b border-[var(--color-border)]/50">
              {["Product", "Price", "Stock", "Status", "Added", "Actions"].map((h) => (
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
                className="border-b border-[var(--color-border)]/20 hover:bg-[var(--color-surface-low)]/60 transition-colors duration-100 group"
              >
                {/* PRODUCT */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[var(--color-primary-container)] flex items-center justify-center shrink-0">
                      <Package size={15} className="text-[var(--color-primary)]" strokeWidth={2} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[var(--color-text-primary)]">{p.name}</p>
                      <p className="text-xs text-[var(--color-text-muted)] font-medium">
                        {p.sku ? `SKU: ${p.sku}` : `ID #${p.id}`}
                      </p>
                    </div>
                  </div>
                </td>

                {/* PRICE */}
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-[var(--color-text-primary)] tabular">
                    {formatCurrency(p.price)}
                  </span>
                </td>

                {/* STOCK */}
                <td className="px-6 py-4">
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
                <td className="px-6 py-4">
                  <Form method="post" action="/products/toggle">
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="availability" value={String(p.availability)} />
                    <button
                      type="submit"
                      className="focus:outline-none rounded-full transition-transform hover:scale-105 active:scale-95"
                      title="Click to toggle"
                    >
                      <Badge variant={p.availability ? "success" : "danger"}>
                        {p.availability ? "Available" : "Out of stock"}
                      </Badge>
                    </button>
                  </Form>
                </td>

                {/* CREATED */}
                <td className="px-6 py-4 text-xs text-[var(--color-text-muted)] font-medium tabular">
                  {p.createdAt
                    ? new Date(p.createdAt).toLocaleDateString("en-US", {
                        month: "short", day: "numeric", year: "numeric",
                      })
                    : "—"}
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 opacity-40 group-hover:opacity-100 transition-opacity duration-150">
                    <Link to={`/products/${p.id}/edit`}>
                      <Button variant="ghost" size="sm" icon={Edit2}>Edit</Button>
                    </Link>
                    <Form method="post" action="/products/delete">
                      <input type="hidden" name="id" value={p.id} />
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

      <div className="px-6 py-4 bg-[var(--color-surface-low)]/50 border-t border-[var(--color-border)]/30 flex items-center justify-between">
        <p className="text-xs text-[var(--color-text-muted)] font-medium">
          Showing <span className="font-bold text-[var(--color-text-secondary)]">{products.length}</span> entries
        </p>
      </div>
    </div>
  );
}
