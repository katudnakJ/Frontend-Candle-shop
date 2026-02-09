"use client";

import { mockAddresses } from "@/modules/account/mockaddress";
import { useSearchParams, useRouter } from "next/navigation";
import AddressForm from "@/modules/account/components/AddressForm";
import AddressFormVEdit from "@/modules/account/components/AddressFormVEdit";
import { AddressFormSkeleton } from "@/modules/account/components/AddressFormSkeleton";
import { useState, useEffect } from "react";

export default function AddressPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
   
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // ดึง ID จาก URL (?id=xxxx)
  const addressId = searchParams.get("id");

  // หาข้อมูลจาก mock data (ในอนาคตคือ Fetch จาก API)
  const editingAddress = mockAddresses.find(
    (addr) => addr.address_id === addressId,
  );

  return (
    <div className="min-h-screen bg-amber-50">
      <main className="max-w-4xl mx-auto p-6">
        {isLoading ? (
          <AddressFormSkeleton />
        ) : (
          <AddressFormVEdit
            key={addressId || "new"} 
            initialData={editingAddress}
            onCancel={() => router.back()} // กดยกเลิกแล้วถอยกลับหน้าเดิม
            onSubmit={(data) => {
              console.log("บันทึก:", data);
              router.push("/account/customer"); // กลับไปหน้าหลัก
            }}
          />
        )}
      </main>
    </div>
  );
}
