import { ImageIcon, Plus, X } from "lucide-react";
import Image from "next/image";

export interface ProductImage {
  file: File;
  preview: string;
  productImgId?: string;
}

interface ImageUploadSectionProps {
  images: ProductImage[];
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  inputKey: number;
  isEditMode: boolean;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  handleBoxClick: () => void;
  setPrimaryImage: (index: number) => void;
}

export const ImageUploadSection = ({
  images,
  fileInputRef,
  inputKey,
  isEditMode,
  onFileChange,
  removeImage,
  handleBoxClick,
  setPrimaryImage,
}: ImageUploadSectionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex   max-[470px]:flex-col justify-between items-end max-[470px]:items-start px-1">
        <label className="text-lg font-black text-black flex items-center gap-2">
          <ImageIcon size={20} />
          รูปภาพสินค้า
          <span className="text-sm font-bold text-gray-500">
            ({images.length}/3)
          </span>
        </label>
        <span className="flex  text-xs font-bold text-red-500">
          * จำเป็นต้องอัปโหลดรูปอย่างน้อย 1 รูป
        </span>
      </div>

      <div className="grid grid-cols-12 grid-rows-4 gap-3 aspect-[4/3] w-full">
        {/* รูปหลัก  */}
        <div className="col-span-8 row-span-4 relative">
          {images[0] ? (
            <div className="w-full h-full rounded-3xl border-2 border-black overflow-hidden bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative group">
              <Image
                src={images[0].preview}
                alt="Main preview"
                fill
                priority
                unoptimized
                className="object-cover"
              />
              <div className="absolute top-2 left-2 bg-yellow-300 border-2 border-black px-3 py-1 rounded-full text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                รูปหลัก {images[0]?.productImgId ? "(จาก Server)" : "(รูปใหม่)"}
              </div>
              {!isEditMode && (
                <button
                  type="button"
                  onClick={() => removeImage(0)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          ) : (
            <div
              onClick={handleBoxClick}
              className="w-full h-full rounded-3xl border-4 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all gap-2"
            >
              <div className="p-4 bg-white rounded-full border-2 border-gray-200 shadow-sm">
                <Plus size={32} className="text-gray-400" />
              </div>
              <p className="text-xs font-black text-gray-400">
                เพิ่มรูปภาพหลัก
              </p>
            </div>
          )}
        </div>

        {/* รูปย่อย  */}
        {[1, 2].map((idx) => (
          <div key={idx} className="col-span-4 row-span-2 relative group">
            {images[idx] ? (
              <div className="w-full h-full rounded-2xl border-2 border-black overflow-hidden bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative">
                <Image
                  src={images[idx].preview}
                  alt={`preview ${idx}`}
                  fill
                  unoptimized
                  className="object-cover"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(idx);
                  }}
                  className="absolute top-1 right-1  bg-red-500 text-white p-1 rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all cursor-pointer z-20"
                >
                  <X size={14} />
                </button>
                <div
                  onClick={() => {
                    setPrimaryImage(idx);
                  }}
                  className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer gap-1 z-10"
                >
                  <ImageIcon size={20} className="text-white" />
                  <span className="text-[10px] font-black text-white bg-black/50 px-2 py-0.5 rounded">
                    ใช้เป็นรูปหลัก
                  </span>
                </div>
              </div>
            ) : (
              <div
                onClick={images.length >= idx ? handleBoxClick : undefined}
                className={`w-full h-full rounded-2xl border-4 border-dashed flex flex-col items-center justify-center transition-all gap-1
                  ${
                    images.length >= idx
                      ? "border-gray-300 bg-gray-50 cursor-pointer hover:bg-gray-100"
                      : "border-gray-100 bg-gray-50/50 cursor-not-allowed"
                  }`}
              >
                <Plus size={20} className="text-gray-300" />
                <span className="text-[10px] font-bold text-gray-300 text-center">
                  รูปที่ {idx + 1}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="bg-blue-50 border-2 border-blue-200 p-3 rounded-xl flex items-center gap-3">
        <div className="text-blue-500 bg-white p-1.5 rounded-lg border border-blue-200">
          <ImageIcon size={16} />
        </div>
        <p className="text-[11px] font-bold text-blue-700">
          คำแนะนำ: อัปโหลดรูปภาพขนาดไม่เกิน 2MB (รองรับ PNG, JPG, JPEG) <br />
          รูปภาพแรกจะถูกใช้เป็นรูปภาพหน้าปกของสินค้า
        </p>
      </div>

      <input
        key={inputKey}
        type="file"
        ref={fileInputRef}
        onChange={onFileChange}
        accept="image/png, image/jpeg, image/jpg"
        multiple
        className="hidden"
      />
    </div>
  );
};
