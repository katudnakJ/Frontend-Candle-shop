import toast from "react-hot-toast";

function calculateShipping(totalQty: number): number {
  if (totalQty <= 0) return 0;

  const limit = 100;
  const bigBoxFee = 120;

  const fullBoxes = Math.floor(totalQty / limit);

  let totalFee = fullBoxes * bigBoxFee;

  const remainingQty = totalQty % limit;
  if (remainingQty > 0) {
    if (remainingQty > 10) {
      totalFee += 120;
    } else {
      totalFee += 50;
    }
  }

  return totalFee;
}

export const CartSummary = ({
  totalQuantity,
  totalPrice,
  
}: {
  totalQuantity: number;
  totalPrice: number;
}) => (
  <div className=" left-0 right-0 bg-white border-t-2  border-black p-4 z-40 shadow-[0_-4px_0_0_rgba(0,0,0,0.05)]">
    <div className="max-w-[1200px] max-[360px]:flex-col mx-auto flex max-[360px]:items-start items-center justify-between gap-2">
      <div className="flex flex-col min-w-0 ">
        <span className="text-[13px] md:text-sm font-bold text-gray-500 uppercase leading-tight whitespace-nowrap">
          Total ({totalQuantity} items)
        </span>
         <span className="text-[15px] md:text-[17px] font-bold text-gray-500 uppercase mt-2 mb-1 whitespace-nowrap">
          ค่าสินค้า ({totalPrice.toLocaleString()} ฿)
        </span>
        <span className="text-[15px] md:text-[17px] font-bold text-gray-500 uppercase mb-1 whitespace-nowrap">
          ค่าจัดส่ง ({calculateShipping(totalQuantity).toLocaleString()} ฿)
        </span>
      </div>
     <div className="flex flex-1 items-center justify-end gap-3 md:gap-6 min-w-0">
        <span className="text-xl md:text-2xl font-black text-black leading-none whitespace-nowrap">
          ฿{(totalPrice+calculateShipping(totalQuantity)).toLocaleString()}
        </span>
        <button className="bg-[#FFB0D1] py-3 px-8 max-[360px]:px-15 md:px-30
         rounded-2xl border-4 border-black font-black text-lg 
         shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none
         transition-all uppercase tracking-wider shrink cursor-pointer">
          ชำระเงิน
        </button>
      </div>
    </div> 
  </div>
);
