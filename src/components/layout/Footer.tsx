"use client";

import Link from "next/link";
import { Home, ClipboardList, ShoppingCart, User } from "lucide-react";
import LineIcon from "@/components/icon/lineicon";
import FacebookIcon from "@/components/icon/facebookicon";

const Footer = () => {
  return (
    <footer className="w-full border-t bg-white">
      {/* --- ส่วนที่ 1: Desktop Footer (แสดงเฉพาะจอใหญ่ md ขึ้นไป) --- */}
      <div className="block bg-cprojectone py-4">
        <div className="container mx-auto px-4 grid grid-cols-1 gap-4 text-sm text-gray-600">
          <div className="ml-auto">
            <div className="flex items-center gap-7">
              <p className="text-black  text-sm">
                <Link href="https://line.me">
                  Line: @Candle Shop
                </Link>
              </p>
              <LineIcon size={30} />
            </div>

            <div className="flex items-center gap-2">
              <p className="text-black  text-sm ">
                <Link href="https://www.facebook.com/">
                  Facebook: Candle Shop
                </Link>
              </p>
              <FacebookIcon size={30} />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-white py-2 border-t">
        <p className="text-center text-xs text-gray-400">© 2026 Candle Shop.</p>
      </div>
    </footer>
  );
};

export default Footer;
