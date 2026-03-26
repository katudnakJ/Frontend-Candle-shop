"use client";

import { useMemo, useEffect, useState } from "react";
import Header from "@/components/layout/CustomerHeader";
import Footer from "@/components/layout/Footer";
import { CircleCheckBig } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetCartData } from "@/modules/cart/hooks/useGetCartData";
import calculateShipping from "@/utils/calculateShipping";
import { PreviousButton } from "@/components/commonui/PreviousButton";
import ConfirmDialog from "@/components/commonui/ConfirmDialog";
import { QRpaymentSkeletonpage } from "@/modules/cart/components/skeletoncart/QRpaymentSkeletonpage";
import { CartOrderSummaryCard } from "@/modules/cart/components/CartOrderSummaryCard";
import { Seller } from "@/modules/seller/types";
import { PaymentMethodCard } from "@/modules/seller/components/PaymentMethodCard";
import { Order, OrderItem } from "@/modules/orders/type";

import { mockSellerData } from "@/modules/seller/mockSellerData";
import { mockOrders } from "@/modules/orders/mockOrderData";
import { toast } from "react-hot-toast";
import { GenericResponse, Status } from "@/types/response.type";
import {
  ShoppingCartData,
  CartItem,
} from "@/modules/cart/shoppingcartInterface";
import { useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "@/modules/cart/hooks/useCartstore";
import { useGetAddressDetail } from "@/modules/account/hooks/useAddressesQuery";
import { useGetQRPaymentImageForCus } from "@/modules/seller/services/payment.service";
import { useCheckoutMutation } from "@/modules/cart/hooks/useCheckoutMutation";
import { CheckoutRequest } from "@/modules/cart/checkoutInterface";

interface DisplayPaymentItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface PaymentData {
  displayItems: DisplayPaymentItem[];
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
  totalQuantity: number;
}

export default function PaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  const {
    selectedIds,
    checkoutItems,
    selectedAddress,
    getPrimaryImage,
    setSelectedIds,
    setCheckoutItems,
    setSelectedAddress,
  } = useCartStore();

  const { mutate: checkoutMutate, isPending: isCheckingOut } =
    useCheckoutMutation();

  const orderId = searchParams.get("orderId");
  const mode = searchParams.get("mode");
  const selectAddressId = searchParams.get("addressid");

  const { data: addressesData, isLoading: isLoadingAddr } = useGetAddressDetail(
    selectAddressId || "",
    {
      enabled:
        !!selectAddressId &&
        (!selectedAddress || selectedAddress.addressId !== selectAddressId),
    },
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isSuccessCheckout, setSuccessCheckout] = useState(false);
  const page = Number(searchParams.get("page")) || 0;
  const size = Number(searchParams.get("size")) || 100;
  const [seller, setSeller] = useState<Seller | null>(null);
  const [isLoadingSeller, setIsLoadingSeller] = useState(true);
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [showPaymentError, setShowPaymentError] = useState(false);
  const [repayOrder, setRepayOrder] = useState<Order | null>(null);
  
  const cachedData = queryClient.getQueryData<
    GenericResponse<ShoppingCartData>
  >(["shopping-cart", page, size]);

  const { data, isLoading } = useGetCartData(page, size) as {
    data: GenericResponse<ShoppingCartData> | undefined;
    isLoading: boolean;
  };
  if (process.env.NODE_ENV === "development") {
    console.log("CheckoutPRODUCT:", data);
  }

  const detailItemsData = data || cachedData;
  const CheckoutData = data?.data || detailItemsData;
  const cartItem = useMemo(() => {
    return (CheckoutData as ShoppingCartData)?.cartItems || [];
  }, [CheckoutData]);

  const { data: existingQRCode, isLoading: isLoadingQR } =
    useGetQRPaymentImageForCus();
  if (process.env.NODE_ENV === "development") {
    console.log("ExistingQRCode:", existingQRCode);
  }

  useEffect(() => {
    if (!selectedAddress && addressesData) {
      setSelectedAddress(addressesData);
    }
  }, [selectedAddress, addressesData, setSelectedAddress]);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 800);

    if (selectedIds.length === 0 && !orderId) {
      const saved = sessionStorage.getItem("selected_checkout_ids");
      if (saved) setSelectedIds(JSON.parse(saved));
    }
    return () => clearTimeout(timer);
  }, [selectedIds.length, setSelectedIds, orderId]);

  const selectedItems = useMemo(
    () =>
      cartItem.filter((item) => selectedIds.includes(item.shoppingCartItemId)),
    [cartItem, selectedIds],
  );

  useEffect(() => {
    if (
      
      isMounted &&
      !isLoading &&
      !isCheckingOut &&
      !isSuccessCheckout&&
      mode !== "repay" &&
      checkoutItems.length === 0 &&
      selectedItems.length === 0
    ) {
      const saved = sessionStorage.getItem("selected_checkout_ids");
      if (!saved || JSON.parse(saved).length === 0) {
        router.push("/shoppingcart");
      }
    }
  }, [
    isMounted,
    isLoading,
    isCheckingOut,
    isSuccessCheckout,
    checkoutItems.length,
    selectedItems.length,
    mode,
    router,
  ]);

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
  // อย่าลืมเปลี่ยน seller เพราะ อันนี้ใช้  mock
  useEffect(() => {
    if (mode === "repay" && orderId) {
      setIsLoadingSeller(true);

      const foundOrder = mockOrders.find((o) => o.order_no === orderId);
      if (foundOrder) {
        setRepayOrder(foundOrder);
      } else {
      }

      setIsLoadingSeller(false);
    }
  }, [mode, orderId]);

  const paymentData = useMemo<PaymentData>(() => {
    // กรณี Repay (จาก Order History)
    if (mode === "repay" && repayOrder) {
      const items = (repayOrder.items || []).map((item: OrderItem) => ({
        id: item.product_id,
        name: item.product_name_at_purchase,
        price: item.price_at_purchase,
        quantity: item.quantity,
        image: item.product_img_path,
      }));

      return {
        displayItems: items,
        subtotal: repayOrder.total_amount,
        shippingFee: repayOrder.shipping_fee || 0,
        totalAmount: repayOrder.net_amount,
        totalQuantity: items.reduce((acc, item) => acc + item.quantity, 0),
      };
    }

    // กรณี Checkout ปกติ (จาก Cart)
    const sourceItems =
      checkoutItems.length > 0 ? checkoutItems : selectedItems;

    const items = sourceItems.map((item: CartItem) => ({
      id: item.shoppingCartItemId,
      name: item.productName || "สินค้า",
      price: item.price ?? 0,
      quantity: item.quantity,
      image: getPrimaryImage(item),
    }));

    const sub = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    const qty = items.reduce((acc, item) => acc + item.quantity, 0);
    const ship = calculateShipping(qty);

    return {
      displayItems: items,
      subtotal: sub,
      shippingFee: ship,
      totalAmount: sub + ship,
      totalQuantity: qty,
    };
  }, [checkoutItems, selectedItems, mode, repayOrder, getPrimaryImage]);

  const handleConfirm = () => {
    setIsOpen(false);

    const addressId = selectedAddress?.addressId || selectAddressId;

    if (!addressId || !slipFile) {
      toast.error("ข้อมูลที่อยู่หรือสลิปไม่ครบถ้วน");
      return;
    }

    if (process.env.NODE_ENV === "development") {
      console.log("Submitting with Address:", selectedAddress?.addressId);
      console.log(
        "Submitting Items:",
        checkoutItems.length > 0 ? checkoutItems : selectedItems,
      );
      
    }

    const idsToSubmit =
      checkoutItems.length > 0
        ? checkoutItems.map((item) => item.shoppingCartItemId)
        : selectedIds;

    const payload: CheckoutRequest = {
      shoppingCartItemIds: idsToSubmit,
      addressId: addressId,
      imageData: slipFile,
    };

    if (mode === "repay") {
      // เรียก API: updatePaymentSlip(orderId, slipFile)
      toast.error("ระบบ Repay กำลังพัฒนา");
      return;
    }
    checkoutMutate(payload, {
      onSuccess: () => {
        setSuccessCheckout(true);
        toast.success("ยืนยันการชำระเงินเรียบร้อย");

        setTimeout(() => {
          setSelectedIds([]);
          setCheckoutItems([]);
          setSelectedAddress(null);
          sessionStorage.removeItem("selected_checkout_ids");
        }, 300);

        router.replace("/account/orderhistory");
      },
      onError: (error) => {
        if (process.env.NODE_ENV === "development") {
          console.error("Mutation Error at PaymentPage:", error);
        }
        
      },
    });
  };

  const handleConfirmOrder = () => {
    if (!slipFile) {
      setShowPaymentError(true);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      return;
    }
    setIsOpen(true);
  };

  const isDataReady =
    mode === "repay"
      ? !!repayOrder
      : checkoutItems.length > 0 || selectedItems.length > 0;
  const isAddressReady = !!selectedAddress;
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("=== Zustand Store Monitor ===");
      console.log("Selected IDs:", selectedIds);
      console.log("Checkout Items:", checkoutItems);
      console.log("Selected Address:", selectedAddress);
      console.log("============================");
    }
  }, [selectedIds, checkoutItems, selectedAddress]);

  if (
    !isMounted ||
    isLoading ||
    isLoadingQR || // <--- เพิ่มตรงนี้
    isLoadingSeller ||
    (selectAddressId && isLoadingAddr && !isAddressReady) ||
    !isDataReady
  ) {
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
                <PreviousButton
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
              <PreviousButton
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
              ShopQrPayment={existingQRCode ?? null}
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
                disabled={!slipFile || isCheckingOut || isLoadingAddr}
                className={`w-full py-5 text-2xl font-black rounded-full transition-all mt-6 ${
                  !slipFile || isCheckingOut || isLoadingAddr
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white shadow-[8px_8px_0px_0px_rgba(220,38,38,1)]"
                }`}
              >
                {isLoadingAddr
                  ? "กำลังโหลดข้อมูลที่อยู่..."
                  : isCheckingOut
                    ? "กำลังดำเนินการ..."
                    : slipFile
                      ? "ยืนยันการชำระเงิน"
                      : "กรุณาแนบสลิปก่อนยืนยัน"}
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
