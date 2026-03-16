"use client";

import { use } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { GenericResponse } from "@/types/response.type";
import { ProductDetailData } from "@/modules/products/detailproduct";
import { useGetProductDetail } from "@/modules/products/hooks/useGetProductDetail";

import Header from "@/components/layout/CustomerHeader";
import Footer from "@/components/layout/Footer";
import ProductImageCarousel from "@/modules/products/components/ProductImageCarousel";
import ProductPurchaseActions from "@/modules/products/components/ProductPurchaseActions";
import { CartHeader } from "@/modules/cart/components/CartHeader";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const searchParams = useSearchParams();

  const productId = searchParams.get("id");
  const { data, isLoading, isError } = useGetProductDetail(productId);

  if (isLoading)
    return <div className="p-10 text-center">กำลังโหลดข้อมูล...</div>;
  if (isError || !data)
    return <div className="p-10 text-center">ไม่พบข้อมูลสินค้า</div>;

  const { product, productImages } = data?.data || data;;

  if (!product)
    return <div className="p-10 text-black">ไม่พบสินค้า (Name: {slug})</div>;

  return (
    <div>
      <div className="flex flex-col min-h-screen bg-white ">
        <Header />
        <main className="grow bg-white pb-20">
          <div className="max-w-[1200px] mx-auto p-4 flex items-center">
        <CartHeader  isDetailProduct={true}/>
          </div>

          <div className="flex justify-center px-6 py-4 mb-10 ml-5 mr-5">
            <div className="relative aspect-square w-full max-w-[400px] rounded-3xl overflow-hidden bg-gray-50 shadow-md drop-shadow-orange-300 border-cprojectfour border-4 ">
              {/* แสดงรูปแบบปกติ */}
              {/* <Image
                src={
                  product.images?.find((img) => img.is_primary)
                    ?.product_img_slug ||
                  product.images?.[0]?.product_img_slug ||
                  "/placeholder-image.svg"
                }
                alt={product.product_name}
                fill
                className="object-cover"
              /> */}
              {/* แสดงรูปแบบเลื่อนได้ */}
              <ProductImageCarousel images={productImages || []} />
            </div>
          </div>

          <div className="flex flex-col items-center text-center px-6 space-y-4 mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-black leading-tight">
              {product.productName}
            </h1>

            <div className="max-w-[400px] w-full">
              <p className="text-sm sm:text-base text-gray-600 text-left leading-relaxed ">
                {product.description}
              </p>
            </div>
          </div>

          <div className="max-w-[1200px] mx-auto ">
            <div className=" border border-gray-200 p-6  rounded-2xl shadow-sm  ml-10 mr-10">
              <div className="flex justify-between items-center text-xl sm:text-2xl font-bold text-red-500 border-b border-gray-200 pb-4 mb-4">
                <p className="text-black">ราคา</p>
                <p>฿{product.price} /ชิ้น</p>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm sm:text-base border-b border-gray-200 pb-3">
                  <span className="text-gray-500">น้ำหนักสุทธิ</span>
                  <span className="text-black font-semibold">
                    {product.weight || "200"} กรัม
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm sm:text-base">
                  <span className="text-gray-500">เวลาผลิต</span>
                  <span className="text-black font-semibold">3-5 วัน</span>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-[1200px] mx-auto px-4 md:px-6">
            <ProductPurchaseActions price={product.price} />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  );
}
