"use client";

import { useMemo, useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/layout/CustomerHeader";
import Footer from "@/components/layout/Footer";
import AddressCard from "@/modules/account/components/AddressCard";
import { mockAddresses } from "@/modules/account/mockaddress";
import {
  ChevronLeft,
  CircleCheckBig,
  MapPinCheck,
  NotebookPen,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/modules/cart/hooks/useCartstore";
import { CartItemCard } from "@/modules/cart/components/CartItemCard";
import calculateShipping from "@/utils/calculateShipping";
import { CartSummary } from "@/modules/cart/components/CartSummary";
import ConfirmDialog from "@/components/commonui/ConfirmDialog";

export default function CheckoutPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const { items, selectedIds, getPrimaryImage, refreshCart, setSelectedIds } =
    useCartStore();
  const selectedAddress = mockAddresses[0];

  const selectedItems = useMemo(
    () =>
      items.filter((item) => selectedIds.includes(item.Shopping_Cart_Item_id)),
    [items, selectedIds],
  );
  useEffect(() => {
    if (items.length === 0) {
      refreshCart();
    }

    if (selectedIds.length === 0) {
      const saved = sessionStorage.getItem("selected_checkout_ids");
      if (saved) {
        setSelectedIds(JSON.parse(saved));
      }
    }
  }, [items.length, selectedIds.length, refreshCart, setSelectedIds]);

  const subtotal = selectedItems.reduce(
    (acc, item) => acc + (item.product?.price ?? 0) * item.quantity,
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
    router.push("/shoppingcart/success");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow bg-white">
        <div className="max-w-[1200px] mx-auto p-4 space-y-6">
          <div className="flex items-center">
            <Link href="/shoppingcart">
              <ChevronLeft className="w-10 h-10 md:w-13 md:h-13 text-black" />
            </Link>
            <span>
              <p className="text-md md:text-2xl text-black">บัญชีผู้ใช้</p>
            </span>
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
              รายการสินค้า ({selectedItems.length})
            </div>
            <div className="grid grid-cols-12 w-full gap-4">
              <div className="col-start-1 col-span-12 md:col-start-2 md:col-span-10 space-y-4">
                {selectedItems.length > 0 ? (
                  selectedItems.map((item) => (
                    <CartItemCard
                      key={item.Shopping_Cart_Item_id}
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
            <section className="grid grid-cols-12 w-full mt-10 border-gray-300 border-t-2">
              <div className="col-span-12 flex font-black text-xl mb-3 gap-2 uppercase mt-6">
                <NotebookPen className="text-amber-800" />
                ข้อมูลการชำระเงิน
              </div>
              <div className="col-start-1 col-span-12 md:col-start-2 md:col-span-10 bg-white p-6 rounded-[2rem] border-4 border-black mt-4">
                <h3 className="font-black text-xl uppercase mb-6  flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  สรุปยอดชำระเงิน
                </h3>

                <div className="space-y-4 font-bold text-lg">
                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">
                      ยอดรวมสินค้า ({totalQuantity} รายการ)
                    </span>
                    <span className="text-black font-black">
                      ฿{subtotal.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500 font-medium">ค่าจัดส่ง</span>
                    <span className="text-black font-black">
                      ฿{shippingFee.toLocaleString()}
                    </span>
                  </div>

                  <div className="border-t-4 border-black border-dashed pt-4 flex justify-between items-end">
                    <div>
                      <span className="text-2xl font-black uppercase italic ">
                        ยอดรวมสุทธิ
                      </span>
                      <p className="text-xs text-gray-400 font-bold uppercase italic mt-1">
                        Total Amount
                      </p>
                    </div>
                    <span className="text-4xl font-black italic text-red-600 underline">
                      ฿{totalAmount.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}
          <section>
            <CartSummary
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
