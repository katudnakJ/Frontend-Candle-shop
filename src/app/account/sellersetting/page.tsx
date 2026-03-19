"use client";

import Link from "next/link";
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { Plus, ChevronLeft, Eye, EyeOff } from "lucide-react";
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
import QRpaymentshop from "@/modules/seller/components/QRpaymentshop";
import { useGetAddressesList } from "@/modules/account/hooks/useAddressesQuery";
import { useAddressForm } from "@/modules/account/hooks/useAddressForm";
import { Status } from "@/types/response.type";
import { useGetQRPaymentImage } from "@/modules/seller/services/payment.service";

export default function SellerSettingPage() {
  const router = useRouter();
  const [seller, setSeller] = useState<Seller | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [delAddressId, setDelAddressId] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isShowQR, setIsShowQR] = useState(false);

  const { data : addressesData } = useGetAddressesList();
  const {
    deleteAddress
  } = useAddressForm();

  const { data : existingQRCode} = useGetQRPaymentImage(
    Boolean(isShowQR && !selectedFile )
  );

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
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
      
      setSelectedFile(null);
      toast.success("บันทึกข้อมูลสำเร็จ!");
    } catch (error) {
      const err = error as Status;
      toast.error(err.message ?? "บันทึกล้มเหลว:");
      setIsOpen(false);
    } finally {
      setIsUploading(false);
      setIsOpen(false);
    }
  };

  const {
    slipPreview,
    setSlipPreview,
    inputKey,
    fileInputRef,
    handleBoxClick: triggerFileInput,
    onFileChange: handleImageChange,
    resetFile: clearImage,
  } = usePaymentSlip(handleFileSelect);

  useEffect(() => {
    let isMounted = true;
    let timer: NodeJS.Timeout | undefined = undefined;
    const fetchSellerData = async () => {
      try {
        setIsImageLoading(true);
        await new Promise((resolve) => {
          timer = setTimeout(resolve, 1000);
        });

        if (!isMounted) return;

        const data = mockSellerData[0];
        setSeller(data);

        if (data.qr_payment_img_path) {
          setSlipPreview(data.qr_payment_img_path);
        } else {
          if (isMounted) {
            setIsImageLoading(false);
          }
        }
      } catch (error) {
        if (isMounted) {
          console.error("Failed to fetch seller:", error);
        }
      }
    };
    fetchSellerData();
    return () => {
      isMounted = false;
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [setSlipPreview]);

  useEffect(() => {
    if (existingQRCode && !selectedFile) {
      setSlipPreview(existingQRCode.signedFileUrl);
    }
  },[existingQRCode, selectedFile, setSlipPreview]);

  const handleAdd = () => {
    router.push("/account/address");
  };

  const handleEdit = (id: string) => {
    router.push(`/account/address?id=${id}`);
  };

  const handleDelete = (id: string) => {
    setDelAddressId(id);
    setIsDeleteOpen(true);
  };
  const confirmDeleteAddress = async () => {
    if (delAddressId) {
      try {
        await deleteAddress.mutateAsync(delAddressId);
        toast.success("ลบที่อยู่สำเร็จ");
      }catch (error) {   
        const err = error as Status;     
        toast.error(err.message ?? "เกิดข้อผิดพลาดในการลบที่อยู่ กรุณาลองใหม่อีกครั้ง");
      }
      setIsDeleteOpen(false);
      setDelAddressId(null);
    }
  };

  const handleUndoImage = () => {
  if (existingQRCode) {
    setSlipPreview(existingQRCode.signedFileUrl);
    setSelectedFile(null);     
    toast.success("คืนค่ารูปเดิมเรียบร้อย");
  }
};

  return (
    <div>
      <div className="flex flex-col min-h-screen bg-white">
        <SellerHeader />
        <main className="mb-4">
          <div className="max-w-[1200px] mx-auto p-4 flex items-center ">
            <Link href="/">
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
              {!addressesData && (
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
              {addressesData && addressesData.length > 0 ? (
                addressesData.map((addr) => (
                  <AddressCard
                    key={addr.addressId}
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


              
            {!slipPreview || isShowQR ? (
              <div className="animate-in fade-in zoom-in-90 ">
                <QRpaymentshop
                  qrCodeImage={slipPreview}
                  selectedFile={selectedFile}
                  isImageLoading={isImageLoading}
                  isUploading={isUploading}
                  inputKey={inputKey}
                  fileInputRef={fileInputRef}
                  onTriggerFileInput={triggerFileInput}
                  onImageChange={handleImageChange}
                  onClearImage={() => {
                    clearImage();
                    setSelectedFile(null);
                    setIsImageLoading(false);
                  }}
                  onUndoImage={handleUndoImage}
                  onConfirm={handleConfirm}
                  setIsImageLoading={setIsImageLoading}
                />
                {slipPreview && (
                  <button
                    onClick={() => setIsShowQR(false)}
                    className="mt-4 text-xl font-bold text-gray-500 underline hover:text-black w-full text-center"
                  >
                    ซ่อนการแสดง QR
                  </button>
                )}
              </div>
            ) : (
              <div className="p-6 border-2  rounded-[2rem] bg-white  flex justify-between items-center  hover:-translate-y-1 transition-transform  duration-300 ">
                <div className="space-y-1">
                  <h2 className="text-xl font-black text-black">
                    QR สำหรับรับชำระเงิน
                  </h2>
                  <p className="text-sm text-gray-500 font-bold">
                    คลิกที่ไอคอนดวงตาเพื่อดูหรือแก้ไข QR Code
                  </p>
                </div>

                <button
                  onClick={() => setIsShowQR(true)}
                  className="p-4 bg-cprojectone hover:bg-yellow-300 rounded-2xl border-2 border-black text-black  active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all cursor-pointer"
                  title="คลิกเพื่อดู QR Code"
                >
                  <EyeOff size={16} strokeWidth={2} />
                </button>
              </div>
            )}
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
