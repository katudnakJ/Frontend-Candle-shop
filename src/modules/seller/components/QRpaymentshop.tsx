"use client";

import { QrCode, X } from "lucide-react";

interface QRpaymentshopProps {
  qrCodeImage: string | null;
  selectedFile: File | null;
  isImageLoading: boolean;
  isUploading: boolean;
  inputKey: number;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onTriggerFileInput: () => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage: () => void;
  onConfirm: () => void;
  setIsImageLoading: (loading: boolean) => void;
}

export default function QRpaymentshop({
  qrCodeImage,
  selectedFile,
  isImageLoading,
  isUploading,
  inputKey,
  fileInputRef,
  onTriggerFileInput,
  onImageChange,
  onClearImage,
  onConfirm,
  setIsImageLoading,
}: QRpaymentshopProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-6">
      <h2 className="text-xl font-bold text-black w-full text-left">
        ข้อมูลการรับชำระเงิน (QR Payment)
      </h2>

      <input
        key={inputKey}
        type="file"
        ref={fileInputRef}
        onChange={onImageChange}
        accept="image/png, image/jpeg, image/jpg"
        className="hidden"
      />

      {qrCodeImage ? (
        <div className="relative group w-full max-w-[600px] animate-in fade-in zoom-in duration-300">
          {isImageLoading && !selectedFile && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-50 border-2 border-black rounded-[2rem] animate-pulse">
              <div className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm font-bold text-black">กำลังโหลดรูปภาพ...</p>
              </div>
            </div>
          )}

          <img
            src={qrCodeImage}
            alt="PromptPay QR"
            onLoad={() => setIsImageLoading(false)}
            onError={() => setIsImageLoading(false)}
            className={`w-full aspect-[5/4] object-contain border-2 border-black rounded-[2rem] bg-zinc-50 p-2 transition-all duration-500 ${
              isImageLoading && !selectedFile ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
          />
          <button
            type="button"
            onClick={onClearImage}
            className="absolute -top-3 -right-3 bg-red-500 text-white p-2 rounded-full shadow-xl hover:bg-red-600 transition-all border-2 border-white active:scale-90"
          >
            <X size={20} />
          </button>
        </div>
      ) : (
        <div
          onClick={onTriggerFileInput}
          className="w-full max-w-[600px] aspect-[5/4] border-4 border-dashed border-gray-300 rounded-[2rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-black hover:bg-zinc-50 transition-all group active:scale-95"
        >
          <div className="p-5 bg-zinc-100 rounded-full group-hover:bg-cprojectone transition-colors">
            <QrCode size={40} className="text-gray-400 group-hover:text-black" />
          </div>
          <span className="font-black text-gray-500 group-hover:text-black text-center px-4">
            คลิกเพื่อเพิ่มรูป <br /> QR Code ธนาคาร
          </span>
        </div>
      )}

      {qrCodeImage && selectedFile && (
        <button
          onClick={onConfirm}
          disabled={isUploading}
          className={`mt-4 bg-black text-white px-10 py-3 rounded-full font-bold transition-all shadow-lg active:scale-95 
            ${isUploading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"}`}
        >
          {isUploading ? "กำลังบันทึก..." : "ยืนยันข้อมูล QR Payment"}
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
  );
}