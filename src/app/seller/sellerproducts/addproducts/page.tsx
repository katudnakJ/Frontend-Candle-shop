"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon, Plus, X } from "lucide-react";
import {
  productSchema,
  ProductFormValues,
} from "@/modules/products/schemas/productSchema"; // เช็ค Path ให้ถูกนะครับ
import { useProductImages } from "@/modules/products/hooks/useProductImages";
import { toast } from "react-hot-toast";
import SellerHeader from "@/components/layout/SellerHeader";
import Footer from "@/components/layout/Footer";
import { ProductHeader } from "@/modules/products/components/ProductHeader";
import ConfirmDialog from "@/components/commonui/ConfirmDialog";

export default function AddProductPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [tempData, setTempData] = useState<ProductFormValues | null>(null);

  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    images,
    onFileChange,
    removeImage,
    handleBoxClick,
    fileInputRef,
    inputKey,
    isCompressing,
    resetAll,
  } = useProductImages(3);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productName: "",
      description: "",
      weight: "",
      price: "",
      isActive: true,
    },
  });

  useEffect(() => {
    return () => resetAll();
  }, [resetAll]);

  const handleConfirm = (data: ProductFormValues) => {
    if (isCompressing) {
      toast.error("กรุณารอประมวลผลรูปภาพสักครู่");
      return;
    }
    if (images.length === 0) {
      toast.error("ต้องอัปโหลดรูปภาพสินค้าอย่างน้อย 1 รูป");
      return;
    }
    setTempData(data);
    setIsOpen(true);
  };
  const onSubmit = async () => {
    if (!tempData) return;

    setIsOpen(false);
    setIsSubmitting(true);
    try {
      const formData = new FormData();

      Object.entries(tempData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      images.forEach((imgObj) => {
        formData.append("images", imgObj.file);
      });

      console.log("🚀 ส่งข้อมูลสินค้าพร้อมรูปภาพ", images.length, "รูป");

      //   console.log("=== Check FormData Content ===");
      //   formData.forEach((value, key) => {
      //     if (value instanceof File) {
      //       console.log(`${key}: [File] - ${value.name} (${value.size} bytes)`);
      //     } else {
      //       console.log(`${key}: ${value}`);
      //     }
      //   });

      //   const formProps = Object.fromEntries(formData);
      //   console.log("FormData as Object:", formProps);
      // await productService.create(formData);

      toast.success("เพิ่มสินค้าสำเร็จ!");
      router.push("/seller/sellerproducts/");
      router.refresh();
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <SellerHeader />
      <main className="grow bg-white">
        <div className="max-w-[1200px] mx-auto p-4">
          <ProductHeader
            mode="sellerproducs"
            namemode="จัดการสินค้า / เพิ่มสินค้า"
            isAddProduct={true}
          />

          <div className="max-w-md mx-auto pb-24">
            <form
              onSubmit={handleSubmit(handleConfirm)}
              className="p-6 space-y-8"
            >
              <div className="space-y-3">
                <label className="text-sm font-bold ml-1 text-black">
                  รูปภาพสินค้า ({images.length}/3){" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="grid grid-cols-3 gap-3">
                  {/* แสดงรูปที่เลือกแล้ว */}
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
                      <span className="text-[10px] font-bold text-gray-400 mt-1">
                        เพิ่มรูป
                      </span>
                    </div>
                  )}
                </div>
                <input
                  key={inputKey}
                  type="file"
                  ref={fileInputRef}
                  onChange={onFileChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
              </div>

              <div className="space-y-5">
                <div className="flex flex-col">
                  <label className="text-sm font-bold ml-1 mb-1">
                    ชื่อสินค้า
                  </label>
                  <input
                    {...register("productName")}
                    placeholder="เช่น เทียนหอม Soy Wax"
                    className={`w-full p-3 border-2 rounded-xl outline-none transition-all ${
                      errors.productName
                        ? "border-red-500 bg-red-50"
                        : "border-black focus:bg-cprojecttwo focus:ring-2 focus:ring-black/5"
                    }`}
                  />
                  {errors.productName && (
                    <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                      {errors.productName.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col">
                  <label className="text-sm font-bold ml-1 mb-1">
                    รายละเอียดสินค้า
                  </label>
                  <textarea
                    {...register("description")}
                    rows={4}
                    placeholder="คำอธิบายสินค้า เช่น ช่วยทำให้ผ่อนคลาย..."
                    className={`w-full p-3 border-2 rounded-xl outline-none transition-all ${
                      errors.description
                        ? "border-red-500 bg-red-50"
                        : "border-black focus:bg-cprojecttwo focus:ring-2 focus:ring-black/5"
                    }`}
                  />
                  {errors.description && (
                    <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                      {errors.description.message}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="text-sm font-bold ml-1 mb-1">
                      น้ำหนัก
                    </label>
                    <div className="relative">
                      <input
                        {...register("weight")}
                        placeholder="0"
                        className={`w-full p-3 border-2 rounded-xl pr-10 outline-none transition-all ${
                          errors.weight
                            ? "border-red-500 bg-red-50"
                            : "border-black focus:bg-cprojecttwo focus:ring-2 focus:ring-black/5"
                        }`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs pointer-events-none">
                        Kg
                      </span>
                    </div>
                    {errors.weight && (
                      <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                        {errors.weight.message}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col">
                    <label className="text-sm font-bold ml-1 mb-1">
                      ราคา/ชิ้น
                    </label>
                    <div className="relative">
                      <input
                        {...register("price")}
                        placeholder="0"
                        className={`w-full p-3 border-2 rounded-xl pr-10 outline-none transition-all ${
                          errors.price
                            ? "border-red-500 bg-red-50"
                            : "border-black focus:bg-cprojecttwo focus:ring-2 focus:ring-black/5"
                        }`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs pointer-events-none">
                        บาท
                      </span>
                    </div>
                    {errors.price && (
                      <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                        {errors.price.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className=" bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-10 max-w-md mx-auto">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="flex-1 py-4 bg-[#E5B6A9] border-2 border-black rounded-2xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || isCompressing}
                  className="flex-1 py-4 bg-green-400 border-2 border-black rounded-2xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px] transition-all"
                >
                  {isSubmitting
                    ? "กำลังบันทึก..."
                    : isCompressing
                      ? "กำลังประมวลผลรูป..."
                      : "เพิ่มสินค้า"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
      <ConfirmDialog
        open={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={onSubmit}
        title="ยืนยันการเพิ่มสินค้า"
        content={
          <div className="text-center space-y-2 py-2">
            <p className="text-sm text-gray-500">คุณต้องการเพิ่มสินค้า</p>
            <p className="text-xl font-black text-cprojectthree break-words px-4">
              {tempData?.productName}
            </p>
            <p className="text-sm text-gray-500">
              ลงในรายการสินค้าของคุณใช่หรือไม่?
            </p>
          </div>
        }
        variant="primary"
      />
    </div>
  );
}
