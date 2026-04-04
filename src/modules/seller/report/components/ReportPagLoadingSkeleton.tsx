export const ReportCardSkeleton = () => (
  <div className="mx-auto min-h-[60vh] max-w-215 bg-[#ffffff] px-4 pb-12 pt-8 sm:px-6">
    <div className="mb-6 flex items-center gap-2">
      <span className="block h-[1.3em] w-1 rounded bg-[#e5e5e5]" />
      <div className="h-5 w-64 animate-pulse rounded bg-gray-200" />
    </div>

    <div className="mb-7 flex flex-wrap gap-2.5">
      <div className="mb-7 flex flex-wrap gap-2.5">
        <div className="h-14 w-44 animate-pulse rounded-md bg-gray-100" />
        <div className="h-14 w-32 animate-pulse rounded-md bg-gray-100" />
      </div>
      <div className="h-14 w-28 animate-pulse rounded-md bg-[#c9a96e]/30" />
    </div>

    <div className="mt-7 mb-3 h-5 w-40 animate-pulse rounded bg-gray-200" />
    <div className="mb-3 grid gap-3 sm:grid-cols-2">
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-[#e8e2d9] bg-[#faf7f2] p-4"
        >
          <div className="mb-2 h-4 w-32 rounded bg-gray-200" />
          <div className="mb-3 h-6 w-40 rounded bg-gray-200" />
          <div className="h-3 w-24 rounded bg-gray-100" />
        </div>
      ))}
    </div>

    <div className="mb-4 grid grid-cols-3 gap-3">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="flex flex-col items-center gap-2 rounded-lg border border-[#e8e2d9] bg-[#f5f2ee] px-4 py-3 animate-pulse"
        >
          <div className="h-3 w-16 rounded bg-gray-200" />
          <div className="h-6 w-10 rounded bg-gray-200" />
        </div>
      ))}
    </div>

    <div className="mb-7 grid gap-3 sm:grid-cols-2">
      {[...Array(2)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-xl border border-[#e8e2d9] bg-[#faf7f2] p-4"
        >
          <div className="mb-2 h-4 w-40 rounded bg-gray-200" />
          <div className="mb-3 h-6 w-32 rounded bg-gray-200" />
          <div className="h-3 w-28 rounded bg-gray-100" />
        </div>
      ))}
    </div>

    <div className="mb-3 h-5 w-40 animate-pulse rounded bg-gray-200" />

    <div className="mb-7 rounded-xl border border-[#e8e2d9] bg-white p-5 shadow-sm">
      <div className="mb-4 h-4 w-60 animate-pulse rounded bg-gray-200" />
      <div className="mt-4 flex items-end gap-3">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex flex-1 flex-col items-center gap-2">
            <div className="w-full rounded-t-md bg-gray-200 animate-pulse" style={{ height: 40 + i * 10 }} />
            <div className="h-3 w-10 rounded bg-gray-100" />
          </div>
        ))}
      </div>
    </div>

    <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-[#e8e2d9] bg-[#f5f2ee] px-6 py-5 text-center animate-pulse">
      <div className="h-4 w-64 rounded bg-gray-200" />
      <div className="h-10 w-32 rounded-md bg-gray-200" />
    </div>
  </div>
);