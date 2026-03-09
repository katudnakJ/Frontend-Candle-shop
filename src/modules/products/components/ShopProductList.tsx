// components/seller/ProductList.tsx
"use client";

import { Package } from "lucide-react";
import ShopProductCard from "./ShopProductCard";
import { useShopProducts } from "@/modules/products/hooks/useShopProducts";
import FullscreenLoader from '@/modules/products/components/FullscreenLoaderforshopproduct';
import { Skeleton } from "@mui/material";

export default function ShopProductList() {
  const {
    featuredProducts,
    nonFeaturedProducts,
    isLoading,
    deleteProduct,
    editProduct,
  } = useShopProducts();

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            variant="rounded"
            height={110}
            sx={{ borderRadius: "16px" }}
          />
        ))}
      </div>
    );
  }

  return (
    <>
    {/* {isLoading && <FullscreenLoader message="กำลังจัดการข้อมูลสินค้า..." />} */}
    <div className="flex flex-col gap-6 pb-24">
        
      {featuredProducts.length > 0 && (
        <section>
          <h2 className="text-sm font-bold text-blue-600 mt-3 mb-3 font-prompt">
            ⭐ สินค้าแนะนำ
          </h2>
          <div className="flex flex-col gap-3">
            {featuredProducts.map((product) => (
              <ShopProductCard
                key={product.productId}
                product={product}
                isFeatured={true} //
                onDelete={(id) => {
                  if (window.confirm("คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?")) {
                    deleteProduct(id);
                  }
                }}
                onEdit={(id) => {
                  if (window.confirm("คุณแน่ใจหรือไม่ที่จะแก้ไขสินค้านี้?")) {
                    editProduct(id);
                  }
                }}
              />
            ))}
          </div>
        </section>
      )}

      {/* ส่วนสินค้าทั่วไป */}
      <section>
        <h2 className="text-sm font-bold text-gray-500 mb-3 font-prompt">
          สินค้าทั้งหมด
        </h2>
        <div className="flex flex-col gap-3">
          {nonFeaturedProducts.map((product) => (
            <ShopProductCard
              key={product.productId}
              product={product}
              onDelete={(id) => {
                if (window.confirm("คุณแน่ใจหรือไม่ที่จะลบสินค้านี้?")) {
                  deleteProduct(id);
                }
              }}
              onEdit={(id) => {
                if (window.confirm("คุณแน่ใจหรือไม่ที่จะแก้ไขสินค้านี้?")) {
                  editProduct(id);
                }
              }}
            />
          ))}
        </div>
      </section>

      {featuredProducts.length === 0 && nonFeaturedProducts.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Package size={48} className="mb-2 opacity-20" />
          <p className="font-prompt">ยังไม่มีสินค้าในร้านค้าของคุณ</p>
          <button className="mt-4 text-red-600 font-bold text-sm">
            + เพิ่มสินค้าชิ้นแรก
          </button>
        </div>
      )}
    </div>
    </>
  );
}
