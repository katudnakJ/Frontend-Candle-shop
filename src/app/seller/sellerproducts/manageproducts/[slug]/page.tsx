"use client";

import { ImageUploadSection } from "@/modules/products/components/ImageUploadForSellerSection";
import { ProductFormFields } from "@/modules/products/components/ProductFormFieldsforseller";

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
  const [isRMOpen, setIsRMOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(isEditMode);
  const [tempData, setTempData] = useState<ProductFormValues | null>(null);
  const [imageIndexToDelete, setImageIndexToDelete] = useState<number | null>(
    null,
  );

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

  const handleConfirmDetailForm = (data: ProductFormValues) => {
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

  const handleAskRemove = (ID: number) => {
    setImageIndexToDelete(ID);
    setIsRMOpen(true);
  };
  const handleConfirmRemove = () => {
    if (imageIndexToDelete != null) {
      removeImage(imageIndexToDelete);
      setImageIndexToDelete(null);
    }
    setIsRMOpen(false);
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
              onSubmit={handleSubmit(handleConfirmDetailForm)}
              className="p-6 space-y-8"
            >
              <section>
                <ImageUploadSection
                  images={images}
                  onFileChange={onFileChange}
                  removeImage={handleAskRemove}
                  handleBoxClick={handleBoxClick}
                  fileInputRef={fileInputRef}
                  inputKey={inputKey}
                />
              </section>

              <section>
                <ProductFormFields
                  register={register}
                  errors={errors}
                  control={control}
                  isEditMode={!!isEditMode}
                />
              </section>

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
      <ConfirmDialog
        open={isRMOpen}
        onClose={() => setIsRMOpen(false)}
        onConfirm={handleConfirmRemove}
        title={"ยืนยันการลบรูปภาพสินค้า"}
        content={
          <div className="text-center space-y-2 py-2">
            <p className="text-sm text-gray-500">คุณต้องการลบรูปภาพสินค้า</p>

            <p className="text-sm text-gray-500">ใช่หรือไม่?</p>
          </div>
        }
        variant="danger"
      />
    </div>
  );
}
