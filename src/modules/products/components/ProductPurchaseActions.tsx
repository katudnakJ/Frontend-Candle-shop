"use client";

import { useState } from "react";
import Link from "next/link";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import LineIcon from "@/components/icon/lineicon";
import { toast } from "react-hot-toast";
import ConfirmDialog from "@/components/commonui/ConfirmDialog";
import QuantityInputButton from "@/components/Button/QuantityInputButton";

export default function ProductPurchaseActions({ price }: { price: number }) {
  const [quantity, setQuantity] = useState(1);
  const [openConfirm, setOpenConfirm] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputvalue = e.target.value;

    if (inputvalue === "") {
    setQuantity(0);
    return;
  }
  const value = parseInt(inputvalue);
    if (!isNaN(value)  ) {
      setQuantity(value);
    } 
    if (value >1000){
      setQuantity(1000)
    }
  };
  const handleBlur = () => {
  if (quantity < 1) {
    setQuantity(1);
  }
};
  


  const increment = () => setQuantity((prev) => (prev >= 1000 ? 1000 : prev+1));
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  
  const handleConfirmAddToCart = () => {
    toast.success(
      <div className="flex flex-col justify-center py-1">
        <span className="leading-tight">
          เพิ่มสินค้า {quantity} ชิ้นลงรถเข็นแล้ว!
        </span>
      </div>,
      {
        className:
          " bg-white border-2 border-cprojectone rounded-xl font-bold shadow-2xl text-black mx-auto sm:ml-auto sm:mr-6 h-20",
        duration: 3000,
      },
    );
    setOpenConfirm(false);
  };

  return (
    <>
      {/* ส่วนเลือกจำนวน*/}
      <section>
      <QuantityInputButton value={quantity} onChange={setQuantity} />
      </section>
      
      <div className="grid grid-cols-10  border border-black  bg-white overflow-hidden shadow-sm">
        <Link href="https://line.me" target="_blank" className="col-span-2  border border-black hover:bg-gray-50 cursor-pointer flex flex-col items-center justify-center py-2">
          
            <LineIcon size={32} className="md:w-[40px] md:h-[40px]"/>
            <span className="text-[10px] md:text-xs text-black font-bold text-center leading-tight px-1">
              Line
            </span>
          
        </Link>

        <button
          onClick={() => setOpenConfirm(true)}
          className="col-span-4 flex flex-col items-center justify-center border border-black bg-cprojectfive hover:bg-[#e1e095] transition-colors cursor-pointer"
        >
          <ShoppingCart size={20} className="text-black mb-1" />
          <span className="text-[10px] md:text-sm text-black font-bold text-center">
            เพิ่มสินค้าลงรถเข็น
          </span>
        </button>
        <ConfirmDialog
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
          onConfirm={handleConfirmAddToCart}
          title="ยืนยันการเพิ่มสินค้า"
          content={
            <div className="text-center space-y-2">
              <span> คุณต้องการเพิ่มสินค้าลงรถเข็นใช่หรือไม่?</span>
              <br />
              <span className="text-xl font-bold text-black">
                {quantity} ชิ้น
              </span>
            </div>
          }
        />

        <button className="col-span-4 flex flex-col items-center justify-center border border-black bg-cprojectfive text-white hover:bg-[#e1e095] transition-colors py-2 cursor-pointer">
          <span className="text-[10px] md:text-sm text-black font-bold text-center">
            ซื้อสินค้าทันที
          </span>
          <span className="text-md md:text-xl text-red-500 font-extrabold mt-1">
            ฿{(price * quantity).toLocaleString()}
          </span>
        </button>
      </div>
    </>
  );
}

