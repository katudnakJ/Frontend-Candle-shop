"use client";

import { ShoppingCart } from "lucide-react";
import LineIcon from "@/components/icon/lineicon";

import { useState } from "react";
import { useAddCart } from "@/modules/cart/hooks/useAddCart";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

import Link from "next/link";
import ConfirmDialog from "@/components/commonui/ConfirmDialog";
import QuantityInputButton from "@/components/Button/QuantityInputButton";
import { useCartStore } from "@/modules/cart/hooks/useCartstore";
import { AddCartResData } from "@/modules/cart/shoppingcartInterface";

interface DetailProductProps {
  price: number;
  productId: string;
  productName: string;
}

export default function ProductPurchaseActions({
  price,
  productId,
  productName,
}: DetailProductProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [quantity, setQuantity] = useState(1);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [actionType, setActionType] = useState<"ADD" | "BUY" | null>(null);
  const { mutate: addToCart, isPending } = useAddCart();
  const { setSelectedIds } = useCartStore();
  const handleConfirm = () => {
    addToCart(
      { productId, quantity },
      {
        onSuccess: async (response) => {
          if (process.env.NODE_ENV === "development") {
          console.log("Check Response in Component:", response);
          }
          queryClient.invalidateQueries({ queryKey: ["shopping-cart"] });
          const resdata=  response?.data || response;
          const typedData = resdata  as AddCartResData
          const itemdata = typedData.id
          
          


          if (actionType === "BUY") {
            const shoppingCartItemId = itemdata;
           

            if (shoppingCartItemId) {
              setSelectedIds([shoppingCartItemId]);
              sessionStorage.setItem(
                "selected_checkout_ids",
                JSON.stringify([shoppingCartItemId]),
              );
            }
            
            router.push("/shoppingcart/checkoutcart");
          } else {
            toast.success(`เพิ่มสินค้า ${quantity} ชิ้นลงรถเข็นแล้ว!`, {
              className:
                "border-2 border-cprojectone rounded-xl font-bold shadow-2xl",
              duration: 3000,
            });
            setOpenConfirm(false);
          }
        },
        onError: () => {
         setOpenConfirm(false);
        },
      },
    );
  };

  const triggerAction = (type: "ADD" | "BUY") => {
    setActionType(type);
    setOpenConfirm(true);
  };

  return (
    <>
      {/* ส่วนเลือกจำนวน*/}
      <section>
        <QuantityInputButton value={quantity} onChange={setQuantity} />
      </section>

      <div className="grid grid-cols-10  border border-black  bg-white overflow-hidden shadow-sm">
        <Link
          href="https://line.me"
          target="_blank"
          className="col-span-2  border border-black hover:bg-gray-50 cursor-pointer flex flex-col items-center justify-center py-2"
        >
          <LineIcon size={32} className="md:w-[40px] md:h-[40px]" />
          <span className="text-[10px] md:text-xs text-black font-bold text-center leading-tight px-1">
            Line
          </span>
        </Link>

        <button
          onClick={() => triggerAction("ADD")}
          disabled={isPending}
          className="col-span-4 flex flex-col items-center justify-center border border-black bg-cprojectfive hover:bg-[#e1e095] transition-colors cursor-pointer"
        >
          <ShoppingCart size={20} className="text-black mb-1" />
          <span className="text-[10px] md:text-sm text-black font-bold text-center">
            {isPending ? "กำลังเพิ่มสินค้าลงรถเข็น..." : "เพิ่มสินค้าลงรถเข็น"}
          </span>
        </button>

        <button
          onClick={() => triggerAction("BUY")}
          disabled={isPending}
          className="col-span-4 flex flex-col items-center justify-center border border-black bg-cprojectfive text-white hover:bg-[#e1e095] transition-colors py-2 cursor-pointer"
        >
          <span className="text-[10px] md:text-sm text-black font-bold text-center">
            {isPending ? "กำลังเพิ่มข้อมูลการสั่งซื้อ..." : "ซื้อสินค้าทันที"}
          </span>
          <span className="text-md md:text-xl text-red-500 font-extrabold mt-1">
            ฿{(price * quantity).toLocaleString()}
          </span>
        </button>
        <ConfirmDialog
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
          onConfirm={handleConfirm}
          title={
            actionType === "BUY"
              ? "ยืนยันการสั่งซื้อด่วน"
              : "ยืนยันการเพิ่มสินค้า"
          }
          content={
            <div className="flex flex-col items-center w-full">
              <span className="mb-4 text-gray-600">
                {actionType === "BUY"
                  ? "คุณต้องการสั่งซื้อสินค้านี้ทันทีใช่หรือไม่?"
                  : "คุณต้องการเพิ่มสินค้าลงรถเข็นใช่หรือไม่?"}
              </span>

              <div className="flex flex-col space-y-2 w-full max-w-[300px]">
                {" "}
                <div className="flex justify-between items-start">
                  <span className="text-xl font-bold text-black whitespace-nowrap">
                    ชื่อสินค้า:
                  </span>
                  <span className="text-xl font-bold text-blue-400 pl-4 text-right wrap-break-word">
                    {productName}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xl font-bold text-black whitespace-nowrap">
                    จำนวน:
                  </span>
                  <span className="text-xl font-bold text-blue-400 pl-4 text-right">
                    {quantity} <span className="text-black">ชิ้น</span>
                  </span>
                </div>
                {actionType === "BUY" && (
                  <div className="flex justify-between items-center border-t pt-2 mt-2">
                    <span className="text-xl font-bold text-black">
                      ยอดรวม:
                    </span>
                    <span className="text-xl font-bold text-red-500">
                      ฿{(price * quantity).toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          }
        />
      </div>
    </>
  );
}


