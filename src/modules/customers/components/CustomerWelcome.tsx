"use client";

import { useState, useEffect } from "react";
import { User } from "lucide-react";

import { useAuthStoreUserLogin } from "@/store/userLogin";

export default function CustomerWelcome() {
  const { userData, isLoading: storeLoading } = useAuthStoreUserLogin();
  const [showSkeleton, setShowSkeleton] = useState(true);
  
  useEffect(() => {

    if (!storeLoading) {
    const timeoutId = setTimeout(() => {
        setShowSkeleton(false);
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    
    const timer = setTimeout(() => {
      if (showSkeleton) {
        console.log("Loading timeout: Force showing default customer name");
        setShowSkeleton(false);
      }
    }, 3000);

    return () => clearTimeout(timer); 
  }, [storeLoading])

  return (
    <div className="bg-cprojectone border border-cprojectone">
    <section className="max-w-[1200px] m-10 xl:mx-auto py-6 px-4 md:px-10 bg-white rounded-2xl drop-shadow-md ">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-4">
        <div className="p-3 text-black">
          <User size={60} className="" />
        </div>

        <div>
          {showSkeleton ? (
            <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
          ) : (
            <h1 className="text-2xl md:text-3xl text-black">
              สวัสดีค่ะคุณ{" "}
              <span className="font-bold">
                {userData?.lineProfile.displayName ?? "ลูกค้า"}
              </span>
            </h1>
          )}
        </div>
      </div>
    </section>
    </div>
  );
}
