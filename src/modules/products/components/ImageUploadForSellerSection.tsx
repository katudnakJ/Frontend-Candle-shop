import { Plus, X } from "lucide-react";

interface ProductImage {
  file: File;
  preview: string;
}

interface ImageUploadSectionProps {
  images: ProductImage[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  handleBoxClick: () => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  inputKey: number;
}

export const ImageUploadSection = ({
  images,
  onFileChange,
  removeImage,
  handleBoxClick,
  fileInputRef,
  inputKey,
}: ImageUploadSectionProps) => {
  return (
    <div className="space-y-3">
      <label className="text-sm font-bold ml-1 text-black">
        รูปภาพสินค้า ({images.length}/3) <span className="text-red-500">*</span>
      </label>

      <div className="grid grid-cols-3 gap-3">
        {images.map((img, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-2xl border-2 border-black overflow-hidden group"
          >
            <img
              src={img.preview}
              alt="preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full border border-white shadow-lg"
            >
              <X size={14} />
            </button>
            {index === 0 && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] py-0.5 text-center font-bold">
                รูปหลัก
              </div>
            )}
          </div>
        ))}

        {images.length < 3 && (
          <div
            onClick={handleBoxClick}
            className="aspect-square rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-all"
          >
            <Plus size={24} className="text-gray-400" />
            <span className="text-[10px] max-[440px]:text-[9px] font-bold text-gray-400 mt-1 text-center">
              เพิ่มรูป <br /> ขนาดไม่เกิน 2 MB
            </span>
          </div>
        )}
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
