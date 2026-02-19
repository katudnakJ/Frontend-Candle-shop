export const QRpaymentSkeletonpage = () => (
  <div className="w-full min-h-screen bg-white animate-pulse pb-32">
    <div className="max-w-[1200px] mx-auto p-4 space-y-10">
      <div className="flex items-center gap-3">
        <div className="w-6 h-6 bg-gray-200 rounded-md"></div>
        <div className="h-6 w-32 bg-gray-200 rounded-lg"></div>
      </div>

      <section className="grid grid-cols-12 w-full mt-10">
        <div className="col-span-12 h-6 w-48 bg-gray-200 rounded mb-6"></div>
        <div className="col-start-1 col-span-12 md:col-start-2 md:col-span-10 h-64 bg-gray-50 border-4 border-gray-100 rounded-[2rem]"></div>
      </section>


      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gray-200 rounded"></div>
          <div className="h-7 w-40 bg-gray-200 rounded-lg"></div>
        </div>

        <div className="grid grid-cols-12 w-full">
          <div className="col-start-1 col-span-12 md:col-start-2 md:col-span-10 bg-gray-50 border-4 border-gray-100 rounded-[2rem] p-6">
            <div className="flex flex-col lg:flex-row gap-10">
              <div className="flex-1 space-y-4">
                <div className="w-full h-[450px] bg-gray-200 rounded-3xl border-2 border-dashed border-gray-300"></div>
                <div className="h-20 w-full bg-gray-200 rounded-2xl"></div>
              </div>

              <div className="flex-1 space-y-4">
                <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>
                <div className="w-full h-64 bg-gray-200 border-4 border-dashed border-gray-300 rounded-[2rem]"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>

    <div className="fixed bottom-0 left-0 right-0 h-28 bg-white border-t-4 border-gray-100 p-5 z-50">
      <div className="max-w-[800px] mx-auto flex flex-col items-center gap-2">
        <div className="h-14 w-full bg-gray-200 rounded-full"></div>
        <div className="h-4 w-48 bg-gray-100 rounded"></div>
      </div>
    </div>
  </div>
);
