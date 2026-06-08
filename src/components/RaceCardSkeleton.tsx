export default function RaceCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 border-l-4 border-l-gray-200 bg-white p-5 shadow-sm animate-pulse">
      <div className="mb-3 flex justify-between">
        <div className="h-5 w-3/4 rounded bg-gray-200" />
        <div className="h-5 w-16 rounded-full bg-gray-200" />
      </div>
      <div className="mb-3 flex gap-3">
        <div className="h-4 w-32 rounded bg-gray-100" />
        <div className="h-4 w-24 rounded bg-gray-100" />
      </div>
      <div className="mb-3 flex gap-1.5">
        <div className="h-5 w-12 rounded bg-gray-100" />
        <div className="h-5 w-12 rounded bg-gray-100" />
        <div className="h-5 w-14 rounded bg-gray-100" />
      </div>
      <div className="flex gap-3">
        <div className="h-3 w-16 rounded bg-gray-100" />
        <div className="h-3 w-24 rounded bg-gray-100" />
      </div>
    </div>
  );
}
