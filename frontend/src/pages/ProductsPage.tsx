import Table from "../components/ui/Table";
import Button from "../components/ui/Button";

export default function ProductsPage() {
  const products = [
    { id: 1, name: "Laptop", price: 1500, availability: true },
    { id: 2, name: "Phone", price: 800, availability: true }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Products</h1>

        <Button>
          + New Product
        </Button>
      </div>

      <Table headers={["Name", "Price", "Status", "Actions"]}>
        {products.map((p) => (
          <tr key={p.id} className="border-t">
            <td className="p-3">{p.name}</td>
            <td className="p-3">${p.price}</td>
            <td className="p-3">
              {p.availability ? "Available" : "Out"}
            </td>
            <td className="p-3 space-x-2">
              <Button variant="secondary">Edit</Button>
              <Button variant="danger">Delete</Button>
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}