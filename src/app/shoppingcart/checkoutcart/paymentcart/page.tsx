"use client";

import { useMemo, useEffect, useState } from "react";
import Header from "@/components/layout/CustomerHeader";
import Footer from "@/components/layout/Footer";
import { mockAddresses } from "@/modules/account/mockaddress";
import { mockSellerData } from "@/modules/seller/mockSellerData";
import {
  ChevronLeft,
  CircleCheckBig,
  MapPinCheck,
  NotebookPen,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/modules/cart/hooks/useCartstore";
import calculateShipping from "@/utils/calculateShipping";
import { CartSummaryBar } from "@/modules/cart/components/CartSummaryBar";
import { CartHeader } from "@/modules/cart/components/CartHeader";
import ConfirmDialog from "@/components/commonui/ConfirmDialog";
import { CartCheckoutSkeletonpage } from "@/modules/cart/components/skeletoncart/CartCheckoutSkeletonpage";
import { CartOrderSummaryCard } from "@/modules/cart/components/CartOrderSummaryCard";
import { Seller } from "@/modules/seller/types";
import { PaymentMethodCard } from "@/modules/seller/components/PaymentMethodCard";

export default function PaymentPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { items, selectedIds, refreshCart, setSelectedIds } = useCartStore();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [isLoadingSeller, setIsLoadingSeller] = useState(true);
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [showPaymentError, setShowPaymentError] = useState(false);

  const selectedItems = useMemo(
    () =>
      items.filter((item) => selectedIds.includes(item.Shopping_Cart_Item_id)),
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

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        setIsLoadingSeller(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        // ดึงข้อมูลจาก Mock (ในอนาคตเปลี่ยนตรงนี้เป็น fetch('/api/seller'))
        const data = mockSellerData[0];
        setSeller(data);
      } catch (error) {
        console.error("Failed to fetch seller:", error);
      } finally {
        setIsLoadingSeller(false);
      }
    };
    fetchSellerData();
  }, []);

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

  const handleConfirmOrder = () => {
    if (!slipFile) {
      setShowPaymentError(true);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

      return;
    }

    // ถ้ามีไฟล์แล้ว ทำงานต่อได้...
    console.log("กำลังอัปโหลดและสร้าง Order...");
    setIsOpen(true);
  };

  //   if (!isMounted) {
  //     return (
  //       <div className="flex flex-col min-h-screen bg-white">
  //         <Header />
  //         <CartCheckoutSkeletonpage />
  //         <Footer />
  //       </div>
  //     );
  //   }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow bg-white">
        <div className="max-w-[1200px] mx-auto p-4 space-y-6">
          <div>
            <CartHeader itemCount={items.length} isCheckout={true} />
          </div>
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

          {isLoadingSeller ? (
            <div className="w-full h-64 bg-gray-50 animate-pulse rounded-[2rem] border-4 border-gray-200 flex items-center justify-center">
              <p className="font-bold text-gray-400 italic">
                กำลังโหลดข้อมูลผู้ขาย...
              </p>
            </div>
          ) : (
            <PaymentMethodCard
              seller={seller}
              totalAmount={totalAmount}
              onFileSelect={(file) => {
                setSlipFile(file);
                if (file) setShowPaymentError(false);
              }}
              showError={showPaymentError}
            />
          )}

          {!isLoadingSeller && (
            <div className="mt-10 pb-20 flex flex-col items-center">
              {slipFile && (
                <div className="mb-4 flex items-center gap-2 text-amber-600 animate-in fade-in slide-in-from-bottom-2">
                  <CircleCheckBig size={18} />
                  <span className="font-bold text-sm">
                    การชำระเงินต้องรอการยืนยันจากทางร้านค้าภายใน 24 ชม.
                  </span>
                </div>
              )}
              <button
                onClick={handleConfirmOrder}
                disabled={showPaymentError && !slipFile}
                className={`w-full py-5 text-2xl font-black rounded-full transition-all mt-6
        ${
          !slipFile
            ? "bg-gray-300 text-gray-500 cursor-not-allowed shadow-none"
            : "bg-black text-white hover:bg-zinc-800 shadow-[8px_8px_0px_0px_rgba(220,38,38,1)]"
        }`}
              >
                {slipFile ? "ยืนยันการชำระเงิน" : "กรุณาแนบสลิปก่อนยืนยัน"}
              </button>
              {!slipFile && showPaymentError && (
                <p className="text-red-500 font-bold mt-2 text-sm">
                  ** คุณยังไม่ได้เลือกรูปภาพสลิป
                </p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
      <ConfirmDialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        title="ยืนยันการชำระเงิน"
        content="คุณต้องการสั่งซื้อสินค้าทั้งหมดในรายการใช่หรือไม่?"
      />
    </div>
  );
}
