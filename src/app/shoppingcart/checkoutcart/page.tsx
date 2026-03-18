"use client";

import { useMemo, useEffect, useState } from "react";
import Header from "@/components/layout/CustomerHeader";
import Footer from "@/components/layout/Footer";
import AddressCard from "@/modules/account/components/AddressCard";
import { mockAddresses } from "@/modules/account/mockaddress";
import {
  CircleCheckBig,
  MapPinCheck,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/modules/cart/hooks/useCartstore";
import { CartItemCard } from "@/modules/cart/components/CartItemCard";
import calculateShipping from "@/utils/calculateShipping";
import { CartSummaryBar } from "@/modules/cart/components/CartSummaryBar";
import { CartHeader } from "@/modules/cart/components/CartHeader";
import ConfirmDialog from "@/components/commonui/ConfirmDialog";
import { CartCheckoutSkeletonpage } from "@/modules/cart/components/skeletoncart/CartCheckoutSkeletonpage";
import { CartOrderSummaryCard } from "@/modules/cart/components/CartOrderSummaryCard";

export default function CheckoutPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { items, selectedIds, getPrimaryImage, refreshCart, setSelectedIds } =
    useCartStore();
  const selectedAddress = mockAddresses[0];

  const selectedItems = useMemo(
    () =>
      items.filter((item) => selectedIds.includes(item.shoppingCartItemId)),
    [items, selectedIds],
  );
  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 800);

    if (items.length === 0) {
      refreshCart();
    }

    if (selectedIds.length === 0) {
      const saved = sessionStorage.getItem("selected_checkout_ids");
      if (saved) {
        setSelectedIds(JSON.parse(saved));
      }
    }
    return () => clearTimeout(timer);
  }, [items.length, selectedIds.length, refreshCart, setSelectedIds]);

  const subtotal = selectedItems.reduce(
    (acc, item) => acc + (item.price ?? 0) * item.quantity,
    0,
  );
  const totalQuantity = selectedItems.reduce(
    (acc, item) => acc + item.quantity,
    0,
  );
  const shippingFee = calculateShipping(totalQuantity);
  const totalAmount = subtotal + shippingFee;

  const handleConfirm = () => {
    setIsOpen(false);
    router.replace("/shoppingcart/checkoutcart/paymentcart");
  };

  if (!isMounted) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <CartCheckoutSkeletonpage />
        <Footer />
      </div>
    );
  }
console.log("All Items in Store:", items);
console.log("Selected IDs from Session:", selectedIds);
console.log("Filtered Selected Items:", selectedItems);
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow bg-white">
        <div className="max-w-[1200px] mx-auto p-4 space-y-6">
          <div>
            <CartHeader itemCount={items.length} isCheckout={true} />
          </div>
          <section className="border-gray-300 border-b-2">
            <div className="flex font-black text-xl mb-3 gap-2 uppercase ">
              <MapPinCheck className="text-green-600" />
              จัดส่งไปที่
            </div>
            <div className="grid grid-cols-12 w-full mb-5 ">
              <button
                onClick={() => router.push("/account/customer")}
                className="col-start-1 col-span-11 md:col-start-2 md:col-span-10 text-left transition-all active:scale-[0.97] shadow-amber-100  hover:shadow-lg hover:translate-y-1 "
              >
                <AddressCard address={selectedAddress} showActions={false} />
              </button>
            </div>
            <p className="text-xs md:text-md text-red-500 flex justify-end mr-2">
              **ระยะเวลาการผลิตประมาณ 5-7 วัน
            </p>
          </section>

          <section className="space-y-4 ">
            <div className="flex font-black text-xl mb-3 gap-2 uppercase">
              <CircleCheckBig className="text-yellow-500" />
              รายการสินค้า ({totalQuantity})
            </div>
            <div className="grid grid-cols-12 w-full gap-4">
              <div className="col-start-1 col-span-12 md:col-start-2 md:col-span-10 space-y-4">
                {selectedItems.length > 0 ? (
                  selectedItems.map((item) => (
                    <CartItemCard
                      key={item.shoppingCartItemId}
                      item={item}
                      image={getPrimaryImage(item)}
                      isCheckout={true}
                      isSelected={true}
                      onToggle={() => {}}
                      onUpdateQty={() => {}}
                      onRemove={() => {}}
                    />
                  ))
                ) : (
                  <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-3xl">
                    <p className="font-bold text-gray-400">
                      ไม่พบรายการสินค้าที่เลือก
                    </p>
                  </div>
                )}
              </div>
            </div>
          </section>
          {selectedItems.length > 0 && (
            <section>
              <CartOrderSummaryCard
                totalQuantity={totalQuantity}
                subtotal={subtotal}
                shippingFee={shippingFee}
                totalAmount={totalAmount}
              />
            </section>
          )}
          <section>
            <CartSummaryBar
              totalQuantity={totalQuantity}
              totalPrice={subtotal}
              isCheckout={true}
              onOrderClick={() => setIsOpen(true)}
            />
          </section>
        </div>
      </main>
      <Footer />
      <ConfirmDialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        title="ยืนยันยอดคำสั่งซื้อสินค้า"
        content="คุณต้องการสั่งซื้อสินค้าทั้งหมดในรายการใช่หรือไม่?"
      />
    </div>
  );
}
