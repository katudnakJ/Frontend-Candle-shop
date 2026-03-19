"use client";

import Header from "@/components/layout/CustomerHeader";
import Footer from "@/components/layout/Footer";

import { useCart } from "@/modules/cart/hooks/useCart";
import { MOCK_CART_DATA } from "@/modules/cart/mockcart";
import { CartHeader } from "@/modules/cart/components/CartHeader";
import { CartItemCard } from "@/modules/cart/components/CartItemCard";
import { CartSummaryBar } from "@/modules/cart/components/CartSummaryBar";
import EmptyCartState from "@/modules/cart/components/EmptyCartState";
import { useEffect,useState } from "react";
import { useCartStore } from "@/modules/cart/hooks/useCartstore";
import { ShoppingCartSkeletonpage } from "@/modules/cart/components/skeletoncart/ShoppingCartSkeletonpage";

export default function ShoppingCartPage() {
  const [isMounted, setIsMounted] = useState(false);
  const { getPrimaryImage } = useCartStore();
  const {
    cartItem,
    selectedIds,
    toggleSelect,
    updateQuantity,
    removeItem,
    totalPrice,
    totalQuantity,
    isAllSelected,
    toggleSelectAll,
  } = useCart();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 800);
    sessionStorage.setItem("selected_checkout_ids", JSON.stringify(selectedIds));
    return () => clearTimeout(timer);
  }, [selectedIds]);


  if (!isMounted) {
    return (
      <>
        <Header />
        <ShoppingCartSkeletonpage  />
        <Footer />
      </>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white">
      <Header />

      <main className="flex-grow bg-white">
        <div className="max-w-[1200px] mx-auto p-4">
          <CartHeader itemCount={cartItem.length} isShopingcart={true}/>

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
              cartItem.map((item) => (
                <CartItemCard
                  key={item.shoppingCartItemId}
                  item={item}
                  isSelected={selectedIds.includes(item.shoppingCartItemId)}
                  image={getPrimaryImage(item)}
                  onToggle={toggleSelect}
                  onUpdateQty={updateQuantity}
                  onRemove={removeItem}
                />
              ))
            )}
          </div>
        </div>
      </main>
      {cartItem .length > 0 && (
        <div className="sticky bottom-0 z-10">
          <CartSummaryBar totalQuantity={totalQuantity} totalPrice={totalPrice} />
        </div>
      )}

      <Footer />
    </div>
  );
}
