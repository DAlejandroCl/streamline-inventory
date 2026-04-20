import { Link, Form } from "react-router-dom";
import type { Product } from "../types/products";
import Table from "../../../components/ui/Table";
import Button from "../../../components/ui/Button";
import Badge from "../../../components/ui/Badge";

type Props = {
  products: Product[];
};

export default function ProductsTable({ products }: Props) {
  return (
    <Table headers={["Name", "Price", "Availability", "Actions"]}>
      {products.map((product) => (
        <tr key={product.id} className="border-t hover:bg-gray-50 transition-colors">
          <td className="p-3 font-medium text-gray-900">{product.name}</td>

          <td className="p-3 text-gray-700">
            ${product.price.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </td>

          <td className="p-3">
            <Form method="post" action="/products/toggle">
              <input type="hidden" name="id" value={product.id} />
              <input type="hidden" name="availability" value={String(product.availability)} />
              <button type="submit" className="focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded">
                <Badge variant={product.availability ? "success" : "danger"}>
                  {product.availability ? "Available" : "Out of stock"}
                </Badge>
              </button>
            </Form>
          </td>

          <td className="p-3">
            <div className="flex items-center gap-2">
              <Link to={`/products/${product.id}/edit`}>
                <Button variant="secondary" className="text-xs px-3 py-1">
                  Edit
                </Button>
              </Link>

              <Form method="post" action="/products/delete">
                <input type="hidden" name="id" value={product.id} />
                <Button variant="danger" type="submit" className="text-xs px-3 py-1">
                  Delete
                </Button>
              </Form>
            </div>
          </td>
        </tr>
      ))}
    </Table>
  );
}
