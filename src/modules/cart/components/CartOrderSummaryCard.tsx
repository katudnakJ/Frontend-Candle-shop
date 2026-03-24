import { CurrencyDisplay } from "@/utils/CurrencyDisplay";
import { NotebookPen } from "lucide-react";

interface CartOrderSummaryCardProps {
  totalQuantity: number;
  subtotal: number;
  shippingFee: number;
  totalAmount: number;
}

export const CartOrderSummaryCard = ({
  totalQuantity,
  subtotal,
  shippingFee,
  totalAmount,
}: CartOrderSummaryCardProps) => {
  return (
    <section className="grid grid-cols-12 w-full mt-10 border-gray-300 border-t-2">
      <div className="col-span-12 flex font-black text-xl mb-3 gap-2 uppercase mt-6">
        <NotebookPen className="text-amber-800" />
        ข้อมูลการชำระเงิน
      </div>
      
      <div className="col-start-1 col-span-12 md:col-start-2 md:col-span-10 bg-white p-6 rounded-[2rem] border-4 border-black mt-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <h3 className="font-black text-xl uppercase mb-6 flex items-center gap-2">
          <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
          สรุปยอดชำระเงิน
        </h3>

        <div className="space-y-4 font-bold text-lg">
         
          <div className="flex justify-between">
            <span className="max-[410px]:flex flex-col text-gray-500 font-medium">
              ยอดรวมสินค้า 
              <span> {totalQuantity.toLocaleString()} รายการ</span>
            </span>
            <span className="text-black font-black">
              ฿<CurrencyDisplay amount={subtotal} />
            </span>
          </div>

       
          <div className="flex justify-between">
            <span className="text-gray-500 font-medium">ค่าจัดส่ง</span>
            <span className="text-black font-black">
              ฿{<CurrencyDisplay amount={shippingFee} />}
            </span>
          </div>

        
          <div className="border-t-4 border-black border-dashed pt-4 flex justify-between items-end">
            <div>
              <span className="text-2xl font-black uppercase italic">
                ยอดรวมสุทธิ
              </span>
              <p className="text-xs text-gray-400 font-bold uppercase italic mt-1">
                Total Amount
              </p>
            </div>
            <span className="text-4xl font-black italic text-red-600 underline">
              ฿<CurrencyDisplay amount={totalAmount} />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};