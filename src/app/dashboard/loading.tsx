export default function DashboardLoading() {
  return (
    <div className="space-y-6">
      <div className="h-9 w-48 bg-soft-gray rounded-xl animate-pulse rounded-lg" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-36 bg-white rounded-2xl border border-soft-border shadow-pastel overflow-hidden"
          >
            <div className="p-6 flex items-center justify-between">
              <div className="space-y-3">
                <div className="h-4 w-20 bg-soft-gray rounded animate-pulse" />
                <div className="h-9 w-16 bg-soft-gray rounded animate-pulse" />
              </div>
              <div className="h-14 w-14 rounded-xl bg-soft-gray animate-pulse" />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-soft-border shadow-pastel overflow-hidden">
        <div className="px-6 py-4 border-b border-soft-border flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-soft-gray animate-pulse" />
          <div className="h-5 w-40 rounded bg-soft-gray animate-pulse" />
        </div>
        <div className="p-6 space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-soft-gray animate-pulse" />
              <div className="h-4 flex-1 max-w-xs rounded bg-soft-gray animate-pulse" />
              <div className="h-4 w-24 rounded bg-soft-gray animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
