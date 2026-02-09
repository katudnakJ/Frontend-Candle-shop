export function AddressFormSkeleton() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-black animate-pulse">
      {/* Title Skeleton */}
      <div className="h-7 bg-gray-200 rounded-md w-1/3 mb-6"></div>

      <div className="space-y-6">
        {/* FirstName and lastName Skeleton */}
        <div className="grid grid-cols-1 max-w-[400px] gap-4">
          <div className="h-12 bg-gray-100 rounded-xl w-full"></div>
          <div className="h-12 bg-gray-100 rounded-xl w-full"></div>
        </div>

        {/* Phone and Address Skeleton */}
        <div className="h-12 bg-gray-100 rounded-xl w-full"></div>
        <div className="h-12 bg-gray-100 rounded-xl w-full"></div>

        {/* Selects Skeleton */}
        <div className="grid grid-cols-2 gap-4">
          <div className="h-12 bg-gray-100 rounded-xl w-full"></div>
          <div className="h-12 bg-gray-100 rounded-xl w-full"></div>
          <div className="h-12 bg-gray-100 rounded-xl w-full"></div>
          <div className="h-12 bg-gray-100 rounded-xl w-full"></div>
        </div>

        {/* Label Buttons Skeleton */}
        <div className="flex gap-2 pt-2">
          <div className="h-10 bg-gray-200 rounded-xl w-16 px-4 py-2"></div>
          <div className="h-10 bg-gray-200 rounded-xl w-16 px-4 py-2"></div>
          <div className="h-10 bg-gray-200 rounded-xl w-16 px-4 py-2"></div>
          <div className="h-10 bg-gray-200 rounded-xl w-16 px-4 py-2"></div>
          <div className="h-10 bg-gray-200 rounded-xl w-16 px-4 py-2"></div>
        </div>


        <div className="flex gap-3 pt-6">
            <div className="inline-flex h-8 max-w-20 bg-gray-300 rounded-full flex-1"></div>
        </div>
        {/* Action Buttons Skeleton */}
        <div className="flex gap-3 pt-6">
          <div className="h-14 bg-gray-300 rounded-2xl flex-1"></div>
          <div className="h-14 bg-gray-200 rounded-2xl flex-1"></div>
        </div>
      </div>
    </div>
  );
}
