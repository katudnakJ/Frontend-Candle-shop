"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ChevronLeft } from "lucide-react";
import AddressCard from "@/modules/account/components/AddressCard";
import { mockAddresses } from "@/modules/account/mockaddress"; 
import { Addresses } from "@/modules/account/addresses";
import Header from "@/components/layout/CustomerHeader";
import Footer from "@/components/layout/Footer";
import CustomerWelcome from "@/modules/customers/components/CustomerWelcome";
import { toast } from "react-hot-toast";
import ConfirmDialog from "@/components/commonui/ConfirmDialog";

export default function CustomerAccountPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Addresses[]>(mockAddresses);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  

  const handleAdd = () => {
    router.push("/account/address");
  };

  const handleEdit = (id: string) => {
    console.log("แก้ไขที่อยู่ ID:", id);
    router.push(`/account/address?id=${id}`);
  };

  const handleDelete = (id: string) => {
    setAddressToDelete(id);
    setIsDeleteOpen(true);
  };
  const confirmDeleteAddress = () => {
    if (addressToDelete) {
      setAddresses((prev) =>
        prev.filter((addr) => addr.address_id !== addressToDelete),
      );
      toast.success("ลบที่อยู่สำเร็จ");
      setIsDeleteOpen(false);
      setAddressToDelete(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="mb-4">
          <div className="max-w-[1200px] mx-auto p-4 flex items-center ">
            <Link href="/customerhome">
              <ChevronLeft className="w-8 h-8 text-black hover:bg-gray-100 transition-colors rounded-full" />
            </Link>
            <span>
              <p className="text-xl md:text-2xl font-black text-black">
                บัญชีผู้ใช้
              </p>
            </span>
          </div>

          {/* 1. Profile Section  */}
          <section className="">
            <CustomerWelcome />
          </section>

          {/* 2. Address Management Section */}
          <section className=" max-w-[1200px] mx-auto px-6 mt-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-black">ที่อยู่จัดส่ง</h2>
              {addresses.length < 3 && (
                <Link
                  href={`/account/address`}
                  className="flex items-center gap-2 bg-cprojectone border-2 border-black text-black px-4 py-2 rounded-xl hover:bg-yellow-200 hover:translate-y-1  duration-400  transition-all cursor-pointer text-sm"
                  onClick={handleAdd}
                >
                  <Plus size={18} />
                  เพิ่มที่อยู่ใหม่
                </Link>
              )}
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
        <Footer />
         <ConfirmDialog
                  open={isDeleteOpen}
                  onClose={() => setIsDeleteOpen(false)}
                  onConfirm={confirmDeleteAddress}
                  title="ยืนยันการลบ"
                  content={
                    <>
                      คุณแน่ใจหรือไม่ที่จะลบที่อยู่นี้?
                      <br />
                      การกระทำนี้ไม่สามารถย้อนกลับได้
                    </>
                  }
                  variant="danger"
                />
      </div>
    </div>
  );
}
