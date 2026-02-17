export const ShoppingCartSkeletonpage = () => (
  <div className="w-full min-h-screen bg-white animate-pulse">
    <div className="max-w-[1200px] mx-auto p-4">
      {/* Header Skeleton */}
      <div className="h-8 w-48 bg-gray-200 rounded mb-6"></div>
      
      {/* Select All Skeleton */}
      <div className="mb-4 flex items-center gap-2 px-2">
        <div className="w-5 h-5 bg-gray-200 rounded"></div>
        <div className="h-4 w-24 bg-gray-200 rounded"></div>
      </div>

      {/* Item Cards Skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 w-full border-2 border-gray-100 rounded-2xl flex p-4 gap-4">
            <div className="w-24 h-24 bg-gray-200 rounded-xl shrink-0"></div>
            <div className="flex-grow space-y-3">
              <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
              <div className="flex justify-between mt-4">
                <div className="h-6 w-20 bg-gray-200 rounded"></div>
                <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
    
    {/* Summary Bar Skeleton */}
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-gray-50 border-t-2 border-gray-100 p-4 flex justify-between items-center px-8">
      <div className="space-y-2">
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
        <div className="h-6 w-48 bg-gray-200 rounded"></div>
      </div>
      <div className="h-12 w-40 bg-gray-200 rounded-2xl"></div>
    </div>
  </div>
);