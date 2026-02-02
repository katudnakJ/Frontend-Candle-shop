// app/product/[id]/page.tsx
import { mockProducts } from "@/modules/products/mockdata";
import Image from "next/image";
import Header from "@/components/layout/CustomerHeader";
import Footer from "@/components/layout/Footer";
import ProductImageCarousel from "@/modules/products/components/ProductImageCarousel";
import ProductPurchaseActions from "@/modules/products/components/ProductPurchaseActions";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = mockProducts.find((p) => String(p.slug) === slug);

  if (!product)
    return <div className="p-10 text-white">ไม่พบสินค้า (Name: {slug})</div>;

  return (
    <div>
      <div className="flex flex-col min-h-screen bg-white ">
        {" "}
        <Header />
        <main className="flex-grow bg-white font-sans">
          <div className="p-4 flex items-center">
            <Link href="/">
              <ChevronLeft className="w-10 h-10 md:w-13 md:h-13 text-black" />
            </Link>
            <span>
              <p className="text-md md:text-2xl text-black">รายละเอียดสินค้า</p>
            </span>
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
              <ProductImageCarousel images={product.images || []} />
            </div>
          </div>

          <div className="flex flex-col items-center text-center px-6 space-y-4 mb-10">
            <h1 className="text-2xl sm:text-3xl font-bold text-black leading-tight">
              {product.product_name}
            </h1>

            <div className="max-w-[400px] w-full">
              <p className="text-sm sm:text-base text-gray-600 text-left leading-relaxed ">
                {product.description}
              </p>
            </div>
          </div>

          <div className="border border-gray-200 mx-auto  p-6 rounded-2xl shadow-sm">
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

          <ProductPurchaseActions price={product.price} />
        </main>
      </div>
      <Footer />
    </div>
  );
}
