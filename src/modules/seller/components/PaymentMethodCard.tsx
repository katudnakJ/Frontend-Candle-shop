"use client";

import { QrCode, ImagePlus, X, CheckCircle2, Download } from "lucide-react";
import Image from "next/image";
import { usePaymentSlip } from "@/modules/seller/hooks/usepaymentslip";
import { PaymentService } from "@/modules/seller/services/payment.service";
import { Seller } from "@/modules/seller/types";

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

  const {
    slipPreview,
    fileError,
    inputKey,
    fileInputRef,
    handleBoxClick,
    onFileChange,
    resetFile,
  } = usePaymentSlip(onFileSelect);


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
          {/* ส่วนที่ 1: QR Code Payment */}
          <div className="flex-1 space-y-6">
            <div className="relative group">
              <div className="relative w-full h-[400px] md:h-[500px] flex flex-col items-center p-6 bg-gray-50 rounded-3xl border-2 border-black border-dashed overflow-hidden">
                <Image
                  src={seller.qr_payment_img_path}
                  alt="QR Payment"
                  className="object-contain p-4 select-all touch-auto"
                  fill
                  priority
                  unoptimized
                />
              </div>
              <button
                onClick={() =>
                  PaymentService.downloadQR(
                    seller.qr_payment_img_path,
                    "QR-Payment.png",
                  )
                }
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
                  💡 หากปุ่มโหลด QR Payment ไม่ทำงาน:
                  <br />
                  1. กดค้างที่รูปเพื่อบันทึก
                  <br />
                  2. แคปหน้าจอ
                </p>
              </div>
            </div>
          </div>

          {/* ส่วนที่ 2: Upload Slip */}
          <div className="flex-1 space-y-4">
            <h4 className="font-black text-lg flex items-center gap-2">
              <span
                className={`flex items-center gap-2 ${isInvalid ? "text-red-500" : ""}`}
              >
                <ImagePlus size={20} /> แนบหลักฐานการโอน
              </span>
              {isInvalid && (
                <p className="text-sm text-red-500 font-bold animate-pulse">
                  กรุณาแนบสลิป‼
                </p>
              )}
            </h4>

            {!slipPreview ? (
              <div
                onClick={handleBoxClick}
                className={`group flex flex-col items-center justify-center w-full h-64 border-4 border-dashed rounded-[2rem] cursor-pointer transition-all bg-zinc-50 touch-manipulation active:scale-[0.98]
                  ${isInvalid ? "border-red-500 bg-red-50 animate-shake" : "border-black hover:bg-gray-50 hover:border-blue-500"}`}
              >
                <div className="flex flex-col items-center justify-center text-center p-6 pointer-events-none select-none">
                  <div
                    className={`p-6 rounded-full shadow-md group-hover:scale-110 transition-transform mb-4 ${isInvalid ? "bg-red-100" : "bg-white"}`}
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
                    <div className="space-y-1 opacity-70 font-bold text-xs uppercase mt-1">
                      <p>รองรับไฟล์ JPG, JPEG, PNG</p>
                      <p className="bg-zinc-200 px-2 py-1 rounded-md inline-block">
                        ขนาดไม่เกิน 2MB
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full min-h-[200px] max-h-[500px] border-4 border-black rounded-[2rem] overflow-hidden group shadow-lg">
                    <img
                    src={slipPreview}
                    alt="Slip Preview"
                    className="w-full h-auto max-h-[500px] object-scale-down p-2"
                    />
                <button
                  onClick={resetFile}
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
            accept="image/png, image/jpeg, image/jpg "
            onChange={onFileChange}
          />
        </div>
      </div>
    </section>
  );
};
