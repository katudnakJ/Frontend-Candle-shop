"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { useGetAllProducts } from "@/modules/products/hooks/useGetAllProducts";
import ProductCard from "@/modules/products/components/ProductCard";
import Header from "@/components/layout/CustomerHeader";
import Footer from "@/components/layout/Footer";
import { ListFilter } from "lucide-react";
import CustomerWelcome from "@/modules/customers/components/CustomerWelcome";
import { GenericResponse } from "@/types/response.type";
import { ProductHomeData } from "@/modules/products/homeproduct";
import { useRouter, useSearchParams } from "next/navigation";

import { usePrefetchHomeProducts } from "@/modules/products/hooks/usePrefetchHomeProducts";
import { AllProductSkeleton } from "@/modules/products/components/AllProductSkeleton";
import { RecommendedProductSkeleton } from "@/modules/products/components/RecommendedProductSkeleton";



export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sortBy, setSortBy] = useState<string>("default");
  const productSectionRef = useRef<HTMLDivElement>(null);

  const pageParam = Number(searchParams.get("page")) || 1;
  const currentPage = pageParam - 1;
  const pageSize = 2;

  const { data, isLoading, isError } = useGetAllProducts(
    currentPage,
    pageSize,
  ) as {
    data: GenericResponse<ProductHomeData> | undefined;
    isLoading: boolean;
    isError: boolean;
  };

  const handlePageChange = (newPage: number) => {
    const displayPage = newPage + 1;
    if (displayPage === 1) {
      router.push(`/customerhome`, { scroll: false });
    } else {
      router.push(`?page=${displayPage}`, { scroll: false });
    }
  };

  useEffect(() => {
    if (pageParam > 1) {
      sessionStorage.setItem("last_homeproduct_page", `?page=${pageParam}`);
    } else {
      sessionStorage.setItem("last_homeproduct_page", "");
    }
  }, [pageParam]);

  useEffect(() => {
    if (productSectionRef.current) {
      productSectionRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentPage]);

  // API : Get Products (All products)
  const productData = data?.data || data;

  const allProducts = (productData as ProductHomeData)?.allProducts || [];
  const recommendedItems =
    (productData as ProductHomeData)?.featuredProducts || [];
  const totalProducts = (productData as ProductHomeData)?.totalProducts || 0;
  const nextPages = (productData as ProductHomeData)?.hasNext || false;
  const productStartAt = (productData as ProductHomeData)?.startAt || 0;
  const productEndAt = (productData as ProductHomeData)?.endAt || 0;

  const totalPages =
    totalProducts > 0 ? Math.ceil(totalProducts / pageSize) : 1;

  //const allProducts = [...recommendedItems, ...nonFeaturedItems];
  //(recommendedItems.length || 0) + (productData?.nonFeaturedTotal || 0);

  usePrefetchHomeProducts(currentPage + 1, pageSize, nextPages);

  const sortedProducts = useMemo(() => {
    const products = [...allProducts];
    if (sortBy === "priceLowHigh")
      return products.sort((a, b) => a.price - b.price);
    if (sortBy === "priceHighLow")
      return products.sort((a, b) => b.price - a.price);
    if (sortBy === "newest") {
      return products.sort(
        (a, b) =>
          new Date(b.productCreatedDate).getTime() -
          new Date(a.productCreatedDate).getTime(),
      );
    }
    return products;
  }, [allProducts, sortBy]);

  console.log("Check Structure:", data);
  console.log("Check productDat:", productData);
  console.log("current page:", currentPage);

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
            <section ref={productSectionRef} className="scroll-mt-10">
              <h2 className="text-2xl font-bold mb-4 text-black">
                สินค้าแนะนำ
              </h2>
              <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar min-h-[250px]">
                {isLoading
                  ? (
                    <RecommendedProductSkeleton/>
                   ) : ( recommendedItems.map((item) => (
                      <div
                        key={item.productId}
                        className="min-w-[180px] w-[180px] md:w-[200px] lg:w-[400px]"
                      >
                        <ProductCard
                          key={item.productId}
                          product={item}
                          isRecommended={true}
                          priority={true}
                        />
                      </div>
                    ))
                    )}
              </div>
            </section>

            {/* สินค้าทั้งหมด      */}

            <section>
              <h2 className="text-2xl font-bold mb-4 text-black ">
                สินค้าทั้งหมด
              </h2>
              {isLoading ? (
                <AllProductSkeleton pageSize={pageSize} />
              ) : isError || !data || allProducts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-gray-100 rounded-3xl">
                  <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <ListFilter size={40} className="text-gray-300" />
                  </div>
                  <p className="text-gray-500 font-medium">
                    ไม่พบสินค้าในหน้านี้
                  </p>
                  <button
                    onClick={() => handlePageChange(0)}
                    className="mt-4 text-sm text-blue-500 hover:underline"
                  >
                    กลับไปหน้าแรก
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex justify-between mb-4">
                    <p className="text-sm text-gray-400 ">
                      จำนวนทั้งหมด {totalProducts} ชิ้น
                    </p>
                    <button>
                      <div className="relative flex items-center gap-2">
                        <select
                          value={sortBy}
                          onChange={(e) => setSortBy(e.target.value)}
                          className="p-2 border-2 border-black rounded-xl bg-cprojectone text-sm cursor-pointer outline-none hover:translate-y-1 transition-all duration-300"
                        >
                          <option value="default">ค่าเริ่มต้น</option>
                          <option value="priceLowHigh">ราคา: น้อยไปมาก</option>
                          <option value="priceHighLow">ราคา: มากไปน้อย</option>
                          <option value="newest">ใหม่ล่าสุด</option>
                        </select>
                      </div>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 min-h-[400px]">
                    {sortedProducts.map((item, index) => (
                      <ProductCard
                        key={item.productId}
                        product={item}
                        priority={pageParam === 1 && index < 2}
                      />
                    ))}
                  </div>
                  <div className="flex justify-center items-center gap-2 mt-10 pb-10">
                    <button
                      onClick={() =>
                        handlePageChange(Math.max(0, currentPage - 1))
                      }
                      disabled={currentPage === 0}
                      className="px-4 py-2 border rounded-lg disabled:opacity-30"
                    >
                      ย้อนกลับ
                    </button>

                    <span className="text-sm font-bold">
                      <div>
                        showing {productStartAt} to {productEndAt} of{" "}
                        {totalProducts}{" "}
                      </div>
                      หน้า {pageParam} จาก {totalPages}
                    </span>

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={!nextPages || currentPage + 1 >= totalPages}
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
