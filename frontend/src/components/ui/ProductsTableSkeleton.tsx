export default function ProductsTableSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-56 bg-[var(--color-surface-container-high)] rounded-lg" />
          <div className="h-4 w-80 bg-[var(--color-surface-container)] rounded" />
        </div>
        <div className="h-10 w-36 bg-[var(--color-surface-container-high)] rounded-lg" />
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-[var(--color-surface-container-lowest)] p-6 rounded-xl shadow-ambient space-y-3">
            <div className="h-3 w-24 bg-[var(--color-surface-container-high)] rounded" />
            <div className="h-8 w-16 bg-[var(--color-surface-container-high)] rounded" />
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[var(--color-surface-container-lowest)] rounded-2xl overflow-hidden shadow-ambient">
        <div className="bg-[var(--color-surface-container-low)] px-6 py-4 grid grid-cols-5 gap-4">
          {["Name", "Price", "Status", "Created", "Actions"].map((col) => (
            <div key={col} className="h-3 bg-[var(--color-surface-container-high)] rounded" />
          ))}
        </div>
        <div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="px-6 py-4 grid grid-cols-5 gap-4 border-t border-[var(--color-outline-variant)]/10">
              <div className="h-4 bg-[var(--color-surface-container)] rounded col-span-1" />
              <div className="h-4 bg-[var(--color-surface-container)] rounded w-20" />
              <div className="h-5 bg-[var(--color-surface-container)] rounded-full w-24" />
              <div className="h-4 bg-[var(--color-surface-container)] rounded w-20" />
              <div className="h-4 bg-[var(--color-surface-container)] rounded w-16" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
