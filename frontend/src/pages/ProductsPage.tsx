import { useLoaderData, useNavigation, Link, Form } from "react-router-dom";
import type { Product } from "../features/products/types/products";

import Table from "../components/ui/Table";
import Button from "../components/ui/Button";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";
import ProductsTableSkeleton from "../components/ui/ProductsTableSkeleton";

export default function ProductsPage() {
  const products = useLoaderData() as Product[];
  const navigation = useNavigation();

  const isLoading = navigation.state === "loading";

  if (isLoading) {
    return <ProductsTableSkeleton />;
  }

  if (!products.length) {
    return (
      <EmptyState
        title="No products yet"
        description="Start by creating your first product"
      />
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>

        <Link to="/products/new">
          <Button>+ New Product</Button>
        </Link>
      </div>

      <Table headers={["Name", "Price", "Status", "Actions"]}>
        {products.map((p) => (
          <tr key={p.id} className="border-t hover:bg-gray-50">
            <td className="p-3 font-medium">{p.name}</td>

            <td className="p-3">${p.price}</td>

            <td className="p-3">
              <Form method="post" action="/products/toggle">
                <input type="hidden" name="id" value={p.id} />
                <input
                  type="hidden"
                  name="availability"
                  value={String(p.availability)}
                />

                <button type="submit">
                  <Badge
                    variant={p.availability ? "success" : "danger"}
                  >
                    {p.availability ? "Available" : "Out"}
                  </Badge>
                </button>
              </Form>
            </td>

            <td className="p-3 space-x-2">
              <Link to={`/products/${p.id}/edit`}>
                <Button variant="secondary">Edit</Button>
              </Link>

              <Form method="post" action="/products/delete">
                <input type="hidden" name="id" value={p.id} />
                <Button variant="danger" type="submit">
                  Delete
                </Button>
              </Form>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}