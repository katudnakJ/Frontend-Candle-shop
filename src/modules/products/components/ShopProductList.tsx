// components/seller/ProductList.tsx
"use client";

import { useState } from "react";
import { Package, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useShopProducts } from "@/modules/products/hooks/useShopProducts";
import { useShopProductStore } from "@/modules/products/hooks/useShopProductStore";
import { Skeleton } from "@mui/material";
import ShopProductCard from "./ShopProductCard";
import FullscreenLoader from "@/modules/products/components/FullscreenLoaderforshopproduct";
import toast from "react-hot-toast";
import ConfirmDialog from "@/components/commonui/ConfirmDialog";

export default function ShopProductList() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);

  const router = useRouter();
  const { featuredProducts, nonFeaturedProducts, isLoading, deleteProduct } =
    useShopProducts();

  const searchQuery = useShopProductStore((state) => state.searchQuery);

  const handleEditRedirect = (productSlug: string) => {
    router.push(`/seller/sellerproducts/manageproducts/${productSlug}`);
  };

  const handleDelete = (id: string) => {
    setProductToDelete(id);
    setIsDeleteOpen(true);
  };
  const confirmDeleteProduct = async () => {
    if (productToDelete) {
      try {
        await deleteProduct(productToDelete); // เรียกใช้ deleteProduct จาก hook
       console.log("ลบสินค้าสำเร็จ");
      } catch (error) {
        toast.error("ไม่สามารถลบสินค้าได้");
      } finally {
        setIsDeleteOpen(false);
        setProductToDelete(null);
      }
    }
  };

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

  if (featuredProducts.length === 0 && nonFeaturedProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Search size={48} className="mb-2 opacity-20" />
        <p className="">{`ไม่พบสินค้าที่ตรงกับ "${searchQuery}"`}</p>
        <button
          onClick={() => useShopProductStore.getState().setSearchQuery("")}
          className="mt-2 text-blue-600 text-sm underline"
        >
          ล้างการค้นหา
        </button>
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
              ⭐ สินค้าที่ขายดีของร้านวันนี้
            </h2>
            <div className="flex flex-col gap-3">
              {featuredProducts.map((product) => (
                <ShopProductCard
                  key={product.productId}
                  product={product}
                  isFeatured={true} //
                  onDelete={(id) => handleDelete(id)}
                  onEdit={(slug) => handleEditRedirect(slug)}
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <h2 className="text-sm font-bold text-gray-500 mb-3 font-prompt">
            สินค้าที่มีจำหน่ายในร้านทั้งหมด
          </h2>
          <div className="flex flex-col gap-3">
            {nonFeaturedProducts.map((product) => (
              <ShopProductCard
                key={product.productId}
                product={product}
                onDelete={(id) => handleDelete(id)}
                onEdit={(id) => handleEditRedirect(id)}
              />
            ))}
          </div>
        </section>

        {featuredProducts.length === 0 && nonFeaturedProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Package size={48} className="mb-2 opacity-20" />
            <p className="font-prompt">ยังไม่มีสินค้าในร้านค้าของคุณ</p>
            <button
              onClick={() =>
                router.push("/seller/sellerproducts/manageproducts/add")
              }
              className="mt-4 text-red-600 font-bold text-sm"
            >
              + เพิ่มสินค้าชิ้นแรก
            </button>
          </div>
        )}
      </div>
      <ConfirmDialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={confirmDeleteProduct}
        title="ยืนยันการลบสินค้า"
        content={
          <div className="text-center py-2">
            <p className="text-sm text-gray-500">
              คุณแน่ใจหรือไม่ว่าต้องการลบสินค้านี้?
            </p>
            <p className="text-xs text-red-400 mt-1">
              *การดำเนินการนี้ไม่สามารถย้อนกลับได้
            </p>
          </div>
        }
        variant="danger"
      />
    </>
  );
}
