"use client";

import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export const PreviousButton = ({
  itemCount,
  isShopingcart = false,
  isCheckout = false,
  isRepay = false,
  isDetailProduct = false,
  isAccountCus = false,
}: {
  itemCount?: number;
  isShopingcart?: boolean;
  isCheckout?: boolean;
  isRepay?: boolean;
  isDetailProduct?: boolean;
  isAccountCus?: boolean;
}) => {
  const [backUrl, setBackUrl] = useState("/");

  useEffect(() => {
    const savedPath = sessionStorage.getItem("last_homeproduct_page");

    if (savedPath) {
      window.requestAnimationFrame(() => {
        if (savedPath === "/" || savedPath === "?page=0") {
          setBackUrl("/");
        } else if (savedPath.startsWith("/")) {
          setBackUrl(savedPath);
        } else {
          setBackUrl(`/${savedPath}`);
        }
      });
    }
  }, []);

  return (
    <div className="flex items-center gap-2 mb-6">
      {isCheckout && (
        <div className="flex items-center">
          <Link href="/shoppingcart">
            <ChevronLeft className="w-8 h-8 text-black hover:bg-gray-100 transition-colors rounded-full" />
          </Link>
          <span>
            <p className="text-xl md:text-2xl font-black text-black truncate max-w-[200px] md:max-w-none">
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
            <p className="text-xl md:text-2xl font-black text-black truncate max-w-[200px] md:max-w-none">
              ประวัติคำสั่งซื้อ
            </p>
          </span>
        </div>
      )}

      {isShopingcart && (
        <div className="flex items-center">
          <Link href={backUrl}>
            <ChevronLeft className="w-8 h-8 text-black hover:bg-gray-100 transition-colors rounded-full" />
          </Link>
          <h1 className="text-xl md:text-2xl font-black text-black truncate max-w-[200px] md:max-w-none">
            รถเข็นของฉัน ({itemCount})
          </h1>
        </div>
      )}

      {isDetailProduct && (
        <div className="flex items-center">
          <Link href={backUrl}>
            <ChevronLeft className="w-8 h-8 text-black hover:bg-gray-100 transition-colors rounded-full" />
          </Link>
          <h1 className="text-xl md:text-2xl font-black text-black truncate max-w-[200px] md:max-w-none">
            รายละเอียดสินค้า
          </h1>
        </div>
      )}

      {isAccountCus && (
        <div className="flex items-center">
          <Link href={backUrl}>
            <ChevronLeft className="w-8 h-8 text-black hover:bg-gray-100 transition-colors rounded-full" />
          </Link>
          <h1 className="text-xl md:text-2xl font-black text-black truncate max-w-[200px] md:max-w-none">
            บัญชีผู้ใช้
          </h1>
        </div>
      )}
    </div>
  );
};
