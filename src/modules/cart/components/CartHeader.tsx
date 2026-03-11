import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export const CartHeader = ({
  itemCount,
  isShopingcart = false,
  isCheckout = false,
  isRepay = false,
}: {
  itemCount: number;
  isShopingcart?: boolean;
  isCheckout?: boolean;
  isRepay?: boolean;
}) => (
  <div className="flex items-center gap-2 mb-6">
    {isCheckout && (
      <div className="flex items-center">
        <Link href="/shoppingcart">
          <ChevronLeft className="w-8 h-8 text-black hover:bg-gray-100 transition-colors rounded-full" />
        </Link>
        <span>
          <p className="text-xl md:text-2xl font-black text-black">
            รถเข็นของฉัน
          </p>
        </span>
      </div>
    )}
    {isRepay && (
      <div className="flex items-center">
        <Link href="/account/orderhistory">
          <ChevronLeft className="w-8 h-8 text-black hover:bg-gray-100 transition-colors rounded-full" />
        </Link>
        <span>
          <p className="text-xl md:text-2xl font-black text-black">
            ประวัติคำสั่งซื้อ
          </p>
        </span>
      </div>
    )}

    {isShopingcart && (
      <div className="flex items-center">
        <Link href="/customerhome">
          <ChevronLeft className="w-8 h-8 text-black hover:bg-gray-100 transition-colors rounded-full" />
        </Link>
        <h1 className="text-xl md:text-2xl font-black text-black">
          รถเข็นของฉัน ({itemCount})
        </h1>
      </div>
    )}
  </div>
);
