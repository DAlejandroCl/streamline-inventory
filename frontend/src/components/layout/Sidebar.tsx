import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-indigo-700 text-white p-4">
      <h1 className="text-xl font-bold mb-6">Inventory</h1>

      <nav className="space-y-2">
        <NavLink to="/">Dashboard</NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/products/new">New Product</NavLink>
      </nav>
    </aside>
  );
}