"use client";
import Link from "next/link";
import { useState } from "react";
import { Plus, ChevronLeft } from "lucide-react";
import AddressCard from "@/modules/account/components/AddressCard";
import { mockAddresses } from "@/modules/account/mockaddress"; // Import ข้อมูลจำลอง
import { Addresses } from "@/modules/account/addresses";
import Header from "@/components/layout/CustomerHeader";
import Footer from "@/components/layout/Footer";
import CustomerWelcome from "@/modules/customers/components/CustomerWelcome";

export default function CustomerAccountPage() {
  // ใช้ mockAddresses เป็นค่าเริ่มต้น
  const [addresses, setAddresses] = useState<Addresses[]>(mockAddresses);

  const handleEdit = (id: string) => {
    console.log("แก้ไขที่อยู่ ID:", id);
    // ในอนาคตจะเปิด Modal แก้ไขที่นี่
  };

  const handleDelete = (id: string) => {
    console.log("ลบที่อยู่ ID:", id);
    // ในอนาคตจะเรียก ConfirmDialog และสั่ง Filter ออกจาก State
  };

  return (
      <div>
        <div className="flex flex-col min-h-screen bg-white">
      <Header />
        <main className="mb-4">

         <div className="max-w-[1200px] mx-auto p-4 flex items-center ">
            <Link href="/customerhome">
              <ChevronLeft className="w-10 h-10 md:w-13 md:h-13 text-black" />
            </Link>
            <span>
              <p className="text-md md:text-2xl text-black">บัญชีผู้ใช้</p>
            </span>
          </div>

          {/* 1. Profile Section - ส่วนต้อนรับ */}
          <section className="">
            <CustomerWelcome />
          </section>

          {/* 2. Address Management Section */}
          <section className=" max-w-[1200px] mx-auto px-6 mt-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-black">ที่อยู่จัดส่ง</h2>
              <Link
                href={`/account/address`}
                className="flex items-center gap-2 bg-cprojectone border-2 border-black text-black px-4 py-2 rounded-xl hover:bg-yellow-200 hover:translate-y-1  duration-400  transition-all cursor-pointer text-sm"
                onClick={() => console.log("เปิด Modal เพิ่มที่อยู่")}
              >
                <Plus size={18} />
                เพิ่มที่อยู่ใหม่
              </Link>
            </div>

            {/* รายการที่อยู่ */}
            <div className="grid grid-cols-1 gap-4 mx-auto ">
              {addresses.length > 0 ? (
                addresses.map((addr) => (
                  <AddressCard
                    key={addr.address_id}
                    address={addr}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    showActions={true}
                  />
                ))
              ) : (
                <div className="col-span-full py-10 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
                  ยังไม่มีที่อยู่จัดส่ง
                </div>
              )}
            </div>
          </section>
        </main>
        <Footer/>
      </div>
    </div>
  );
}
