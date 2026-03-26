"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, ChevronLeft } from "lucide-react";
import AddressCard from "@/modules/account/components/AddressCard";
import Header from "@/components/layout/CustomerHeader";
import Footer from "@/components/layout/Footer";
import CustomerWelcome from "@/modules/customers/components/CustomerWelcome";
import { toast } from "react-hot-toast";
import ConfirmDialog from "@/components/commonui/ConfirmDialog";
import { useGetAddressesList } from "@/modules/account/hooks/useAddressesQuery";
import { useAddressForm } from "@/modules/account/hooks/useAddressForm";
import { Status } from "@/types/response.type";
import { PreviousButton } from "@/components/commonui/PreviousButton";

export default function CustomerAccountPage() {
  const router = useRouter();
  const { data: addressesData } = useGetAddressesList();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [delAddressId, setDelAddressId] = useState<string | null>(null);

  const { deleteAddress } = useAddressForm();

  const handleAdd = () => {
    router.push("/account/address");
  };

  const handleEdit = (id: string) => {
    router.push(`/account/address?id=${id}`);
  };

  const confirmDeleteAddress = async (id: string) => {
    if (!id) return;

    try {
      await deleteAddress.mutateAsync(id);
      toast.success("ลบที่อยู่สำเร็จ");
    } catch (error) {
      const err = error as Status;
      toast.error(
        err.message ?? "เกิดข้อผิดพลาดในการลบที่อยู่ กรุณาลองใหม่อีกครั้ง",
      );
    }
    setIsDeleteOpen(false);
  };
  return (
    <div>
      <div className="flex flex-col min-h-screen bg-white">
        <Header />
        <main className="mb-4">
          <div className="max-w-[1200px] mx-auto p-4 flex items-center ">
            <PreviousButton isAccountCus={true} />
          </div>

          {/* 1. Profile Section  */}
          <section className="">
            <CustomerWelcome />
          </section>

          {/* 2. Address Management Section */}
          <section className=" max-w-[1200px] mx-auto px-6 mt-4">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-black">ที่อยู่จัดส่ง</h2>
              {addressesData && addressesData.length < 5 && (
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
              {addressesData && addressesData.length > 0 ? (
                addressesData.map((addr) => (
                  <AddressCard
                    key={addr.addressId}
                    address={addr}
                    onEdit={handleEdit}
                    onDelete={(id) => {
                      setDelAddressId(id);
                      setIsDeleteOpen(true);
                    }}
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
          onConfirm={() => confirmDeleteAddress(delAddressId as string)}
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
