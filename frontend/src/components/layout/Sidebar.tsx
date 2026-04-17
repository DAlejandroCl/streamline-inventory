import { NavLink } from "react-router-dom";

const linkBase =
  "block px-4 py-2 rounded-lg transition text-sm font-medium";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-white border-r p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-8 text-primary">
        Streamline
      </h1>

      <nav className="space-y-2">
        <NavLink
          to="/"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/products"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          Products
        </NavLink>

        <NavLink
          to="/products/new"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-gray-100"
            }`
          }
        >
          New Product
        </NavLink>
      </nav>
    </aside>
  );
}