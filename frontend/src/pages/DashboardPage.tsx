import Card from "../components/ui/Card";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-6">
        <Card>
          <p className="text-gray-500">Total Products</p>
          <p className="text-2xl font-bold">120</p>
        </Card>

        <Card>
          <p className="text-gray-500">Active</p>
          <p className="text-2xl font-bold">98</p>
        </Card>

        <Card>
          <p className="text-gray-500">Out of stock</p>
          <p className="text-2xl font-bold">22</p>
        </Card>
      </div>
    </div>
  );
}