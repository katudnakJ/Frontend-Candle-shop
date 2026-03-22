"use client";

import { Pencil, QrCode, RotateCcw } from "lucide-react";
import Image from "next/image";

interface QRpaymentshopProps {
  qrCodeImage: string | null;
  hasExistingImage?: boolean;
  selectedFile: File | null;
  isImageLoading: boolean;
  isUploading: boolean;
  inputKey: number;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onTriggerFileInput: () => void;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onClearImage?: () => void;
  onUndoImage: () => void;
  onConfirm: () => void;
  setIsImageLoading: (loading: boolean) => void;
}

export default function QRpaymentshop({
  qrCodeImage,
  hasExistingImage,
  selectedFile,
  isUploading,
  inputKey,
  fileInputRef,
  onTriggerFileInput,
  onImageChange,
  onUndoImage,
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

       <div
  onClick={onTriggerFileInput}
  className={`relative w-full max-w-[600px] border-4 border-dashed border-gray-300 rounded-[2rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-black hover:bg-zinc-50 transition-all group active:scale-95 overflow-hidden ${hasExistingImage ? "h-auto" : "min-h-[320px]"}`}
>
  {(hasExistingImage || selectedFile) && qrCodeImage ? (
    <>
      <Image
        src={qrCodeImage}
        alt="QR Code"
        className="block w-full h-auto object-contain p-4"
        onLoad={() => setIsImageLoading(false)}
        onError={() => setIsImageLoading(false)}
        priority
        width={180}
        height={180}
      />
      
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
        <Pencil className="opacity-0 group-hover:opacity-100 transition-opacity font-black text-white text-sm" 
          size={25} color="#ffffff"
          />
        <span className="opacity-0 group-hover:opacity-100 transition-opacity font-black text-white text-shadow-black text-shadow-2xs text-lg ml-5">
          เปลี่ยนรูป
        </span>
      </div>
    </>
  ) : (
    <>
      <div className="p-5 bg-zinc-100 rounded-full group-hover:bg-cprojectone transition-colors">
        <QrCode size={40} className="text-gray-400 group-hover:text-black" />
      </div>
      <span className="font-black text-gray-500 group-hover:text-black text-center px-4">
        คลิกเพื่อเพิ่มรูป <br /> QR Code ธนาคาร
      </span>
    </>
  )}
</div>

      {qrCodeImage && selectedFile && (
        <>  
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6"> 
           <button
             onClick={onUndoImage}
             className="w-full sm:w-auto bg-gray-100 text-gray-800 px-8 py-3 rounded-full font-bold transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 hover:bg-gray-200"
           >
             <RotateCcw className="w-4 h-4 shrink-0" />
             <span className="whitespace-nowrap">ใช้รูปเดิม</span>
           </button>

           {/* ปุ่มยืนยัน */}
           <button
             onClick={onConfirm}
             disabled={isUploading}
             className={`w-full sm:w-auto bg-black text-white px-10 py-3 rounded-full font-bold transition-all shadow-lg active:scale-95 
               ${isUploading ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-800"}`}
           >
             {isUploading ? "กำลังบันทึก..." : "ยืนยันข้อมูล QR Payment"}
           </button>
          </div>
        </>
      )}
    </div>
  );
}
