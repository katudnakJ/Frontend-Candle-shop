export const CartCheckoutSkeletonpage = () => (
  <div className="w-full min-h-screen bg-white animate-pulse">
    <div className="max-w-[1200px] mx-auto p-4 space-y-8">
  
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
        <div className="h-8 w-32 bg-gray-200 rounded"></div>
      </div>

     
      <section className="border-b-2 border-gray-100 pb-8">
        <div className="flex gap-2 mb-4">
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-12 w-full">
          <div className="col-start-1 col-span-12 md:col-start-2 md:col-span-10 h-32 bg-gray-100 rounded-[2rem]"></div>
        </div>
      </section>

    
      <section className="space-y-4">
        <div className="flex gap-2 mb-4">
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
          <div className="h-6 w-40 bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-12 w-full gap-4">
          <div className="col-start-1 col-span-12 md:col-start-2 md:col-span-10 space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-28 w-full bg-gray-50 rounded-2xl border-2 border-gray-100"></div>
            ))}
          </div>
        </div>
      </section>

    
      <section className="grid grid-cols-12 w-full mt-10">
        <div className="col-span-12 h-6 w-48 bg-gray-200 rounded mb-6"></div>
        <div className="col-start-1 col-span-12 md:col-start-2 md:col-span-10 h-64 bg-gray-50 border-4 border-gray-100 rounded-[2rem]"></div>
      </section>
    </div>

 
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-gray-50 border-t-2 border-gray-100 p-4">
      <div className="max-w-[1200px] mx-auto flex justify-between items-center px-4">
        <div className="space-y-2">
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
          <div className="h-6 w-32 bg-gray-200 rounded"></div>
        </div>
        <div className="h-12 w-48 bg-gray-200 rounded-2xl"></div>
      </div>
    </div>
  </div>
);