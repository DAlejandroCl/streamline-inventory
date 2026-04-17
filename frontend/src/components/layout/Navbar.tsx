export default function Navbar() {
  return (
    <header className="bg-white border-b px-8 py-4 flex justify-between items-center">
      <h2 className="text-lg font-semibold text-gray-700">
        Dashboard
      </h2>

      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">
          Admin
        </span>

        <div className="w-8 h-8 rounded-full bg-indigo-500 text-white flex items-center justify-center text-sm font-bold">
          A
        </div>
      </div>
    </header>
  );
}