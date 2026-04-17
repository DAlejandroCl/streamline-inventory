import { useLoaderData, useNavigation, Link } from "react-router-dom";
import type { Product } from "../features/products/types/products";

import Table from "../components/ui/Table";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import ProductsTableSkeleton from "../components/tables/ProductsTableSkeleton";

export default function ProductsPage() {
  const products = useLoaderData() as Product[];
  const navigation = useNavigation();

  const isLoading = navigation.state === "loading";

  // 🔄 LOADING STATE (route transition)
  if (isLoading) {
    return <ProductsTableSkeleton />;
  }

  // 📭 EMPTY STATE
  if (!products.length) {
    return (
      <EmptyState
        title="No products yet"
        description="Start by creating your first product"
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Products</h1>

        <Link to="/products/new">
          <Button>+ New Product</Button>
        </Link>
      </div>

      {/* TABLE */}
      <Table headers={["Name", "Price", "Status", "Actions"]}>
        {products.map((p) => (
          <tr key={p.id} className="border-t hover:bg-gray-50 transition">
            <td className="p-3 font-medium">{p.name}</td>

            <td className="p-3">${p.price}</td>

            <td className="p-3">
              <Badge variant={p.availability ? "success" : "danger"}>
                {p.availability ? "Available" : "Out"}
              </Badge>
            </td>

            <td className="p-3 space-x-2">
              <Link to={`/products/${p.id}/edit`}>
                <Button variant="secondary">Edit</Button>
              </Link>

              <Button variant="danger">Delete</Button>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}