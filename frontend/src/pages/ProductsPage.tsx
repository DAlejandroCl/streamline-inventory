import { Link } from "react-router-dom";

export default function ProductsPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>

        <Link
          to="/products/new"
          className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 rounded-lg font-medium"
        >
          + New Product
        </Link>
      </div>

      <div className="bg-slate-800 rounded-xl p-6 text-center text-slate-400">
        No products yet
      </div>
    </div>
  );
}