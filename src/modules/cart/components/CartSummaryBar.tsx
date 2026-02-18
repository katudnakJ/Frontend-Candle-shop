import Link from "next/link";
import calculateShipping from "@/utils/calculateShipping";


export const CartSummaryBar = ({
  totalQuantity,
  totalPrice,
  isCheckout = false,
  onOrderClick,
}: {
  totalQuantity: number;
  totalPrice: number;
  isCheckout?: boolean;
  onOrderClick?: () => void;
}) => (
  <div className=" left-0 right-0 bg-white border-t-2  border-black p-4 z-40 shadow-[0_-4px_0_0_rgba(0,0,0,0.05)]">
    <div className="max-w-[1200px] max-[440px]:flex-col mx-auto flex max-[440px]:items-start items-center justify-between gap-2">
      {!isCheckout && (
        <div className="flex flex-col min-w-0 ">
          <span className="text-[11px] md:text-sm font-bold text-gray-500 uppercase leading-tight whitespace-nowrap">
            Total ({totalQuantity} items)
          </span>
          <span className="text-[13px] md:text-[17px] font-bold text-gray-500 uppercase mt-2 mb-1 whitespace-nowrap">
            ค่าสินค้า ({totalPrice.toLocaleString()} ฿)
          </span>
          <span className="text-[13px] md:text-[17px] font-bold text-gray-500 uppercase mb-1 whitespace-nowrap">
            ค่าจัดส่ง ({calculateShipping(totalQuantity).toLocaleString()} ฿)
          </span>
        </div>
      )}
      {isCheckout ? (
        <div className="flex flex-1  items-center justify-end max-[440px]:justify-between max-[440px]:w-full gap-3 md:gap-6 min-w-0 ">
          <div className=" flex flex-col">
            <span className="whitespace-nowrap text-sm font-bold">
              ยอดคำสั่งซื้อทั้งหมด
            </span>
            <span className="text-[18px] md:text-2xl font-black text-black leading-none whitespace-nowrap">
              ฿
              {(totalPrice + calculateShipping(totalQuantity)).toLocaleString()}
            </span>
          </div>

    
            <button
              onClick={onOrderClick}
              className="bg-[#FFB0D1] py-3 px-8 max-[360px]:px-15 md:px-30
         rounded-2xl border-4 border-black font-black text-lg 
         shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none
         transition-all uppercase tracking-wider shrink cursor-pointer "
            >
              สั่งชื้อสินค้า
            </button>
         
        </div>
      ) : (
        <div className="flex flex-1  items-center justify-end max-[440px]:justify-between max-[440px]:w-full gap-3 md:gap-6 min-w-0 ">
          <div className=" flex flex-col">
            <span className="whitespace-nowrap text-sm font-bold">
              รวมทั้งหมด
            </span>
            <span className="text-[18px] md:text-2xl font-black text-black leading-none whitespace-nowrap">
              ฿
              {(totalPrice + calculateShipping(totalQuantity)).toLocaleString()}
            </span>
          </div>
          <Link
            href="/shoppingcart/checkoutcart"
            className="max-[440px]:ml-auto"
          >
            <button
              className="bg-[#FFB0D1] py-3 px-8 max-[360px]:px-15 md:px-30
         rounded-2xl border-4 border-black font-black text-lg 
         shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none
         transition-all uppercase tracking-wider shrink cursor-pointer "
            >
              ชำระเงิน
            </button>
          </Link>
        </div>
      )}
    </div>
  </div>
);
