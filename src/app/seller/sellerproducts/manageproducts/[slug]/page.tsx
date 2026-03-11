"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Image as ImageIcon, Plus, X } from "lucide-react";
import {
  productSchema,
  ProductFormValues,
} from "@/modules/products/schemas/productSchema";

import {
  TextField,
  Autocomplete,
  Switch,
  FormControlLabel,
  Typography,
} from "@mui/material";
import { useProductImages } from "@/modules/products/hooks/useProductImages";
import { toast } from "react-hot-toast";
import SellerHeader from "@/components/layout/SellerHeader";
import Footer from "@/components/layout/Footer";
import { ProductHeader } from "@/modules/products/components/ProductHeader";
import ConfirmDialog from "@/components/commonui/ConfirmDialog";

export default function ManageProductsPage() {
  const router = useRouter();
  const params = useParams();

  const productSlug = params.slug;
  const isEditMode = useMemo(
    () => productSlug && productSlug !== "add",
    [productSlug],
  );

  const [isOpen, setIsOpen] = useState(false);
  const [tempData, setTempData] = useState<ProductFormValues | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(isEditMode);

  const {
    images,
    onFileChange,
    removeImage,
    handleBoxClick,
    fileInputRef,
    inputKey,
    isCompressing,
    resetAll,
    setImages,
  } = useProductImages(3);

  const {
    register,
    handleSubmit,
    reset,
    control,
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

  // ====================================================================
  //   : ตรงนี้ รอเปลี่ยนไปใช้ Services API กับ  Interface ของ Product Detail
  //   : Mock อันนี้ ใช้จำลองว่าเปลี่ยนหน้าไป  แก้ไขได้ก่อน
  //   : ต้องมีช่อง กรอก slug ไหม
  //   : อาจมีการกลับมาแก้ไข กรณีว่า กดแก้ไข แต่รูปไม่ได้แก้ไข จะต้องส่งกลับไปยังไงได้บ้าง
  //      กรณีที่ 1: ส่ง Path URL เดิมกลับไปเลย
  //      กรณีที่ 2: ไม่ส่งฟิลด์นี้กลับไปเลย
  //      กรณีที่ 3: วิธี "ส่ง ImageID"
  //      กรณีที่ 4: การใช้ Flag "Delete List"
  // ====================================================================

  useEffect(() => {
    if (isEditMode && productSlug) {
      const fetchInitialData = async () => {
        if (!isEditMode) {
          setIsLoadingData(false);
          return;
        }
        try {
          const mockData = {
            productName: "สินค้าเดิมจากระบบ",
            description: "รายละเอียดเดิม...",
            weight: "1.5",
            price: "500",
            images: ["https://example.com/photo1.jpg"], // URL รูปเดิม
          };

          // ยัดข้อมูลใส่ฟอร์ม
          reset({
            productName: mockData.productName,
            description: mockData.description,
            weight: mockData.weight,
            price: mockData.price,
            isActive: true,
          });

          // ยัดรูปเดิมเข้า useProductImages Hook
          if (mockData.images) {
            const prevImages = mockData.images.map((url) => ({
              file: new File([], "existing-file"), // สร้าง File หลอกไว้
              preview: url,
            }));
            setImages(prevImages);
          }
        } catch (error) {
          toast.error("ไม่สามารถโหลดข้อมูลสินค้าได้");
          router.push("/seller/sellerproducts");
        } finally {
          setIsLoadingData(false);
        }
      };
      fetchInitialData();
    }
  }, [isEditMode, productSlug, reset, setImages, router]);

  useEffect(() => {
    return () => resetAll();
  }, [resetAll]);

  const handleConfirm = (data: ProductFormValues) => {
    if (isCompressing) {
      toast.error("กรุณารอประมวลผลรูปภาพสักครู่");
      return;
    }

    // images.forEach((imgObj) => {
    //   if (imgObj.file.size > 2 * 1024 * 1024) {
    //     return "กรุณาใช้ไฟล์ขนาดไม่เกิน 2MB";
    //   }
    // });

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
        if (imgObj.file.size > 0) {
          formData.append("images", imgObj.file);
        }
      });

      const existingImages = images
        .filter((img) => img.file.size === 0)
        .map((img) => img.preview);

      formData.append("existingImages", JSON.stringify(existingImages));

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

      if (isEditMode) {
        toast.success("แก้ไขสินค้าสำเร็จ!");
      } else {
        toast.success("เพิ่มสินค้าสำเร็จ!");
      }

      router.push("/seller/sellerproducts/");
      router.refresh();
    } catch (error) {
      toast.error("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        <p className="mt-4 font-bold">กำลังเตรียมข้อมูลสินค้า...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <SellerHeader />
      <main className="grow bg-white">
        <div className="max-w-[1200px] mx-auto p-4">
          <ProductHeader
            mode="sellerproducs"
            namemode={
              isEditMode
                ? "จัดการสินค้า / แก้ไขสินค้า"
                : "จัดการสินค้า / เพิ่มสินค้า"
            }
            isAddEditProduct={true}
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
                      <span className="text-[10px] font-bold text-gray-400 mt-1 text-center">
                        เพิ่มรูป
                        <br />
                        ขนาดไม่เกิน 2 MB
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

              {isEditMode && (
                <div className="flex items-center gap-3 py-4 px-1 bg-gray-50 rounded-2xl mb-4">
                  <Controller
                    name="isActive"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                      <FormControlLabel
                        className="ml-0"
                        control={
                          <Switch
                            checked={value}
                            onChange={(e) => onChange(e.target.checked)}
                            color="success"
                            sx={{
                              "& .MuiSwitch-switchBase.Mui-checked": {
                                color: "#4ADE80",
                              },
                              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                                {
                                  backgroundColor: "#4ADE80",
                                },
                            }}
                          />
                        }
                        label={
                          <div className="flex flex-col ml-2">
                            <Typography className="font-black text-sm font-prompt">
                              สถานะการขาย:{" "}
                              {value ? "เปิดใช้งาน" : "ปิดชั่วคราว"}
                            </Typography>
                            <Typography className="text-[10px] text-gray-500 font-prompt">
                              {value
                                ? "สินค้าจะแสดงบนหน้าร้านค้าตามปกติ"
                                : "ลูกค้าจะไม่สามารถกดสั่งซื้อสินค้านี้ได้"}
                            </Typography>
                          </div>
                        }
                      />
                    )}
                  />
                </div>
              )}

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
                    : isEditMode
                      ? "บันทึกการแก้ไข"
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
        title={isEditMode ? "ยืนยันการแก้ไขสินค้า" : "ยืนยันการเพิ่มสินค้า"}
        content={
          <div className="text-center space-y-2 py-2">
            <p className="text-sm text-gray-500">
              คุณต้องการ{isEditMode ? "แก้ไข" : "เพิ่ม"}สินค้า
            </p>
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
