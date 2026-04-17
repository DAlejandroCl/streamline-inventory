export default function TableSkeleton() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-4 space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="h-10 bg-gray-200 animate-pulse rounded"
        />
      ))}
    </div>
  );
}