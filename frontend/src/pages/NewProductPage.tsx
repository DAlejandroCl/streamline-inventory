import { Link } from "react-router-dom";
import ProductForm from "../features/products/components/ProductForm";
import PageHeader from "../components/layout/PageHeader";
import Button from "../components/ui/Button";

export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="New Product"
        breadcrumbs={[
          { label: "Dashboard", to: "/" },
          { label: "Products", to: "/products" },
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* FORM */}
        <div className="lg:col-span-2">
          <ProductForm />
        </div>

        {/* TIPS PANEL */}
        <aside className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h3 className="font-semibold text-gray-700 text-sm">Tips</h3>
          <ul className="space-y-3 text-sm text-gray-500">
            <li className="flex gap-2">
              <span className="text-indigo-400 font-bold mt-0.5">·</span>
              Product name must be at least 1 character.
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-400 font-bold mt-0.5">·</span>
              Price must be greater than 0.
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-400 font-bold mt-0.5">·</span>
              Toggle availability before saving to control visibility in the catalog.
            </li>
            <li className="flex gap-2">
              <span className="text-indigo-400 font-bold mt-0.5">·</span>
              Products are available by default when created.
            </li>
          </ul>

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
