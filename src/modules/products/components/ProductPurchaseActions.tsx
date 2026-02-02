"use client";
import { useState } from "react";
import { ShoppingCart, MessageCircle, Plus, Minus } from "lucide-react";
import LineIcon from "@/components/icon/lineicon";

export default function ProductPurchaseActions({ price }: { price: number }) {
  const [quantity, setQuantity] = useState(1);

  const increment = () => setQuantity((prev) => prev + 1);
  const decrement = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  return (
    <>
      {/* ส่วนเลือกจำนวน*/}
      <div className="flex justify-end items-center gap-4 px-6 mt-10 mb-6 text-black">
        <span className="text-lg font-bold">จำนวน</span>
        <div className="flex items-center border-2 border-black rounded-xl overflow-hidden">
          <button 
            onClick={decrement}
            className="p-2 hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <Minus size={20} />
          </button>
          <input 
            type="number" 
            value={quantity}
            readOnly
            className="w-12 text-center font-bold text-lg focus:outline-none"
          />
          <button 
            onClick={increment}
            className="p-2 hover:bg-gray-100 active:bg-gray-200 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>
      </div>

     
      <div className="bottom-0 left-0 right-0 grid grid-cols-10 h-16 md:h-18 z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] pb-[2px]">
      
    
      <button className="col-span-2 flex flex-col items-center justify-center border border-black hover:bg-gray-50">
       
         <LineIcon size={24} /> 
         <span className="text-xs md:text-sm text-black font-bold">Line</span>
      </button>

     
      <button className="col-span-4 flex flex-col items-center justify-center border border-black bg-cprojectfive hover:bg-[#e1e095] transition-colors">
        <ShoppingCart size={20} className="text-black" />
        <span className="text-xs md:text-sm text-black font-bold">เพิ่มสินค้าลงรถเข็น</span>
      </button>

      
      <button className="col-span-4 flex flex-col items-center justify-center border border-black bg-cprojectfive text-white hover:bg-[#e1e095] transition-colors">
        <span className="text-xs md:text-sm text-black font-bold">ซื้อสินค้าทันที</span>
        <span className="text-xs text-red-500 font-extrabold leading-none">
          ฿{(price * quantity).toLocaleString()}</span>
        </button>
      </div>
    </>
  );
}