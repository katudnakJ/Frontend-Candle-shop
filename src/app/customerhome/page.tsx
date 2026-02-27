"use client";


import { useGetAllProducts } from "@/modules/products/hooks/useGetAllProducts";
import ProductCard from "@/modules/products/components/ProductCard";
import Header from "@/components/layout/CustomerHeader";
import Footer from "@/components/layout/Footer";
import { ListFilter } from "lucide-react";
import CustomerWelcome from "@/modules/customers/components/CustomerWelcome";
import { GenericResponse } from "@/types/response.type";
import { ProductHomeData } from "@/modules/products/homeproduct";

export default function Home() {
  const { data, isLoading, isError } = useGetAllProducts() as {
    data: GenericResponse<ProductHomeData>;
  } & ReturnType<typeof useGetAllProducts>;
  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        กำลังโหลดสินค้า...
      </div>
    );
  if (isError || !data)
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        เกิดข้อผิดพลาดในการโหลดข้อมูล
      </div>
    );


// API : Get Products (All products)
  const productData = data?.data || data;
  const recommendedItems = productData?.featuredProduct || [];
  const nonFeaturedItems = productData?.nonFeaturedProduct || [];
  const allProducts = [...recommendedItems, ...nonFeaturedItems];
  const totalItem =
    (recommendedItems.length || 0) + (productData?.nonFeaturedTotal || 0);

  console.log("Check Structure:", data);
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header*/}
      <Header />

      <main className="flex-grow bg-white font-sans">
        {/* Welcome Customer*/}

        <div className="bg-cprojectone">
          <section>
            <CustomerWelcome />
          </section>
        </div>

        <div className="bg-cprojectone w-full min-h-screen">
          <div className="max-w-[1200px] mx-auto p-4 space-y-8 bg-white ">
            {/* สินค้าแนะนำ      */}

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black">
                สินค้าแนะนำ
              </h2>
              <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
                {recommendedItems.map((item) => (
                  <div
                    key={item.productId}
                    className="min-w-[180px] w-[180px] md:w-[200px] lg:w-[400px]"
                  >
                    <ProductCard product={item} isRecommended={true} />
                  </div>
                ))}
              </div>
            </section>

            {/* สินค้าทั้งหมด      */}

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black ">
                สินค้าทั้งหมด
              </h2>
              <div className="flex justify-between mb-4">
                <p className="text-sm text-gray-400 ">
                  จำนวนทั้งหมด {totalItem} ชิ้น
                </p>
                <button
                  className=" p-2 border bg-cprojectone border-black rounded-xl 
              cursor-pointer 
              hover:translate-y-1 
              transition-all duration-300
              "
                >
                  <ListFilter size={14} className="text-black" />
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {allProducts.map((item) => (
                  <ProductCard key={item.productId} product={item} />
                ))}
              </div>
            </section>
          </div>
        </div>
      </main>
      {/* Footer*/}

      <Footer />
    </div>
  );
}
