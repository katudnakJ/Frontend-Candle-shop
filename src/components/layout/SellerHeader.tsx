"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Home, LogOut } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button as MuiButton } from "@mui/material";

const SellerHeader = () => {
  const queryClient = useQueryClient();
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


  const handleLogout = () => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    queryClient.clear();
    window.location.reload();
  };

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
    <header className="border-b border-cprojectone top-0 z-50 w-full bg-cprojectone backdrop-blur-md font-sans py-2 md:py-0">
      <div className="max-w-[1400px] mx-auto">
        
        <div className="mx-3 md:mx-10 flex flex-col md:flex-row md:h-24 items-center justify-between px-2 md:px-8 gap-2 md:gap-0">
          
          
          <div className="flex w-full md:w-auto items-center justify-between md:justify-start">
            <Link
              href="/"
              className="flex items-center gap-2 group transition-colors"
            >
              <Home className="w-8 h-8 md:w-11 md:h-11 text-black group-hover:text-yellow-600" />
            </Link>

         
            <div className="flex md:hidden items-center gap-3">
               <div className="flex flex-col items-end text-black font-medium text-[10px]">
                {isMounted ? (
                  <>
                    <div>{formatTime(currentTime)}</div>
                    <div className="text-gray-500">{formatDate(currentTime)}</div>
                  </>
                ) : (
                  <div className="h-6 w-16 bg-gray-100 animate-pulse rounded" />
                )}
              </div>
              <MuiButton
                onClick={handleLogout}
                variant="outlined"
                size="small"
                className="min-w-0 p-1.5 border-black text-black"
              >
                <LogOut size={16} />
              </MuiButton>
            </div>
          </div>

          
          <div className="text-center order-first md:order-none py-1 md:py-0">
            <p className="font-bold text-[18px] md:text-2xl text-black">
              {"Moji's Candle Shop"}
            </p>
            <span className="block text-[10px] md:text-xs text-gray-500 uppercase tracking-widest leading-tight">
              Store Management
            </span>
          </div>

         
          <div className="hidden md:flex items-center gap-4 md:gap-8">
            <div className="flex flex-col items-end text-black font-medium md:text-base">
              {isMounted ? (
                <>
                  <div>{formatTime(currentTime)}</div>
                  <div>{formatDate(currentTime)}</div>
                </>
              ) : (
                <div className="h-10 w-20 bg-gray-100 animate-pulse rounded" />
              )}
            </div>

            <MuiButton
              onClick={handleLogout}
              variant="outlined"
              size="small"
              className="min-w-0 p-2 border-black text-black hover:bg-red-50 hover:border-red-500 hover:text-red-500 transition-all"
              title="ออกจากระบบ"
            >
              <LogOut size={20} className="md:mr-1" />
              <span className="hidden md:inline font-bold">Logout</span>
            </MuiButton>
          </div>

        </div>
      </div>
    </header>
  );
};

export default SellerHeader;
