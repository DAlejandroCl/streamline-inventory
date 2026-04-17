import Card from "../components/ui/Card";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <Card>
          <p className="text-gray-500 text-sm">Total Products</p>
          <p className="text-3xl font-bold mt-2">120</p>
        </Card>

        <Card>
          <p className="text-gray-500 text-sm">Active</p>
          <p className="text-3xl font-bold mt-2 text-green-600">98</p>
        </Card>

        <Card>
          <p className="text-gray-500 text-sm">Out of stock</p>
          <p className="text-3xl font-bold mt-2 text-red-500">22</p>
        </Card>

      </div>
    </div>
  );
}