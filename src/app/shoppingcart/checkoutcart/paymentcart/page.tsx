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
import { PaymentMethodCard } from "@/modules/seller/components/PaymentMethodCard";

import { toast } from "react-hot-toast";
import { CartItem } from "@/modules/cart/shoppingcartInterface";
import { useCartStore } from "@/modules/cart/hooks/useCartstore";
import { useGetAddressDetail } from "@/modules/account/hooks/useAddressesQuery";
import { useGetQRPaymentImageForCus } from "@/modules/seller/services/payment.service";
import { useCheckoutMutation } from "@/modules/cart/hooks/useCheckoutMutation";
import { CheckoutRequest } from "@/modules/cart/checkoutInterface";
import { useGetOrderDetail } from "@/modules/orders/hooks/useGetOrderDetail";
import { useRepayUpdatePaymentSlip } from "@/modules/orders/hooks/useRepayUpdatePaymentSlip";

interface DisplayPaymentItem {
  id: string | number;
  name: string;
  price: number;
  quantity: number;
  image?: string | null;
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
  const size = 100;

  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [showPaymentError, setShowPaymentError] = useState(false);
  //const [repayOrder, setRepayOrder] = useState<Order | null>(null);

  const {
    data: orderDetailResponse,
    isLoading: isLoadingOrderDetail,
    isError: isOrderDetailError,
  } = useGetOrderDetail(orderId || "", {
    enabled: mode === "repay" && !!orderId,
  });
  const rawData =
    orderDetailResponse && "data" in orderDetailResponse
      ? orderDetailResponse.data
      : orderDetailResponse;
  const orderDetail = rawData?.orderDetail;
  const orderItems = useMemo(() => rawData?.orderItems ?? [], [rawData?.orderItems]);
  
  const { mutate: repayMutate, isPending: isRepaying } =
    useRepayUpdatePaymentSlip();

  const { data, isLoading } = useGetCartData(size);

  const cartItem = useMemo(() => {
    const pages = data?.pages || [];
    return pages.flatMap((p) => {
      const actualData = p?.data || p;
      return actualData?.cartItems || [];
    });
  }, [data]);

  const { data: existingQRCode, isLoading: isLoadingQR } =
    useGetQRPaymentImageForCus();

  useEffect(() => {
    if (!selectedAddress && addressesData) {
      setSelectedAddress(addressesData);
    }
  }, [selectedAddress, addressesData, setSelectedAddress]);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 800);

    if (selectedIds.length === 0 && !orderId) {
      const saved = sessionStorage.getItem("selected_checkout_ids");
      if (saved) {
        const parsedIds = JSON.parse(saved);
        if (parsedIds.length > 0) {
          setSelectedIds(parsedIds);
        }
      }
    }
    return () => clearTimeout(timer);
  }, [selectedIds.length, setSelectedIds, orderId]);

  const selectedItems = useMemo(() => {
    if (checkoutItems.length > 0) return checkoutItems;

    if (cartItem.length > 0) {
      return cartItem.filter((item) =>
        selectedIds.includes(item.shoppingCartItemId),
      );
    }

    return [];
  }, [cartItem, selectedIds, checkoutItems]);

  //=============================================================================================================================
  // ดีดกลับถ้าไม่ตรงเงื่อนไข

  useEffect(() => {
   if (mode === "repay" && (isOrderDetailError || (isMounted && !isLoadingOrderDetail && (!orderDetail || !orderItems)))) {
      toast.error("ไม่พบข้อมูลคำสั่งซื้อเดิม กรุณาลองใหม่");
      router.replace("/account/orderhistory");
    }
  }, [mode, isOrderDetailError, orderDetail, orderItems, isLoadingOrderDetail, isMounted, router]);

  useEffect(() => {
    if (isMounted && !isLoading && mode !== "repay") {
      const saved = sessionStorage.getItem("selected_checkout_ids");
      const parsedIds = saved ? JSON.parse(saved) : [];
      if (
        parsedIds.length === 0 &&
        selectedItems.length === 0 &&
        checkoutItems.length === 0
      ) {
        toast.error("ไม่มีสินค้าในรายการ");
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
  //=============================================================================================================================

  const paymentData = useMemo<PaymentData>(() => {
    if (mode === "repay" && orderDetail && orderItems) {
      const items = orderItems.map((item) => ({
        id: item.orderItemId,
        name: item.productName,
        price: item.pricePerUnit,
        quantity: item.quantity,
        image: item.productImagePath,
      }));

      return {
        displayItems: items,
        subtotal: orderDetail.totalAmount,
        shippingFee: orderDetail.netAmount - orderDetail.totalAmount || 0,
        totalAmount: orderDetail.netAmount,
        totalQuantity: orderDetail.totalQuantity,
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
  }, [
    mode,
    orderDetail,
    orderItems,
    checkoutItems,
    selectedItems,
    getPrimaryImage,
  ]);

  const handleConfirm = () => {
    setIsOpen(false);

    if (!slipFile) {
      toast.error("กรุณาแนบสลิปชำระเงิน");
      return;
    }

    if (mode === "repay") {
      if (!orderId) {
        toast.error("ข้อมูล Order ไม่ครบถ้วน");
        return;
      }
      repayMutate(
        { orderId, imageData: slipFile },
        {
          onSuccess: () => {
            handleSuccessNavigation();
          },
        },
      );
      return;
    } else {
      const addressId = selectedAddress?.addressId || selectAddressId;

      if (!addressId) {
        toast.error("ข้อมูลที่อยู่หรือสลิปไม่ครบถ้วน");
        return;
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

      checkoutMutate(payload, {
        onSuccess: () => {
          handleSuccessNavigation();
        },
        onError: (error) => {
          if (process.env.NODE_ENV === "development") {
            console.error("Mutation Error at PaymentPage:", error);
          }
        },
      });
    }
  };

  const handleSuccessNavigation = () => {
    setSuccessCheckout(true);
    toast.success("ยืนยันการชำระเงินเรียบร้อย");

    setTimeout(() => {
      setSelectedIds([]);
      setCheckoutItems([]);
      setSelectedAddress(null);
      sessionStorage.removeItem("selected_checkout_ids");
    }, 300);

    router.replace("/account/orderhistory");
  };

  const handleConfirmOrder = () => {
    if (!slipFile) {
      setShowPaymentError(true);
      window.scrollTo({ top: document.body.scrollHeight });
      return;
    }
    setIsOpen(true);
  };

  const isDataReady =
    mode === "repay"
      ? !!orderDetail && !!orderItems
      : checkoutItems.length > 0 || selectedItems.length > 0;

  const isAddressReady =
    mode === "repay" ? !!orderDetailResponse : !!selectedAddress;

  if (
    !isMounted ||
    isLoading ||
    isLoadingQR ||
    (mode === "repay" && isLoadingOrderDetail) ||
    (mode !== "repay" && selectAddressId && isLoadingAddr && !isAddressReady) ||
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
                  ชำระเงินใหม่ OrderNo: 
                  <span className="text-blue-500"> {orderDetail?.orderNo}</span>
                  
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

          {isLoadingQR || (mode === "repay" && isLoadingOrderDetail) ? (
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

          {isDataReady && (
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
                disabled={
                  !slipFile || isCheckingOut || isLoadingAddr || isRepaying
                }
                className={`w-full py-5 text-2xl font-black rounded-full transition-all mt-6 ${
                  !slipFile || isCheckingOut || isLoadingAddr
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white shadow-[8px_8px_0px_0px_rgba(220,38,38,1)]"
                }`}
              >
                {isLoadingAddr && mode !== "repay"
                  ? "กำลังโหลดข้อมูลที่อยู่..."
                  : isCheckingOut || isRepaying
                    ? "กำลังดำเนินการ..."
                    : mode === "repay"
                      ? "ยืนยันการส่งสลิปใหม่"
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
