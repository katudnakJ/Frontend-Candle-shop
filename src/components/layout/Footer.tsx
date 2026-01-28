"use client";

import Link from "next/link";
import { Home, ClipboardList, ShoppingCart, User,Facebook} from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full border-t bg-white">
      {/* --- ส่วนที่ 1: Desktop Footer (แสดงเฉพาะจอใหญ่ md ขึ้นไป) --- */}
      <div className="block bg-cprojectone py-4">
        <div className="container mx-auto px-4 grid grid-cols-1 gap-4 text-sm text-gray-600">
            
          <div className="ml-auto">
            
            <p className="text-black  p-2 ">Line: @candlelight</p>
            <p className="text-black  p-2 ">Facebook: Candlelight Shop</p>
          </div>
        </div>
      </div>
      <div className="bg-white py-2 border-t">
        <p className="text-center text-xs text-gray-400">
          © 2026 Candle Shop.
        </p>
      </div>
    </footer>
  );
};

export default Footer;