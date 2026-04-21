import { useLocation } from "react-router-dom";

const PAGE_TITLES: Record<string, string> = {
  "/": "Dashboard",
  "/products": "Products",
  "/products/new": "New Product",
};

function getTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.endsWith("/edit")) return "Edit Product";
  return "Streamline";
}

export default function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
      <h2 className="text-lg font-semibold text-gray-700">
        {getTitle(pathname)}
      </h2>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">Admin</span>
        <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-bold">
          A
        </div>
      </div>
    </header>
  );
}
