"use client";

import { QrCode, ImagePlus, X, CheckCircle2, Download } from "lucide-react";
import Image from "next/image";
import { useState, useRef } from "react";
import { Seller } from "@/modules/seller/types";
import { toast } from "react-hot-toast";

interface PaymentMethodCardProps {
  seller: Seller | null;
  totalAmount: number;
  onFileSelect: (file: File | null) => void;
  showError?: boolean;
}

export const PaymentMethodCard = ({
  seller,
  totalAmount,
  onFileSelect,
  showError,
}: PaymentMethodCardProps) => {
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState(false);
  const [inputKey, setInputKey] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleBoxClick = () => {
    if (fileInputRef.current) {
      setInputKey((prev) => prev + 1);
      setTimeout(() => {
        fileInputRef.current?.click();
      }, 50);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }
    if (file) {
      const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        toast.error(
          <div className="flex flex-col justify-center py-1">
            <span className="text-sm  leading-tight">
              ขออภัย! ระบบรองรับเฉพาะไฟล์รูปภาพ
              <br /> (JPG, JPEG, PNG) เท่านั้น
            </span>
          </div>,
          {
            className:
              " bg-white border-2 border-cprojectone rounded-xl font-bold shadow-2xl text-black mx-auto sm:ml-auto sm:mr-6 h-20",
            duration: 3000,
          },
        );
        setFileError(true);
        e.target.value = "";
        onFileSelect(null);
        setSlipPreview(null);
        return;
      }
      if (file.size > 1 * 1024 * 1024) {
        toast.error(
          <div className="flex flex-col justify-center py-1">
            <span className="text-sm leading-tight">
              กรุณาใช้ไฟล์ขนาดไม่เกิน 1MB
            </span>
          </div>,
          {
            className:
              " bg-white border-2 border-cprojectone rounded-xl font-bold shadow-2xl text-black mx-auto sm:ml-auto sm:mr-6 h-20",
            duration: 3000,
          },
        );
        setFileError(true);
        e.target.value = "";
        onFileSelect(null);
        setSlipPreview(null);
        return;
      }
      setFileError(false);
      onFileSelect(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      onFileSelect(null);
      setSlipPreview(null);
    }
  };

  const handleDownloadQR = async () => {
    if (!seller?.bank_QrPayment_img_slug) return;
    try {
      const imageUrl = seller.bank_QrPayment_img_slug;
      console.log(seller.bank_QrPayment_img_slug);
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "QRpayment-CandleShop.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error("ไม่สามารถดาวน์โหลดรูปภาพได้ กรุณาลองใหม่อีกครั้ง");
    }
  };

  const isInvalid = (showError && !slipPreview) || fileError;

  if (!seller) return null;
  return (
    <section className="grid grid-cols-12 w-full mt-10 pb-10">
      <div className="col-span-12 flex font-black text-xl mb-3 gap-2 uppercase">
        <QrCode className="text-blue-600" />
        วิธีการชำระเงิน
      </div>

      <div className="col-start-1 col-span-12 md:col-start-2 md:col-span-10 bg-white p-6 rounded-[2rem] border-4 border-black mt-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* QR Code*/}
          <div className="flex-1 space-y-6">
            <div className="relative group">
              <div className="relative w-full h-[400px] md:h-[500px] flex flex-col items-center p-6 bg-gray-50 rounded-3xl border-2 border-black border-dashed overflow-hidden">
                <Image
                  src={seller.bank_QrPayment_img_slug}
                  alt="QR Payment"
                  className="object-contain p-4 select-all touch-auto"
                  fill
                  priority
                  unoptimized
                  quality={100}
                />
         
              </div>
              <button
                onClick={handleDownloadQR}
                type="button"
                className="absolute bottom-4 right-4 bg-gray-600 text-white px-3 py-1 rounded-full font-bold shadow-lg opacity-80 hover:bg-blue-700 hover:opacity-100 active:scale-90 transition-all flex items-center gap-2 z-20"
              >
                <Download size={18} />
              </button>
            </div>
            <div className="p-4 bg-blue-50 rounded-2xl border-2 border-blue-200 flex items-start gap-3">
              <CheckCircle2 className="text-blue-600 mt-1 shrink-0" />
              <div className="flex flex-col">
                <p className="text-sm font-bold text-blue-900">
                  โอนเงินจำนวน{" "}
                  <span className="text-lg underline font-black text-red-600">
                    ฿{totalAmount.toLocaleString()}
                  </span>{" "}
                  เรียบร้อยแล้ว โปรดแนบสลิปด้านข้าง
                </p>
                <p className="text-[12px] text-blue-700 mt-2 font-bold">
                  💡 หากปุ่มโหลดที่ QR Payment ไม่ทำงาน:
                  <br />
                  1. ให้กดค้างที่รูปภาพเพื่อบันทึก
                  <br />
                  2. แคปหน้าจอ
                </p>
              </div>
            </div>
          </div>

          {/* อัปโหลดสลิป  */}
          <div className="flex-1 space-y-4">
            <h4 className="font-black text-lg flex items-center gap-2">
              {isInvalid ? (
                <div className="flex items-center max-[370px]:flex-col ">
                  <span className="flex text-sm md:text-md items-center text-red-500 gap-2">
                    {" "}
                    <ImagePlus size={20} /> แนบหลักฐานการโอน
                  </span>
                  <p className="text-sm text-red-500 font-bold animate-pulse  ml-7 mr-auto not-s">
                    กรุณาแนบสลิป‼
                  </p>
                </div>
              ) : (
                <div>
                  <span className="flex items-center  gap-2">
                    {" "}
                    <ImagePlus size={20} /> แนบหลักฐานการโอน{" "}
                  </span>
                </div>
              )}
            </h4>
            {!slipPreview ? (
              <div
                onClick={handleBoxClick}
                className={`group flex flex-col items-center justify-center w-full h-64 border-4 border-dashed rounded-[2rem] cursor-pointer transition-all bg-zinc-50
                  touch-manipulation active:scale-[0.98]
                  active:scale-[0.97] active:bg-zinc-100
                    ${
                      isInvalid
                        ? "border-red-500 bg-red-50 animate-shake"
                        : "border-black hover:bg-gray-50 hover:border-blue-500"
                    }`}
              >
                <div className="flex flex-col items-center justify-center text-center p-6 pointer-events-none select-none">
                  <div
                    className={`p-6 rounded-full shadow-md group-hover:scale-110 transition-transform mb-4 
                    ${isInvalid ? "bg-red-100" : "bg-white"}`}
                  >
                    <ImagePlus
                      className={isInvalid ? "text-red-500" : "text-gray-400"}
                      size={42}
                    />
                  </div>
                  <div
                    className={`flex flex-col items-center ${isInvalid ? "text-red-600" : "text-gray-600"}`}
                  >
                    <span className="text-lg font-black leading-tight">
                      {isInvalid
                        ? "ต้องอัปโหลดสลิปก่อนยืนยัน"
                        : "แตะเพื่อแนบรูปสลิป"}
                    </span>

                    <div className="space-y-1 opacity-70 font-bold">
                      <p className="text-xs uppercase">
                        รองรับไฟล์ JPG, JPEG, PNG
                      </p>
                      <p className="text-xs uppercase bg-zinc-200 px-2 py-1 rounded-md inline-block">
                        ขนาดไม่เกิน 1MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full h-64 border-4 border-black rounded-[2rem] overflow-hidden group shadow-lg">
                <img
                  src={slipPreview}
                  alt="Slip Preview"
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => {
                    setSlipPreview(null);
                    onFileSelect(null);
                  }}
                  className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-xl transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            )}
          </div>
          <input
            key={inputKey}
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
            onClick={(e) => {
              (e.target as HTMLInputElement).value = "";
            }}
          />
        </div>
      </div>
    </section>
  );
};
