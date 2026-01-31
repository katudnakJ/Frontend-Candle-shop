// app/product/[id]/page.tsx
import { mockProducts } from "@/modules/products/mockdata";
import Image from "next/image";
import Header from "@/components/layout/Customer_Header";
import Footer from "@/components/layout/Footer";
import { ChevronLeft, ShoppingCart } from "lucide-react";
import Link from "next/link";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  // ค้นหาสินค้าจาก ID 
  const { slug } = await params;
  const product = mockProducts.find((p) => String(p.slug) === slug);

  if (!product)
    return <div className="p-10 text-white">ไม่พบสินค้า (Name: {slug})</div>;

  return (
    <div>
      <div className="flex flex-col min-h-screen bg-white pb-24">
        {" "}
 
        <Header />
        {/* Main Content */}
        <main className="flex-grow bg-white font-sans">


          <div className="p-4 flex items-center">
            <Link href="/">
              <ChevronLeft size={28} className="text-black" />
            </Link>
            <span>
              <p className="text-black">รายละเอียดสินค้า</p>
            </span>
          </div>


          {/* Image Gallery (Simplified) */}
          <div className="w-full flex justify-center px-6 mb-10">
          <div className="relative aspect-square w-full max-w-[400px] rounded-3xl overflow-hidden bg-gray-50 shadow-sm border border-8 ">
            <Image
              src={product.images?.find((img) => img.is_primary)?.product_img_slug ||
                   product.images?.[0]?.product_img_slug ||
                    "/placeholder-image.jpg"}
              alt={product.product_name}
              fill
              className="object-cover"
            />
          </div>
          </div>

          {/* Product Info */}
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-black">
              {product.product_name}
            </h1>
            <p className="text-2xl font-bold text-red-500">฿{product.price}</p>
          </div>

          {/* Specifications Table */}
          <div className="border-t border-gray-100 pt-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">น้ำหนัก</span>
              <span className="text-black font-medium">
                {product.weight || "200"} กรัม
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">ระยะเวลาผลิต</span>
              <span className="text-black font-medium">3-5 วัน</span>{" "}
              {/* ค่าตายตัวตามที่คุณต้องการ */}
            </div>
          </div>
        </main>
        {/* --- Sticky Bottom Bar --- */}
        {/* <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 px-6 flex items-center gap-4">
        <button className="p-3 border border-black rounded-xl">
          <ShoppingCart size={24} className="text-black" />
        </button>
        <button className="flex-grow bg-black text-white py-3 rounded-xl font-bold text-lg active:scale-95 transition-transform">
          ซื้อทันที
        </button>
      </div> */}
      </div>
      <Footer />
    </div>
  );
}
