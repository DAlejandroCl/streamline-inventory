export default function ProductsSkeleton() {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
        <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
      </div>

      <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="grid grid-cols-4 gap-4 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
            <div className="h-4 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}