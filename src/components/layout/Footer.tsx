"use client";

import Link from "next/link";
import LineIcon from "@/components/icon/lineicon";
import FacebookIcon from "@/components/icon/facebookicon";

const shopname = "Moji's candle shop"
const Footer = () => {
  return (
    <footer className="w-full bg-cprojectone ">
    
      <div className="max-w-300 mx-auto py-6 px-4 block ">
        <div className=" grid grid-cols-1 gap-4 text-sm text-gray-600">
          <div className="ml-auto">
            <div className="flex items-center gap-7 mr-auto">
              <p className="text-black text-xs md:text-sm">
                <Link href="https://line.me" target="_blank">
                  Line: @{shopname}
                </Link>
              </p>
              <LineIcon size={30} />
            </div>

            <div className="flex items-center gap-2 mr-auto">
              <p className="text-black  text-xs md:text-sm ">
                <Link href="https://www.facebook.com/" target="_blank">
                  Facebook: {shopname}
                </Link>
              </p>
              <FacebookIcon size={30} />
            </div>
          </div>
        </div>
      </div>
      <div className="bg-cprojectone py-2 border-t border-gray-200">
        <p className="text-center text-xs text-gray-400">© 2026 {shopname}</p>
      </div>
    </footer>
  );
};

export default Footer;
