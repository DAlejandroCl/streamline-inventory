export default function ProductsTableSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-9 w-56 bg-[var(--color-surface-high) rounded-xl" />
          <div className="h-4 w-72 bg-[var(--color-surface-low) rounded-lg" />
        </div>
        <div className="h-11 w-36 bg-[var(--color-surface-high) rounded-xl" />
      </div>

      <div className="grid grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-[var(--color-surface) p-6 rounded-2xl shadow-card space-y-3 border border-[var(--color-border)/40">
            <div className="h-3 w-20 bg-[var(--color-surface-high) rounded" />
            <div className="h-8 w-14 bg-[var(--color-surface-high) rounded-lg" />
            <div className="h-3 w-24 bg-[var(--color-surface-low) rounded" />
          </div>
        ))}
      </div>

      <div className="bg-[var(--color-surface) rounded-2xl shadow-card overflow-hidden border border-[var(--color-border)/40">
        <div className="bg-[var(--color-surface-low) px-6 py-4 grid grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-3 bg-[var(--color-surface-high) rounded" />
          ))}
        </div>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="px-6 py-4 grid grid-cols-5 gap-4 border-t border-[var(--color-border)/30">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--color-surface-high)" />
              <div className="h-4 w-28 bg-[var(--color-surface-high) rounded" />
            </div>
            <div className="h-4 w-16 bg-[var(--color-surface-high) rounded" />
            <div className="h-5 w-20 bg-[var(--color-surface-high) rounded-full" />
            <div className="h-4 w-20 bg-[var(--color-surface-high) rounded" />
            <div className="h-4 w-20 bg-[var(--color-surface-high) rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}
