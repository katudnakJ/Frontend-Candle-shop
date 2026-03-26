"use client";

import Header from "@/components/layout/CustomerHeader";
import Footer from "@/components/layout/Footer";

import { Loader2 } from "lucide-react";
import { OrderCard } from "@/modules/orders/components/OrderCard";
import { OrderStatus } from "@/modules/orders/type";
import { OrderHeader } from "@/modules/orders/components/OrderHeader";
import { useAuthStoreUserLogin } from "@/store/userLogin";
import { USER_ROLE } from "@/constants/userRole";
import { useGetOrders } from "@/modules/orders/hooks/index";
import { CUSTOMER_ORDER_TAB } from "@/constants/status";

export default function OrderHistoryPage() {
  const { 
    activeTab,
    setActiveTab,
    OrdersByTab,
    isLoading,
    orders 
  } = useGetOrders();

    const {userData} = useAuthStoreUserLogin();

  const tabs = [
    { key: "PD", label: "รอตรวจสอบ" },
    { key: "TS", label: "ที่ต้องจัดส่ง" },
    { key: "TR", label: "ที่ต้องได้รับ" },
    { key: "CP", label: "สำเร็จแล้ว" },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <Header />
      <main className="grow bg-white">
        <div className="max-w-[1200px] mx-auto p-4">
          <OrderHeader namemode="ประวัติคำสั่งซื้อ"/>

          <div className="max-w-2xl md:max-w-4xl mx-auto px-4 mt-6">
            <div className="flex bg-white border-4 border-black rounded-2xl overflow-hidden  mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]  ">
                {CUSTOMER_ORDER_TAB.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as OrderStatus)}
                  className={`flex-1 py-4 text-sm font-black transition-all cursor-pointer ${
                    activeTab === tab.key
                      ? "bg-cprojectone text-black"
                      : "bg-white text-black hover:bg-gray-100"
                  } ${tab.key !== "CP" ? "border-r-2 border-black" : ""}`}
                >
                  {tab.label}
                </button>
                ))}
            </div>

            {/* รายการการ์ดคำสั่งซื้อ */}
            {isLoading ? (
              <div className="flex flex-col items-center py-20">
                <Loader2 className="animate-spin text-black mb-2" size={40} />
                <p className="font-bold text-gray-500">กำลังโหลดข้อมูล...</p>
              </div>
            ) : (
              <div className="space-y-2">
                {OrdersByTab.orders.length > 0 ? (
                  OrdersByTab.orders.map((order) => (
                    <OrderCard 
                      key={order.orderId}
                      order={order}
                      role={userData?.userRole?.toLocaleUpperCase() as USER_ROLE}
                    />
                  ))
                ) : (
                  /* กรณีไม่มีข้อมูลใน Tab นั้น */
                  <div className="text-center py-20 bg-white border-4 border-dashed border-gray-300 rounded-[2rem]">
                    <p className="text-gray-400 font-black text-xl">
                      ไม่พบรายการสั่งซื้อในหน้านี้
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
