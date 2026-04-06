"use client";

import toast from "react-hot-toast";
import Header from "@/components/layout/CustomerHeader";
import Footer from "@/components/layout/Footer";
import AddressCard from "@/modules/account/components/AddressCard";
import calculateShipping from "@/utils/calculateShipping";
import ConfirmDialog from "@/components/commonui/ConfirmDialog";

import { useRouter } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import { useGetCartData } from "@/modules/cart/hooks/useGetCartData";
import { useCartStore } from "@/modules/cart/hooks/useCartstore";
import { CartItemCard } from "@/modules/cart/components/CartItemCard";
import { CartSummaryBar } from "@/modules/cart/components/CartSummaryBar";
import { CartOrderSummaryCard } from "@/modules/cart/components/CartOrderSummaryCard";
import { PreviousButton } from "@/components/commonui/PreviousButton";
import { CartCheckoutSkeletonpage } from "@/modules/cart/components/skeletoncart/CartCheckoutSkeletonpage";
import { CircleCheckBig, MapPinCheck } from "lucide-react";

import { useGetAddressesList } from "@/modules/account/hooks/useAddressesQuery";
import { Addresses } from "@/modules/account/addresses";

export default function CheckoutPage() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const {
    allCartItems,
    selectedIds,
    getPrimaryImage,
    setSelectedIds,
    setCheckoutItems,
    setSelectedAddress,
  } = useCartStore();
  const { data, isLoading } = useGetCartData();

  const { data: addressesData } = useGetAddressesList();

  const selectedAddress = useMemo(() => {
    const list = addressesData;

    if (Array.isArray(list)) {
      const defaultAddr = list.find((addr: Addresses) => addr.isDefault);

      return defaultAddr || list[0] || null;
    }
    return null;
  }, [addressesData]);
  const cartItem = useMemo(() => {
    const pages = data?.pages || [];
    return pages.flatMap((p) => {
      const actualData = p?.data || p;
      return actualData?.cartItems || [];
    });
  }, [data]);

  useEffect(() => {
    const saved = sessionStorage.getItem("selected_checkout_ids");
    if (saved && selectedIds.length === 0) {
      const parsedIds = JSON.parse(saved);
      
        setSelectedIds(parsedIds);
      
    }

    const timer = setTimeout(() => setIsMounted(true), 500);
    return () => clearTimeout(timer);
  }, [selectedIds.length, setSelectedIds]);

  const selectedItems = useMemo(() => {
    const sourceItems = allCartItems.length > 0 ? allCartItems : cartItem;

    return sourceItems.filter((item) =>
      selectedIds.includes(item.shoppingCartItemId),
    );
  }, [cartItem, allCartItems, selectedIds]);

  useEffect(() => {
    if (isMounted && !isLoading) {
      const saved = sessionStorage.getItem("selected_checkout_ids");
      const parsedSaved = saved ? JSON.parse(saved) : [];

      if (parsedSaved.length === 0) {
        router.replace("/shoppingcart");
      }
    }
  }, [isMounted, isLoading, router]);

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
    if (!selectedAddress) {
      toast.error("กรุณาเพิ่มที่อยู่จัดส่งก่อนดำเนินการต่อ");
      setIsOpen(false);
      return;
    }

    setIsOpen(false);
    setCheckoutItems(selectedItems);
    setSelectedAddress(selectedAddress);
    router.replace(
      `/shoppingcart/checkoutcart/paymentcart?addressid=${selectedAddress.addressId}`,
    );
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

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <Header />
      <main className="flex-grow bg-white">
        <div className="max-w-[1200px] mx-auto p-4 space-y-6">
          <div>
            <PreviousButton itemCount={cartItem.length} isCheckout={true} />
          </div>
          <section className="border-gray-300 border-b-2">
            <div className="flex font-black text-xl mb-3 gap-2 uppercase ">
              <MapPinCheck className="text-green-600" />
              จัดส่งไปที่ 
              <span className="opacity-50">(คลิกเพื่อแก้ไข)</span>
            </div>
            <div className="grid grid-cols-12 w-full mb-5 ">
   
              <button
                onClick={() => router.push("/account/customer?mode=editaddressforshipment")}
                className="col-start-1 col-span-11 md:col-start-2 md:col-span-10 text-left transition-all active:scale-[0.97] shadow-amber-100  hover:shadow-lg hover:translate-y-1 cursor-pointer "
              >
                {selectedAddress ? (
                  <AddressCard address={selectedAddress} showActions={false} />
                ) : (
                  <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl text-center">
                    <div className="flex flex-col">
                      <p className="text-blue-500  font-bold">คลิกที่นี้</p>
                      <p className="text-gray-500 font-bold">
                        ยังไม่มีข้อมูลที่อยู่ กรุณาเพิ่มที่อยู่จัดส่ง
                      </p>
                    </div>
                  </div>
                )}
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
