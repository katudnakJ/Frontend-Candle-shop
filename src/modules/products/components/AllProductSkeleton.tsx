export const AllProductSkeleton = ({ pageSize }: { pageSize: number }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
    {[...Array(pageSize)].map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="bg-gray-200 aspect-square rounded-2xl mb-4" />
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
      </div>
    ))}
  </div>
);