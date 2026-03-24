"use client";

import { useState, useEffect } from "react";
import { User, Settings, Store } from "lucide-react";
import Link from "next/link";
import { useAuthStoreUserLogin } from "@/store/userLogin";
import { ORDER_STATUS } from "@/constants/status";
import { useGetOrderCountByStatus } from "../hooks/useGetOrder";
import toast from "react-hot-toast";
import { MODE } from "@/constants/mode";

interface SellerWelcomeProps {
  mode: "welcome" | "setting";
}

export default function SellerWelcome({ mode }: SellerWelcomeProps) {
  const { userData, isLoading: storeLoading } = useAuthStoreUserLogin();
  const [showSkeleton, setShowSkeleton] = useState(true);
  const { 
    data : totalOrderPending, isError, error 
  } = useGetOrderCountByStatus(ORDER_STATUS.PENDING, mode === MODE.WELCOME && !storeLoading);

  useEffect(() => {

    if (isError) {
    toast.error(error.message);
  }

    if (!storeLoading) {
      const timeoutId = setTimeout(() => {
        setShowSkeleton(false);
      }, 0);
      return () => clearTimeout(timeoutId);
    }

    const timer = setTimeout(() => {
      if (showSkeleton) {
        setShowSkeleton(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
    
  }, [storeLoading]);

  return (
    <div className="bg-cprojectone border border-cprojectone">
      {mode === "welcome" ? (
        <section className="max-w-[1200px] m-10 xl:mx-auto py-6 px-4 md:px-10 bg-white rounded-2xl drop-shadow-md ">
          <div className="container mx-auto px-4 flex flex-col  items-center gap-4">
            <Link
              href="/account/sellersetting/"
              className="relative p-1  text-black hover:text-yellow-500 transition-colors"
            >
              <User size={60} />
              <div className="absolute -right-3 -bottom-2 ">
              <Settings size={25} />
              </div>
            </Link>
            {/* {userData?.isOwner ? (
              <>
              <Link
              href="/account/sellersetting/"
              className="relative p-1  text-black hover:text-yellow-500 transition-colors"
            >
              <User size={60} />
              <div className="absolute -right-3 -bottom-2 ">
                {userData?.isOwner && (<Settings size={25} />)}
              </div>
            </Link>
              </>
            ) : (
              <User size={60} />
            )} */}
            <div>
              {showSkeleton ? (
                <div className="h-8 w-32 bg-gray-200 animate-pulse rounded"></div>
              ) : (
                <h1 className="text-2xl md:text-3xl text-black text-center">
                  สวัสดีค่ะคุณ{" "}
                  <span className="font-bold">
                    {userData?.lineProfile.displayName ?? "แม่ค้า"}
                  </span>
                </h1>
              )}
            </div>
            {totalOrderPending && totalOrderPending.data > 0 && (
              <div className="text-center line-clamp-3 text-black">
                มีลูกค้ารอท่านตรวจสอบการชำระเงินทั้งหมด{" "}
                <span className="text-[20px] font-bold text-red-500">
                  {totalOrderPending.data}
                </span>{" "}
                ท่าน
              </div>
            )}
          </div>
        </section>
      ) : (
        <section className="max-w-[1200px] m-10 xl:mx-auto py-6 px-4 md:px-10 bg-white rounded-2xl drop-shadow-md">
          <div className="container mx-auto px-4 flex flex-col items-center gap-4 py-4">
            <div className="bg-gray-100 p-4 rounded-full">
              <Store size={40} className="text-gray-600" />
            </div>
            <h2 className="text-xl font-bold">ตั้งค่าร้านค้าของคุณ</h2>
            <p className="text-gray-500 text-sm">
              เพิ่ม/แก้ไขข้อมูลที่อยู่ร้านค้า และการรับเงิน
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
