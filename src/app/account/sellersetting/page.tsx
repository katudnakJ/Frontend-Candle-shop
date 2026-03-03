"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, ChevronLeft, QrCode, X } from "lucide-react";
import AddressCard from "@/modules/account/components/AddressCard";
import { mockSellerAddresses } from "@/modules/account/mockaddressseller";
import { mockSellerData } from "@/modules/seller/mockSellerData";
import { Seller } from "@/modules/seller/types";
import { Addresses } from "@/modules/account/addresses";
import SellerHeader from "@/components/layout/SellerHeader";
import Footer from "@/components/layout/Footer";
import SellerWelcome from "@/modules/seller/components/SellerWelcome";
import { usePaymentSlip } from "@/modules/seller/hooks/usepaymentslip";
import { toast } from "react-hot-toast";
import ConfirmDialog from "@/components/commonui/ConfirmDialog";

export default function SellerSettingPage() {
  const router = useRouter();
  const [addresses, setAddresses] = useState<Addresses[]>(mockSellerAddresses);
  const [seller, setSeller] = useState<Seller | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false);

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
    console.log("ไฟล์ที่พร้อมอัปโหลด:", file);
  };

  const handleConfirm = () => {
    if (!selectedFile) {
      toast.error("กรุณาเลือกรูปภาพก่อนบันทึก");
      return;
    }
    setIsOpen(true);
  };
  const handleSavePaymentInfo = async () => {
    if (isUploading) return;
    setIsUploading(true);

    try {
      // ตรงนี้คือที่ที่คุณต้องเรียก API (เช่น Axios หรือ Fetch)
      // ตัวอย่าง: await axios.post('/api/seller/update-qr', formData)

      console.log("กำลังส่งไฟล์ไปที่ Server...", selectedFile);
      setSelectedFile(null);
      toast.success("บันทึกข้อมูลสำเร็จ!");
    } catch (error) {
      toast.error("บันทึกล้มเหลว:");
      setIsOpen(false);
    } finally {
      setIsUploading(false);
      setIsOpen(false);
    }
  };

  const {
    slipPreview: qrCodeImage,
    setSlipPreview,
    inputKey,
    fileInputRef,
    handleBoxClick: triggerFileInput,
    onFileChange: handleImageChange,
    resetFile: clearImage,
  } = usePaymentSlip(handleFileSelect);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        setIsImageLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const data = mockSellerData[0];
        setSeller(data);
        if (data.qr_payment_img_path) {
          setIsImageLoading(true);
          setSlipPreview(data.qr_payment_img_path);
        } else {
          setIsImageLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch seller:", error);
      }
    };
    fetchSellerData();
  }, [setSlipPreview]);

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
        <SellerHeader />
        <main className="mb-4">
          <div className="max-w-[1200px] mx-auto p-4 flex items-center ">
            <Link href="/sellerhome">
              <ChevronLeft className="w-8 h-8 text-black hover:bg-gray-100 transition-colors rounded-full" />
            </Link>
            <span>
              <p className="text-xl md:text-2xl font-black text-black">
                บัญชีผู้ใช้
              </p>
            </span>
          </div>

          <section className="">
            <SellerWelcome mode="setting" />
          </section>

          <section className=" max-w-[1200px] mx-auto px-6 mt-4 space-y-25">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-black">ที่อยู่ร้านค้า</h2>
              {addresses.length < 1 && (
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
                <div className="col-span-full py-10 text-center text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl ">
                  ยังไม่มีที่อยู่จัดส่ง
                </div>
              )}
            </div>
            <hr className="my-8 border-gray-100" />

            <div className="flex flex-col items-center gap-6 py-6">
              <h2 className="text-xl font-bold text-black w-full text-left">
                ข้อมูลการรับชำระเงิน (QR Payment)
              </h2>

              <input
                key={inputKey}
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/png, image/jpeg, image/jpg"
                className="hidden"
              />

              {qrCodeImage ? (
                <div className="relative group w-full max-w-[600px] animate-in fade-in zoom-in duration-300">
                  {isImageLoading && !selectedFile && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-50 border-2 border-black rounded-[2rem] animate-pulse">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm font-bold text-black">
                          กำลังโหลดรูปภาพ...
                        </p>
                      </div>
                    </div>
                  )}

                  <img
                    src={qrCodeImage}
                    alt="PromptPay QR"
                    onLoad={() => setIsImageLoading(false)}
                    onError={() => setIsImageLoading(false)}
                    className={`w-full aspect-[5/4] object-contain border-2 border-black rounded-[2rem] bg-zinc-50 p-2 transition-all duration-500 ${
                      isImageLoading && !selectedFile
                        ? "opacity-0 scale-95"
                        : "opacity-100 scale-100"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      clearImage();
                      setSelectedFile(null);
                      setIsImageLoading(false);
                    }}
                    className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-xl hover:bg-red-600 transition-all border-2 border-white active:scale-90"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={triggerFileInput}
                  className="w-full max-w-[600px] aspect-[5/4] border-4 border-dashed border-gray-300 rounded-[2rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-black hover:bg-zinc-50 transition-all group active:scale-95"
                >
                  <div className="p-5 bg-zinc-100 rounded-full group-hover:bg-cprojectone transition-colors">
                    <QrCode
                      size={40}
                      className="text-gray-400 group-hover:text-black"
                    />
                  </div>
                  <span className="font-black text-gray-500 group-hover:text-black text-center px-4">
                    คลิกเพื่อเพิ่มรูป <br /> QR Code ธนาคาร
                  </span>
                </div>
              )}
              {qrCodeImage && selectedFile && (
                <button
                  onClick={handleConfirm}
                  disabled={isUploading}
                  className={`mt-4 bg-black text-white px-10 py-3 rounded-full font-bold transition-all shadow-lg active:scale-95 
      ${isUploading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"}`}
                >
                  {isUploading
                    ? "กำลังบันทึก..."
                    : "ยืนยันข้อมูล QR Payment"}{" "}
                </button>
              )}

              <p className="text-[13px] md:text-[16px] text-red-400 text-start font-bold">
                💡 คำแนะนำ
                <br />
                1. กรุณาตรวจสอบชื่อบัญชีและหมายเลขบัญชีบนรูปภาพให้ถูกต้อง
                <br />
                2. ถ้าต้องการแก้ไขให้ทำการกดกากบาทแล้วกดอัปโหลดอีกครั้ง
              </p>
            </div>
          </section>
        </main>
        <Footer />
        <ConfirmDialog
          open={isOpen}
          onClose={() => setIsOpen(false)}
          onConfirm={handleSavePaymentInfo}
          title="ข้อมูลการรับชำระเงิน"
          content="ยืนยันข้อมูล QR Payment?"
          variant="primary" 
        />

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
