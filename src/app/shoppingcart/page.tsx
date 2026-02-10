'use client'

import Header from "@/components/layout/CustomerHeader";
import Footer from "@/components/layout/Footer";
import { ChevronLeft, Trash2, Plus, Minus } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/modules/cart/hooks/useCart"; // เช็คตัวสะกดชื่อไฟล์ด้วยนะครับ
import { MOCK_CART_DATA } from "@/modules/cart/mockcart";

export default function ShoppingCartPage() {
  // ดึงทุกอย่างที่ต้องใช้จาก Hook
  const { 
    items, selectedIds, toggleSelect, updateQuantity, 
    removeItem, getPrimaryImage, totalPrice, totalQuantity,
    isAllSelected, toggleSelectAll 
  } = useCart(MOCK_CART_DATA);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      
      <main className="flex-grow bg-white pb-32"> {/* เผื่อพื้นที่ให้ Bottom Bar */}
        <div className="max-w-[1200px] mx-auto p-4">
          
          {/* Header ส่วนย้อนกลับ */}
          <div className="flex items-center gap-2 mb-6">
            <Link href="/customerhome">
              <ChevronLeft className="w-8 h-8 text-black border-2 border-black rounded-full hover:bg-gray-100 transition-colors" />
            </Link>
            <h1 className="text-xl md:text-2xl font-black text-black">รถเข็นของฉัน ({items.length})</h1>
          </div>

          {/* ปุ่ม Select All */}
          {items.length > 0 && (
            <div className="mb-4 flex items-center gap-2 px-2">
              <input 
                type="checkbox" 
                checked={isAllSelected}
                onChange={toggleSelectAll}
                className="w-5 h-5 accent-black cursor-pointer"
              />
              <span className="font-bold text-sm">เลือกทั้งหมด</span>
            </div>
          )}

          {/* รายการสินค้าในตะกร้า */}
          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-black rounded-3xl">
                <p className="text-gray-500 font-bold">ไม่มีสินค้าในรถเข็นเยยย ~</p>
                <Link href="/customerhome" className="text-blue-500 underline mt-2 inline-block">ไปช้อปกันเถอะ!</Link>
              </div>
            ) : (
              items.map((item) => (
                <div 
                  key={item.Shopping_Cart_Item_id}
                  className="flex gap-4 p-4 border-4 border-black rounded-3xl shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] bg-white"
                >
                  {/* Checkbox เลือกรายชิ้น */}
                  <div className="flex items-center">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.includes(item.Shopping_Cart_Item_id)}
                      onChange={() => toggleSelect(item.Shopping_Cart_Item_id)}
                      className="w-5 h-5 accent-black cursor-pointer"
                    />
                  </div>

                  {/* รูปภาพสินค้า */}
                  <div className="w-24 h-24 md:w-32 md:h-32 border-2 border-black rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                    <img 
                      src={getPrimaryImage(item)} 
                      alt={item.product?.product_name} 
                      className="w-full h-full object-cover" 
                    />
                  </div>

                  {/* รายละเอียดสินค้า */}
                  <div className="flex flex-col justify-between flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-black text-sm md:text-lg truncate uppercase">
                        {item.product?.product_name}
                      </h3>
                      <button 
                        onClick={() => removeItem(item.Shopping_Cart_Item_id)}
                        className="text-black hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>

                    <div className="flex justify-between items-end mt-2">
                      <p className="font-black text-lg md:text-xl">฿{item.product?.price}</p>
                      
                      {/* ปุ่มเพิ่ม/ลดจำนวน */}
                      <div className="flex items-center border-2 border-black rounded-xl overflow-hidden bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <button 
                          onClick={() => updateQuantity(item.Shopping_Cart_Item_id, -1)}
                          className="px-2 py-1 hover:bg-black hover:text-white transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-3 font-black border-x-2 border-black bg-gray-50">
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.Shopping_Cart_Item_id, 1)}
                          className="px-2 py-1 hover:bg-black hover:text-white transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Bottom Bar (Fixed) */}
      {items.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-4 border-black p-4 z-40">
          <div className="max-w-[1200px] mx-auto flex items-center justify-between gap-6">
            <div className="flex flex-col">
              <span className="text-xs font-bold text-gray-500 uppercase">Total ({totalQuantity} items)</span>
              <span className="text-2xl font-black text-black leading-none">฿{totalPrice.toLocaleString()}</span>
            </div>
            <button className="flex-1 max-w-[300px] bg-[#FFB0D1] py-4 rounded-2xl border-4 border-black font-black text-lg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all uppercase tracking-wider">
              ชำระเงิน
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}