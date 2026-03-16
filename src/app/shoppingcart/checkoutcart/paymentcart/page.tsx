"use client";

import { useMemo, useEffect, useState } from "react";
import Header from "@/components/layout/CustomerHeader";
import Footer from "@/components/layout/Footer";
import { CircleCheckBig } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/modules/cart/hooks/useCartstore";
import calculateShipping from "@/utils/calculateShipping";
import { CartHeader } from "@/modules/cart/components/CartHeader";
import ConfirmDialog from "@/components/commonui/ConfirmDialog";
import { QRpaymentSkeletonpage } from "@/modules/cart/components/skeletoncart/QRpaymentSkeletonpage";
import { CartOrderSummaryCard } from "@/modules/cart/components/CartOrderSummaryCard";
import { Seller } from "@/modules/seller/types";
import { PaymentMethodCard } from "@/modules/seller/components/PaymentMethodCard";
import { Order, OrderItem } from "@/modules/orders/type";
import { ShoppingCartItem } from "@/modules/cart/types";

import { mockSellerData } from "@/modules/seller/mockSellerData";
import { mockOrders } from "@/modules/orders/mockOrderData";
import { toast } from "react-hot-toast";

interface PaymentData {
  displayItems: (OrderItem | ShoppingCartItem)[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  totalQuantity: number;
}

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const mode = searchParams.get("mode");

  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const { items, selectedIds, refreshCart, setSelectedIds } = useCartStore();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [isLoadingSeller, setIsLoadingSeller] = useState(true);
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [showPaymentError, setShowPaymentError] = useState(false);
  const [repayOrder, setRepayOrder] = useState<Order | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 800);
    if (items.length === 0) refreshCart();

    if (selectedIds.length === 0 && !orderId) {
      const saved = sessionStorage.getItem("selected_checkout_ids");
      if (saved) setSelectedIds(JSON.parse(saved));
    }
    return () => clearTimeout(timer);
  }, [items.length, selectedIds.length, refreshCart, setSelectedIds, orderId]);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        setIsLoadingSeller(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setSeller(mockSellerData[0]);
      } catch (error) {
        console.error("Failed to fetch seller:", error);
      } finally {
        setIsLoadingSeller(false);
      }
    };
    fetchSellerData();
  }, []);

  // อีกหน่อยปรับเป็นเรียกจาก api ไม่ก็เก็บใน zustand และ ต้องเพิ่มกัน เช็คว่า orderID ใช่ของลูกค้าคนนี้ไหม 
  useEffect(() => {
    if (mode === "repay" && orderId) {
      console.log("Fetching order:", orderId);
      setIsLoadingSeller(true);

      const foundOrder = mockOrders.find((o) => o.order_no === orderId);
      if (foundOrder) {
        console.log("พบข้อมูล Order สำหรับชำระใหม่:", foundOrder);
        setRepayOrder(foundOrder);
      } else {
        console.error("ไม่พบข้อมูล Order หมายเลข:", orderId);
    
      }

      setIsLoadingSeller(false);
    }
  }, [mode, orderId]);

  const paymentData = useMemo<PaymentData>(() => {
    if (mode === "repay" && repayOrder) {
      return {
        displayItems: repayOrder.items || [],
        subtotal: repayOrder.total_amount,
        shippingFee: repayOrder.shipping_fee || 0,
        totalAmount: repayOrder.net_amount,
        totalQuantity: (repayOrder.items || []).reduce(
          (acc, item) => acc + item.quantity,
          0,
        ),
      };
    }

    // โหมดปกติจากตะกร้า
    const selected = items.filter((item) =>
      selectedIds.includes(item.Shopping_Cart_Item_id),
    );
    const sub = selected.reduce(
      (acc, item) => acc + (item.product?.price ?? 0) * item.quantity,
      0,
    );
    const qty = selected.reduce((acc, item) => acc + item.quantity, 0);
    const ship = calculateShipping(qty);

    return {
      displayItems: selected,
      subtotal: sub,
      shippingFee: ship,
      totalAmount: sub + ship,
      totalQuantity: qty,
    };
  }, [items, selectedIds, mode, repayOrder]);

  const handleConfirm = () => {
    setIsOpen(false);
    router.replace("/account/orderhistory");
   toast.success(
        <div className="flex flex-col justify-center py-1">
          <span className="leading-tight">ยืนยันการชำระเงินเรียบร้อย</span>
        </div>,
        {
          className:
            " bg-white border-2 border-cprojectone rounded-xl font-bold shadow-2xl text-black mx-auto sm:ml-auto sm:mr-6 h-20",
          duration: 3000,
        },
      );
  };

  const handleConfirmOrder = () => {
    if (!slipFile) {
      setShowPaymentError(true);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      return;
    }
    setIsOpen(true);
  };

  if (!isMounted) {
    return (
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <QRpaymentSkeletonpage />
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-grow bg-white">
        <div className="max-w-[1200px] mx-auto p-4 space-y-6">
          <div>
            {mode === "repay" ? (
              <div className="mb-4">
                <CartHeader
                itemCount={paymentData.displayItems.length}
                isRepay={true}
              />
                <h1 className="text-2xl font-black">
                  ชำระเงินใหม่ Order #{orderId}
                </h1>
                <p className="text-gray-500 font-bold">
                  รายการสินค้าจากคำสั่งซื้อเดิม
                </p>
              </div>
            ) : (
              <CartHeader
                itemCount={paymentData.displayItems.length}
                isCheckout={true}
              />
            )}
          </div>

          {paymentData.displayItems.length > 0 && (
            <section>
              <CartOrderSummaryCard
                totalQuantity={paymentData.totalQuantity}
                subtotal={paymentData.subtotal}
                shippingFee={paymentData.shippingFee}
                totalAmount={paymentData.totalAmount}
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
              totalAmount={paymentData.totalAmount}
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
                    การชำระเงินต้องรอการยืนยันภายใน 24 ชม.
                  </span>
                </div>
              )}
              <button
                onClick={handleConfirmOrder}
                className={`w-full py-5 text-2xl font-black rounded-full transition-all mt-6 ${
                  !slipFile
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white shadow-[8px_8px_0px_0px_rgba(220,38,38,1)]"
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
        content={
          mode === "repay"
            ? "ยืนยันการส่งสลิปใหม่สำหรับคำสั่งซื้อนี้?"
            : "คุณต้องการสั่งซื้อสินค้าทั้งหมดใช่หรือไม่?"
        }
      />
    </div>
  );
}
