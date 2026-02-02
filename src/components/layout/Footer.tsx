"use client";

import Link from "next/link";
import LineIcon from "@/components/icon/lineicon";
import FacebookIcon from "@/components/icon/facebookicon";

const Footer = () => {
  return (
    <footer className="w-full border-t bg-cprojectone">
    
      <div className="max-w-[1200px] mx-auto py-6 px-4 block ">
        <div className=" grid grid-cols-1 gap-4 text-sm text-gray-600">
          <div className="ml-auto">
            <div className="flex items-center gap-7">
              <p className="text-black text-xs md:text-sm">
                <Link href="https://line.me" target="_blank">
                  Line: @Candle Shop
                </Link>
              </p>
              <LineIcon size={30} />
            </div>

            <div className="flex items-center gap-2">
              <p className="text-black  text-xs md:text-sm ">
                <Link href="https://www.facebook.com/" target="_blank">
                  Facebook: Candle Shop
                </Link>
              </p>
              <FacebookIcon size={30} />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-cprojectone py-2 border-t">
        <p className="text-center text-xs text-gray-400">© 2026 Candle Shop.</p>
      </div>
    </footer>
  );
};

export default Footer;
