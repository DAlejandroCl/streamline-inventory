import { useLoaderData, Link } from "react-router-dom";
import ProductForm from "../features/products/components/ProductForm";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import type { Product } from "../features/products/types/products";
import { formatCurrency } from "../lib/utils/formatCurrency";

export default function EditProductPage() {
  const product = useLoaderData() as Product;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Product"
        breadcrumbs={[
          { label: "Dashboard", to: "/" },
          { label: "Products", to: "/products" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* FORM */}
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

        {/* PRODUCT INFO PANEL */}
        <aside className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-gray-700 text-sm">Current values</h3>

          <div className="space-y-3 text-sm">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Name</p>
              <p className="font-medium text-gray-800">{product.name}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Price</p>
              <p className="font-medium text-gray-800">{formatCurrency(product.price)}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Status</p>
              <Badge variant={product.availability ? "success" : "danger"}>
                {product.availability ? "Available" : "Out of stock"}
              </Badge>
            </div>
            {product.updatedAt && (
              <div>
                <p className="text-gray-400 text-xs uppercase tracking-wide mb-1">Last updated</p>
                <p className="text-gray-500">
                  {new Date(product.updatedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-gray-100">
            <Link to="/products">
              <Button variant="secondary" className="w-full text-sm">
                ← Back to Products
              </Button>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
