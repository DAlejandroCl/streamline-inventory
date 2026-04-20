/*
 * Movido de src/components/tables/ a src/components/ui/
 * para centralizar todos los componentes UI base en un solo lugar.
 * Actualizar el import en ProductsPage.tsx al aplicar este cambio.
 */

export default function ProductsTableSkeleton() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="bg-gray-100 px-3 py-3 grid grid-cols-4 gap-4">
          {["Name", "Price", "Status", "Actions"].map((col) => (
            <div key={col} className="h-4 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>

        <div className="divide-y divide-gray-100">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-3 py-4 grid grid-cols-4 gap-4 animate-pulse">
              <div className="h-4 bg-gray-200 rounded col-span-1" />
              <div className="h-4 bg-gray-200 rounded w-16" />
              <div className="h-5 bg-gray-200 rounded-full w-20" />
              <div className="h-4 bg-gray-200 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
