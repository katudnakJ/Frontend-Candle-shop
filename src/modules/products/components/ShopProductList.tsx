// components/seller/ProductList.tsx
"use client";

import { useState } from "react";
import { Package, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useShopProducts } from "@/modules/products/hooks/useShopProducts";
import { useShopProductStore } from "@/modules/products/hooks/useShopProductStore";
import { Skeleton } from "@mui/material";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import ShopProductCard from "./ShopProductCard";
import FullscreenLoader from "@/modules/products/components/FullscreenLoaderforshopproduct";
import ConfirmDialog from "@/components/commonui/ConfirmDialog";


export default function ShopProductList() {
  const router = useRouter();
  const { ref, inView } = useInView();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const {
    nonFeaturedProducts,
    // featuredProducts,
    isFetchingNextPage,
    isInitialLoading,
    hasNextPage,
    isDeleting,
    deletingId,
    isError,
    fetchNextPage,
    deleteProduct,
  } = useShopProducts();

  const searchQuery = useShopProductStore((state) => state.searchQuery);

  const handleEditRedirect = (productSlug: string, productId: string) => {

    router.push(`/seller/sellerproducts/manageproducts/${productSlug}?productId=${productId}`);
  };

  const handleDelete = (id: string) => {
    if (isDeleting) {
      return;
    }
    setProductToDelete(id);
    setIsDeleteOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (productToDelete) {
      const id = productToDelete;
      setIsDeleteOpen(false);
      setProductToDelete(null);
      try {
        await deleteProduct(id);
        if (process.env.NODE_ENV === "development") {
          console.log("ลบสินค้าสำเร็จ");
        }
      } catch (error) {
        console.error("Failed to delete:", error);
      }
    }
  };

  useEffect(() => {
    if (
      inView &&
      hasNextPage &&
      !isFetchingNextPage &&
      !isInitialLoading &&
      !isError
    ) {
      fetchNextPage();
    }
  }, [
    inView,
    hasNextPage,
    isFetchingNextPage,
    isInitialLoading,
    isError,
    fetchNextPage,
  ]);

  if (isInitialLoading) {
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

  if (nonFeaturedProducts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <Search size={48} className="mb-2 opacity-20" />
        <p className="">{`ไม่พบสินค้าที่ตรงกับ ${searchQuery}`}</p>
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
      {isDeleting && <FullscreenLoader />}
      <div className="flex flex-col gap-6 pb-24">
        {/* {featuredProducts.length > 0 && (
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
        )} */}

        <section>
          <h2 className="text-sm font-bold text-gray-500 mt-5 mb-3 font-prompt">
            สินค้าที่มีจำหน่ายในร้านทั้งหมด
          </h2>
          <div className="flex flex-col gap-3">
            {nonFeaturedProducts.map((product) => (
              <ShopProductCard
                key={product.productId}
                product={product}
                onDelete={(id) => handleDelete(id)}
                onEdit={(slug,id) => handleEditRedirect(slug,id)}
                isBeingDeleted={isDeleting && deletingId === product.productId}
              />
            ))}
          </div>
        </section>

        {nonFeaturedProducts.length === 0 && (
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
        <div
          ref={hasNextPage && !isError ? ref : undefined}
          className="py-4 flex justify-center"
        >
          {isError ? (
            <div className="text-center">
              <p className="text-yellow-500 text-sm">
                🚧 การโหลดข้อมูลติดขัด 🚧
              </p>
              <button
                onClick={() => window.location.reload()}
                className="text-green-500 underline text-xs"
              >
                คลิกเพื่อ Refresh อีกครั้ง
              </button>
            </div>
          ) : isFetchingNextPage ? (
            <div className="flex flex-col gap-2 w-full">
              <Skeleton variant="rounded" height={100} />
            </div>
          ) : hasNextPage ? (
            <p className="text-gray-400 text-sm">กำลังโหลดเพิ่มเติม...</p>
          ) : (
            <p className="text-blue-400 text-sm">แสดงสินค้าทั้งหมดแล้ว</p>
          )}
        </div>
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
