"use client";

import SellerHeader from "@/components/layout/SellerHeader";
import Footer from "@/components/layout/Footer";
import { Loader2 } from "lucide-react";
import { OrderCard } from "@/modules/orders/components/OrderCard";
import { OrderStatus } from "@/modules/orders/type";
import { OrderHeader } from "@/modules/orders/components/OrderHeader";
import { useGetOrders } from "@/modules/orders/hooks/index";
import { SELLER_ORDER_TAB } from "@/constants/status";
import { useAuthStoreUserLogin } from "@/store/userLogin";
import { USER_ROLE } from "@/constants/userRole";
import CustomerHome from "@/app/CustomerHome";

export default function Sellerorders (){

  const { 
    activeTab, 
    setActiveTab, 
    OrdersByTab, 
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    handleLoadMoreRef,
  } = useGetOrders();

  const { userData } = useAuthStoreUserLogin();

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <SellerHeader/>
      <main className="grow bg-white">
        <div className="max-w-[1200px] mx-auto p-4">
          <OrderHeader mode="sellerorders" namemode="จัดการคำสั่งซื้อ"/>

          <div className="max-w-2xl md:max-w-4xl mx-auto px-4 mt-6">
            <div className="flex bg-white border-4 border-black rounded-2xl overflow-hidden  mb-8 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]  ">
              {SELLER_ORDER_TAB.map((tab) => (
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

            {isLoading ? (
              <div className="flex flex-col items-center py-20">
                <Loader2 className="animate-spin text-black mb-2" size={40} />
                <p className="font-bold text-gray-500">กำลังโหลดข้อมูล...</p>
              </div>
            ) : (
              <div className="space-y-2">
                {
                  OrdersByTab.size > 0 ? (
                    OrdersByTab.orders.map((order) => (
                      <div key={order.orderId}>
                        <OrderCard 
                          order={order}
                          role={userData?.userRole.toLocaleUpperCase() as USER_ROLE}
                        />  
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-white border-4 border-dashed border-gray-300 rounded-[2rem]">
                      <p className="text-gray-400 font-black text-xl">
                        ไม่พบรายการสั่งซื้อในหน้านี้
                    </p>
                  </div>
                )}
                <div ref={handleLoadMoreRef} className="h-8" />

                {isFetchingNextPage && (
                  <div className="flex justify-center py-4">
                    <Loader2 className="animate-spin text-black mr-2" size={24} />
                    <span className="font-bold text-gray-500">
                      กำลังโหลดเพิ่มเติม...
                    </span>
                  </div>
                )}

                {!hasNextPage && OrdersByTab.size > 0 && (
                  <p className="text-center text-gray-400 py-4 font-bold">
                    คุณได้ดูรายการทั้งหมดแล้ว
                  </p>
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
