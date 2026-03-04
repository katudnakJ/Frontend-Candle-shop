"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Home } from "lucide-react";

const SellerHeader = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const mountTimer = setTimeout(() => {
      setIsMounted(true);
    }, 0);

    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearTimeout(mountTimer);
      clearInterval(timer);
    };
  }, []);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB");
  };
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-GB", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };
  return (
    <header className="border-b border-cprojectone  top-0 z-50 w-full bg-cprojectone backdrop-blur-md font-sans">
      <div className="max-w-[1400px] mx-auto">
        <div className="mx-3 md:mx-10 flex h-20 md:h-24 items-center justify-between px-2 md:px-8">
          <div className="flex items-center">
            <Link
              href="/sellerhome"
              className="flex items-center gap-2 group transition-colors"
            >
              <Home className="w-8 h-8 md:w-11 md:h-11 text-black group-hover:text-yellow-600" />
            </Link>
          </div>

          <div className="text-center">
            <p className="font-bold text-[18px] md:text-2xl text-black ml-7">
              {"Moji's Candle Shop"}
            </p>
            <span className="text-xs text-gray-500 uppercase tracking-widest ml-5">
              Store Management
            </span>
          </div>

          <div className="flex items-center gap-4 md:gap-8">
            <div className="flex flex-col items-end text-black font-medium text-[12px] md:text-base">
              {isMounted ? (
                <>
                  <div>{formatTime(currentTime)}</div>
                  <div>{formatDate(currentTime)}</div>
                </>
              ) : (
                <div className="h-10 w-20 bg-gray-100 animate-pulse rounded" />
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default SellerHeader;
