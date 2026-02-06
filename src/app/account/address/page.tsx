"use client";
import { useSearchParams, useRouter } from "next/navigation";
import AddressForm from "@/modules/account/components/AddressForm";
import { mockAddresses } from "@/modules/account/mockaddress";

export default function AddressPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // ดึง ID จาก URL (?id=xxxx)
  const addressId = searchParams.get("id");

  // หาข้อมูลจาก mock data (ในอนาคตคือ Fetch จาก API)
  const editingAddress = mockAddresses.find((addr) => addr.address_id === addressId);

  return (
    <div className="min-h-screen bg-amber-50">   
        <main className="max-w-2xl mx-auto p-6">
      <AddressForm
        key={addressId || "new"} // ใช้ key เพื่อให้ React สร้างฟอร์มใหม่เสมอถ้า ID เปลี่ยน
        initialData={editingAddress}
        onCancel={() => router.back()} // กดยกเลิกแล้วถอยกลับหน้าเดิม
        onSubmit={(data) => {
          console.log("บันทึก:", data);
          // หลังจากบันทึกเสร็จ
          router.push("/account/customer"); // กลับไปหน้าหลัก
        }}
      />
    </main>
    </div>
 
  );
}