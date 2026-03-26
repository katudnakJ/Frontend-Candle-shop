"use client";

import Header from "@/components/layout/CustomerHeader";
import Footer from "@/components/layout/Footer";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { useCart } from "@/modules/cart/hooks/useCart";
import { useCartStore } from "@/modules/cart/hooks/useCartstore";
import { CartItemCard } from "@/modules/cart/components/CartItemCard";
import { CartSummaryBar } from "@/modules/cart/components/CartSummaryBar";
import { ShoppingCartSkeletonpage } from "@/modules/cart/components/skeletoncart/ShoppingCartSkeletonpage";
import { PreviousButton } from "@/components/commonui/PreviousButton";

import EmptyCartState from "@/modules/cart/components/EmptyCartState";

export default function ShoppingCartPage() {



  const [isMounted, setIsMounted] = useState(false);
  const { ref, inView } = useInView({
    threshold: 0.1,
  });
  const { getPrimaryImage } = useCartStore();
  const {
    cartItem,
    totalItems,
    hasNext,
    fetchNextPage,
    isFetchingNextPage,
    endAt,
    isLoading,
    isPlaceholderData,
    selectedIds,
    totalPrice,
    totalQuantity,
    isAllSelected,
    toggleSelect,
    updateQuantity,
    removeItem,
    toggleSelectAll,
  } = useCart();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 800);
    sessionStorage.setItem(
      "selected_checkout_ids",
      JSON.stringify(selectedIds),
    );
    return () => clearTimeout(timer);
  }, [selectedIds]);

  useEffect(() => {
    if (inView && hasNext && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNext, isFetchingNextPage, fetchNextPage]);


  // const totalPages = Math.ceil(totalItems / pageSize);

  // const handlePageChange = (newPage: number) => {
  //   const displayPage = newPage + 1;
  //   router.push(`?page=${displayPage}`, { scroll: true });
  // };

  // useEffect(() => {
  //   if (
  //     !isLoading &&
  //     cartItem.length === 0 &&
  //     totalItems > 0 &&
  //     currentPage > 0
  //   ) {
  //     handlePageChange(currentPage - 1);
  //   }
  // }, [cartItem.length, totalItems, currentPage, isLoading]);

  if (!isMounted) {
    return (
      <>
        <Header />
        <ShoppingCartSkeletonpage />
        <Footer />
      </>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <Header />

      <main className="flex-grow bg-white">
        <div
          className={`max-w-[1200px] mx-auto p-4 transition-opacity duration-200 ${
            isPlaceholderData ? "opacity-50 pointer-events-none" : "opacity-100"
          }`}
        >
          <PreviousButton itemCount={totalItems} isShopingcart={true} />

          {cartItem.length > 0 && (
            <div className="mb-4 flex items-center gap-2 px-2">
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={toggleSelectAll}
                className="w-5 h-5 accent-green-600 cursor-pointer"
              />
              <span className="font-bold text-sm">เลือกทั้งหมด</span>
            </div>
          )}

          <div className="space-y-4">
            {cartItem.length === 0 ? (
              <EmptyCartState />
            ) : (
              <>
                {cartItem.map((item) => (
                  <CartItemCard
                    key={item.shoppingCartItemId}
                    item={item}
                    isSelected={selectedIds.includes(item.shoppingCartItemId)}
                    image={getPrimaryImage(item)}
                    onToggle={toggleSelect}
                    onUpdateQty={updateQuantity}
                    onRemove={removeItem}
                  />
                ))}
                <div ref={ref} className="h-20 flex justify-center items-center">
                  {isFetchingNextPage ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-6 h-6 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm text-gray-500">กำลังโหลดรายการเพิ่มเติม...</p>
                    </div>
                  ) : hasNext ? (
                    <p className="text-sm text-gray-400 italic">เลื่อนลงเพื่อโหลดเพิ่ม</p>
                  ) : cartItem.length > 0 ? (
                    <p className="text-sm text-gray-400">สิ้นสุดรายการสินค้าทั้งหมด {totalItems} รายการ</p>
                  ) : null}
                </div>
              </>
              )}
          </div>
          {/* {totalItems > pageSize && (
            <CartPagination
              pageParam={pageParam}
              totalPages={totalPages}
              startAt={startAt}
              endAt={endAt}
              totalProducts={totalItems}
              onPageChange={handlePageChange}
              hasNext={hasNext}
            />
          )} */}
        </div>
        {isPlaceholderData && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-full text-sm z-50">
            กำลังอัปเดตข้อมูลหน้าใหม่...
          </div>
        )}
      </main>
      {cartItem.length > 0 && (
        <div className="sticky bottom-0 z-10">
          <CartSummaryBar
            totalQuantity={totalQuantity}
            totalPrice={totalPrice}
          />
        </div>
      )}

      <Footer />
    </div>
  );
}
