export const RecommendedProductSkeleton = () =>
  [...Array(3)].map((_, i) => (
    <div key={i} className="min-w-[180px] animate-pulse">
      <div className="bg-gray-200 aspect-square rounded-2xl mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4" />
    </div>
  ));
