import { Link, Form } from "react-router-dom";
import type { Product } from "../types/products";
import Badge from "../../../components/ui/Badge";
import Button from "../../../components/ui/Button";
import { formatCurrency } from "../../../lib/utils/formatCurrency";

type Props = {
  products: Product[];
};

export default function ProductsTable({ products }: Props) {
  return (
    <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl shadow-ambient overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-[var(--color-surface-container-low)]">
              {["Product Name", "Price", "Status", "Created", "Actions"].map((h) => (
                <th
                  key={h}
                  className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-[var(--color-on-surface-variant)] font-label"
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
                className="border-t border-[var(--color-outline-variant)]/10 hover:bg-[var(--color-surface-container-low)]/60 transition-colors duration-150 group"
              >
                {/* NAME */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-fixed)]/40 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-sm text-[var(--color-primary)] leading-none">
                        inventory_2
                      </span>
                    </div>
                    <span className="font-semibold text-sm text-[var(--color-on-surface)]">
                      {p.name}
                    </span>
                  </div>
                </td>

                {/* PRICE */}
                <td className="px-6 py-4 text-sm font-semibold text-[var(--color-on-surface)] tabular-nums text-right">
                  {formatCurrency(p.price)}
                </td>

                {/* STATUS — toggle on click */}
                <td className="px-6 py-4">
                  <Form method="post" action="/products/toggle">
                    <input type="hidden" name="id" value={p.id} />
                    <input type="hidden" name="availability" value={String(p.availability)} />
                    <button
                      type="submit"
                      title="Click to toggle availability"
                      className="focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/30 rounded-full transition-transform hover:scale-105"
                    >
                      <Badge variant={p.availability ? "success" : "danger"}>
                        {p.availability ? "Available" : "Out of stock"}
                      </Badge>
                    </button>
                  </Form>
                </td>

                {/* CREATED */}
                <td className="px-6 py-4 text-xs text-[var(--color-on-surface-variant)]">
                  {p.createdAt
                    ? new Date(p.createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })
                    : "—"}
                </td>

                {/* ACTIONS */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                    <Link to={`/products/${p.id}/edit`}>
                      <Button variant="ghost" size="sm" icon="edit">
                        Edit
                      </Button>
                    </Link>

                    <Form method="post" action="/products/delete">
                      <input type="hidden" name="id" value={p.id} />
                      <Button variant="danger" size="sm" icon="delete" type="submit">
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
    </div>
  );
}
