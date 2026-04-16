import { Outlet, Link } from "react-router-dom";

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* HEADER */}
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="text-xl font-bold tracking-tight text-indigo-400"
          >
            Streamline Inventory
          </Link>

          <nav className="flex items-center gap-4">
            <Link
              to="/"
              className="text-sm text-slate-300 hover:text-white transition"
            >
              Home
            </Link>
            <Link
              to="/products"
              className="text-sm text-slate-300 hover:text-white transition"
            >
              Products
            </Link>

            <Link
              to="/products/new"
              className="bg-indigo-500 hover:bg-indigo-600 text-sm px-4 py-2 rounded-lg font-medium transition"
            >
              + New Product
            </Link>
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}