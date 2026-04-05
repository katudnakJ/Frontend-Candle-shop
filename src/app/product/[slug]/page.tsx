"use client";

import { use, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetProductDetail } from "@/modules/products/hooks/useGetProductDetail";

import Header from "@/components/layout/CustomerHeader";
import Footer from "@/components/layout/Footer";
import ProductImageCarousel from "@/modules/products/components/ProductImageCarousel";
import ProductPurchaseActions from "@/modules/products/components/ProductPurchaseActions";
import { PreviousButton } from "@/components/commonui/PreviousButton";
import { ProductDetailResData } from "@/modules/products/detailproduct";
import { USER_ROLE } from "@/constants/userRole";
import { RoleGuard } from "@/auth/RoleGuard";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get("id");
  const { data, isLoading, isError } = useGetProductDetail(productId);

  const { product, productImages } = useMemo(() => {
    const productDetailData = data?.data || data;
    const typedData = productDetailData as ProductDetailResData;
    return {
      product: typedData?.product || null,
      productImages: typedData?.productImages || [],
    };
  }, [data]);

  useEffect(() => {
    if (!productId) {
      router.replace("/");
    }
  }, [productId, router]);

  useEffect(() => {
    if (isError) {
      router.replace("/");
    }
  }, [isError, router]);

  useEffect(() => {
    if (data && slug) {
      const productDetailDatacheck = data?.data || data;
      const actualSlug = productDetailDatacheck?.product.slug;

      if (actualSlug && actualSlug !== slug) {
        router.replace(`/product/${actualSlug}?id=${productId}`);
      }
    }
  }, [data, slug, productId, router]);

  if (isLoading)
    return <div className="p-10 text-center">กำลังโหลดข้อมูล...</div>;
  if (isError || !data)
    return <div className="p-10 text-center">ไม่พบข้อมูลสินค้า</div>;

  if (!product)
    return <div className="p-10 text-black">ไม่พบสินค้า (Name: {slug})</div>;

  return (
    <div>
        <RoleGuard
        allowedRoles={[
          USER_ROLE.DEVELOPER,
          USER_ROLE.CUSTOMER,
        ]}
      >
      <div className="flex flex-col min-h-screen bg-white ">
        <Header />
        <main className="grow bg-white pb-20">
          <div className="max-w-[1200px] mx-auto p-4 flex items-center">
            <PreviousButton isDetailProduct={true} />
          </div>

          <div className="flex justify-center px-6 py-4 mb-10 ml-5 mr-5">
            <div className="relative aspect-square w-full max-w-[400px] rounded-3xl overflow-hidden bg-gray-50 shadow-md drop-shadow-orange-300 border-cprojectfour border-4 ">
              {/* แสดงรูปแบบเลื่อนแนวนอนได้ */}
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
                  <span className="text-black font-semibold">5-7 วัน</span>
                </div>
                <div className="pt-2 border-t border-gray-100">
                  <p className="text-[11px] sm:text-xs text-gray-400 text-left italic">
                    *กรณีสั่งซื้อมากกว่า{" "}
                    <span className="text-red-400 font-bold">1,000 ชิ้น</span>{" "}
                    ขึ้นไป
                    <br className="block sm:hidden" />{" "}
                    {/* ตัดบรรทัดเฉพาะมือถือ */}
                    กรุณา{" "}
                    <span className="text-gray-600 font-bold underline ">
                      ติดต่อร้านค้าโดยตรง
                    </span>{" "}
                    เพื่อรับราคาพิเศษ
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="max-w-[1200px] mx-auto px-4 md:px-6">
            <ProductPurchaseActions
              price={product.price}
              productId={product.productId}
              productName={product.productName}
            />
          </div>
        </main>
        <Footer />
      </div>
      </RoleGuard>
    </div>
  );
}
