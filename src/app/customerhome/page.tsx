"use client";

import { useState, useEffect, useRef } from "react";
import { useGetAllProducts } from "@/modules/products/hooks/useGetAllProducts";
import ProductCard from "@/modules/products/components/ProductCard";
import Header from "@/components/layout/CustomerHeader";
import Footer from "@/components/layout/Footer";
import { ListFilter } from "lucide-react";
import CustomerWelcome from "@/modules/customers/components/CustomerWelcome";
import { GenericResponse } from "@/types/response.type";
import { ProductHomeData } from "@/modules/products/homeproduct";

export default function Home() {
  const [currentPage, setCurrentPage] = useState(0);
  const productSectionRef = useRef<HTMLDivElement>(null);
  const pageSize = 4;
  const { data, isLoading, isError } = useGetAllProducts(
    currentPage,
    pageSize,
  ) as {
    data: GenericResponse<ProductHomeData> | undefined;
    isLoading: boolean;
    isError: boolean;
  };

  useEffect(() => {
    // ถ้ามีการเปลี่ยนหน้า และเรามีตำแหน่งอ้างอิง
    if (productSectionRef.current) {
      productSectionRef.current.scrollIntoView({
        behavior: "smooth", // เลื่อนแบบนุ่มนวล
        block: "start", // ให้ขอบบนของโซนนี้อยู่บนสุดของจอ
      });
    }
  }, [currentPage]);

   const ProductSkeleton = () => (
  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 animate-pulse">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="space-y-3">
        <div className="bg-gray-200 h-48 w-full rounded-2xl"></div>
        <div className="bg-gray-200 h-4 w-3/4 rounded"></div>
        <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
      </div>
    ))}
  </div>
);
  // API : Get Products (All products)
  const productData = data?.data || data;
  const allProducts = (productData as ProductHomeData)?.allProducts || [];
  const recommendedItems = (productData as ProductHomeData)?.featuredProducts || [];
  const totalItem = (productData as ProductHomeData)?.totalProducts
  const totalPages = totalItem > 0 ? Math.ceil(totalItem / pageSize) : 1;

  //const allProducts = [...recommendedItems, ...nonFeaturedItems];
  //(recommendedItems.length || 0) + (productData?.nonFeaturedTotal || 0);

  console.log("Check Structure:", data);
  console.log("Check productDat:", productData);

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

            <section
              ref={productSectionRef}
              className="scroll-mt-10 min-h-[500px]"
            >
              <h2 className="text-2xl font-bold mb-4 text-black ">
                สินค้าทั้งหมด
              </h2>
              {isLoading ? (
                <div className="flex items-center justify-center py-20">
                  กำลังโหลดข้อมูลสินค้า...
                </div>
              ) : isError || !data || allProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
                  <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <ListFilter size={40} className="text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">
                    ไม่พบสินค้าในหน้านี้
                  </p>
                  <button
                    onClick={() => setCurrentPage(0)}
                    className="mt-4 text-sm text-blue-500 hover:underline"
                  >
                    กลับไปหน้าแรก
                  </button>
                </div>
              ) : (
                <>
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
                  <div className="flex justify-center items-center gap-2 mt-10 pb-10">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(0, prev - 1))
                      }
                      disabled={currentPage === 0}
                      className="px-4 py-2 border rounded-lg disabled:opacity-30"
                    >
                      ย้อนกลับ
                    </button>

                    <span className="text-sm font-bold">
                      <div>จำนวนทั้งหมด {totalItem} ชิ้น</div>
                      หน้า {currentPage + 1} จาก {totalPages}
                    </span>

                    <button
                      onClick={() =>
                        setCurrentPage((prev) =>
                          prev + 1 < totalPages ? prev + 1 : prev,
                        )
                      }
                      disabled={currentPage + 1 >= totalPages}
                      className="px-4 py-2 border rounded-lg disabled:opacity-30"
                    >
                      ถัดไป
                    </button>
                  </div>
                </>
              )}
            </section>
          </div>
        </div>
      </main>
      {/* Footer*/}

      <Footer />
    </div>
  );
}
