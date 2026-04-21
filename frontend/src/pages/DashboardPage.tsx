import { useLoaderData, Link } from "react-router-dom";
import type { Product } from "../features/products/types/products";
import Card from "../components/ui/Card";
import Badge from "../components/ui/Badge";
import Button from "../components/ui/Button";
import PageHeader from "../components/layout/PageHeader";
import { formatCurrency } from "../lib/utils/formatCurrency";

/* ---- Metric helpers --------------------------------------- */

function computeMetrics(products: Product[]) {
  const total = products.length;
  const available = products.filter((p) => p.availability).length;
  const outOfStock = total - available;
  const avgPrice =
    total > 0
      ? products.reduce((sum, p) => sum + p.price, 0) / total
      : 0;

  return { total, available, outOfStock, avgPrice };
}

/* ---- Sub-components --------------------------------------- */

type MetricCardProps = {
  label: string;
  value: string | number;
  sub?: string;
  subVariant?: "success" | "danger" | "neutral";
};

function MetricCard({ label, value, sub, subVariant = "neutral" }: MetricCardProps) {
  const subColors = {
    success: "text-green-600",
    danger: "text-red-500",
    neutral: "text-gray-400",
  };

  return (
    <Card>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-3xl font-bold mt-2 text-gray-900">{value}</p>
      {sub && (
        <p className={`text-xs mt-1 ${subColors[subVariant]}`}>{sub}</p>
      )}
    </Card>
  );
}

/* ---- Page ------------------------------------------------- */

export default function DashboardPage() {
  const products = useLoaderData() as Product[];
  const { total, available, outOfStock, avgPrice } = computeMetrics(products);

  const recentProducts = [...products]
    .sort((a, b) => {
      const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return dateB - dateA;
    })
    .slice(0, 5);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        action={
          <Link to="/products/new">
            <Button>+ New Product</Button>
          </Link>
        }
      />

      {/* METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          label="Total products"
          value={total}
          sub={total === 0 ? "No products yet" : `${available} in catalog`}
          subVariant="neutral"
        />
        <MetricCard
          label="Available"
          value={available}
          sub={total > 0 ? `${Math.round((available / total) * 100)}% in stock` : "—"}
          subVariant="success"
        />
        <MetricCard
          label="Out of stock"
          value={outOfStock}
          sub={outOfStock > 0 ? "Needs attention" : "All stocked"}
          subVariant={outOfStock > 0 ? "danger" : "neutral"}
        />
        <MetricCard
          label="Avg. price"
          value={formatCurrency(avgPrice)}
          sub="across catalog"
          subVariant="neutral"
        />
      </div>

      {/* RECENT PRODUCTS */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">Recent products</h2>
          <Link
            to="/products"
            className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
          >
            View all →
          </Link>
        </div>

        <Card className="p-0 overflow-hidden">
          {recentProducts.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-10">
              No products yet.{" "}
              <Link to="/products/new" className="text-indigo-600 hover:underline">
                Create one
              </Link>
            </p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b text-left text-gray-500 text-xs uppercase tracking-wide">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Price</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-900">
                      {product.name}
                    </td>
                    <td className="px-5 py-3 text-gray-600">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-5 py-3">
                      <Badge variant={product.availability ? "success" : "danger"}>
                        {product.availability ? "Available" : "Out of stock"}
                      </Badge>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link
                        to={`/products/${product.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>
      </div>

      {/* QUICK ACTIONS */}
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Quick actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Link to="/products/new">
            <Card className="cursor-pointer hover:border-indigo-200 group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-indigo-50 group-hover:bg-indigo-100 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">Add product</p>
                  <p className="text-xs text-gray-500">Create new listing</p>
                </div>
              </div>
            </Card>
          </Link>

          <Link to="/products">
            <Card className="cursor-pointer hover:border-indigo-200 group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-indigo-50 group-hover:bg-indigo-100 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">View catalog</p>
                  <p className="text-xs text-gray-500">{total} products total</p>
                </div>
              </div>
            </Card>
          </Link>

          <a href="/docs" target="_blank" rel="noopener noreferrer">
            <Card className="cursor-pointer hover:border-indigo-200 group">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-indigo-50 group-hover:bg-indigo-100 rounded-lg flex items-center justify-center transition-colors">
                  <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-800">API docs</p>
                  <p className="text-xs text-gray-500">Open Swagger UI</p>
                </div>
              </div>
            </Card>
          </a>
        </div>
      </div>
    </div>
  );
}
