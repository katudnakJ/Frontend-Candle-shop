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
}) => {
  const isDisabled = totalQuantity === 0;
  return (
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
        <div className="flex flex-1 min-[360px]:items-center justify-end max-[360px]:flex-col max-[440px]:justify-between max-[440px]:w-full gap-3 md:gap-6 min-w-0">
          <div className="flex flex-col">
            <span className="whitespace-nowrap text-sm font-bold">
              {isCheckout ? "ยอดคำสั่งซื้อทั้งหมด" : "รวมทั้งหมด"}
            </span>
            <span className="text-[18px] md:text-2xl font-black text-black leading-none whitespace-nowrap">
              ฿{" "}
              {(totalPrice + calculateShipping(totalQuantity)).toLocaleString()}
            </span>
          </div>

          {isCheckout ? (
            <button
              onClick={onOrderClick}
              disabled={isDisabled} 
              className={`py-3 px-8 max-[360px]:px-15 md:px-30 max-[360px]:text-[16px] rounded-2xl border-4 border-black font-black text-lg transition-all uppercase tracking-wider shrink
                ${
                  isDisabled
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-70 shadow-none" 
                    : "bg-[#FFB0D1] text-black cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none" 
                }`}
            >
              สั่งชื้อสินค้า
            </button>
          ) : (
            <Link
              href={isDisabled ? "#" : "/shoppingcart/checkoutcart"} 
              className={`max-[440px]:ml-auto ${isDisabled ? "pointer-events-none" : ""}`}
            >
              <button
                disabled={isDisabled}
                className={`py-3 px-12 max-[380px]:px-20 md:px-30 rounded-2xl border-4 border-black font-black text-lg transition-all uppercase tracking-wider shrink
                  ${
                    isDisabled
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-70 shadow-none"
                      : "bg-[#FFB0D1] text-black  cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
                  }`}
              >
                ชำระเงิน
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};
