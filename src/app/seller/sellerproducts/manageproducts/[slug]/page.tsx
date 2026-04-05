"use client";

import { ImageUploadSection } from "@/modules/products/components/ImageUploadForSellerSection";
import { ProductFormFields } from "@/modules/products/components/ProductFormFieldsforseller";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productSchema,
  ProductFormValues,
} from "@/modules/products/schemas/productSchema";
import { useProductImages } from "@/modules/products/hooks/useProductImages";
import { toast } from "react-hot-toast";
import { ProductHeader } from "@/modules/products/components/ProductHeader";
import { useCreateProduct } from "@/modules/products/hooks/useCreateProduct";
import { CreateProductRequest } from "@/modules/products/homeproduct";
import { useSearchParams } from "next/navigation";
import {
  useShopProductDetail,
  useUpdateProduct,
} from "@/modules/products/hooks/useShopProducts";

import Footer from "@/components/layout/Footer";
import SellerHeader from "@/components/layout/SellerHeader";
import ConfirmDialog from "@/components/commonui/ConfirmDialog";

export default function ManageProductsPage() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const router = useRouter();
  const params = useParams();

  const productSlug = params.slug;
  const isEditMode = useMemo(
    () => !!(productSlug && productSlug !== "add" && productId),
    [productSlug, productId],
  );

  const [isOpen, setIsOpen] = useState(false);
  const [isRMOpen, setIsRMOpen] = useState(false);
  const { handleCreate, isSubmitting } = useCreateProduct();
  const { handleUpdate, isUpdating } = useUpdateProduct();
  const [tempData, setTempData] = useState<ProductFormValues | null>(null);
  const [imageIndexToDelete, setImageIndexToDelete] = useState<number | null>(
    null,
  );
  const isBusy = isSubmitting || isUpdating;

  const {
    images,
    inputKey,
    fileInputRef,
    isCompressing,
    resetAll,
    setImages,
    onFileChange,
    removeImage,
    handleBoxClick,
    setPrimaryImage,
  } = useProductImages(3);

  const {
    data: detailData,
    isLoading: isFetchingDetail,
    isError: isDetailError,
    error,
  } = useShopProductDetail(productId || "");

  console.log("RAWPRODUCTDETAIL", detailData);
  if (isDetailError) {
    if (process.env.NODE_ENV === "development") {
      console.log("สาเหตุการพัง:", error);
    }
  }

  useEffect(() => {
    if (productSlug && productSlug !== "add" && !productId) {
      router.replace("/seller/sellerproducts");
    }
  }, [productSlug, productId, router]);

  useEffect(() => {
    if (isDetailError) {
      toast.error("ไม่พบข้อมูลสินค้า");
      router.replace("/seller/sellerproducts");
    }
  }, [isDetailError, router]);

  useEffect(() => {
    if (isEditMode && detailData && productSlug) {
      const actualSlug = detailData.product.slug;

      if (actualSlug !== productSlug) {
        if (process.env.NODE_ENV === "development") {
          console.warn("Slug mismatch detected. Redirecting to correct URL.");
        }

        router.replace(
          `/seller/sellerproducts/manageproducts/${actualSlug}?productId=${productId}`,
        );
      }
    }
  }, [detailData, isEditMode, productSlug, productId, router]);

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
      active: true,
    },
  });

  useEffect(() => {
    if (isEditMode && detailData) {
      const { product, productImages } = detailData;

      reset({
        productName: product.productName,
        description: product.description,
        weight: String(product.weight),
        price: String(product.price),
        active: product.active === true,
      });

      if (productImages) {
        const mappedImages = productImages.map((img) => ({
          file: new File([], "existing-file"),
          preview: img.productImgPath,
          isPrimary: img.isPrimary,
          productImgId: img.productImgId,
        }));

        const sortedImages = [...mappedImages].sort((a, b) => {
        if (a.isPrimary) return -1;
        if (b.isPrimary) return 1;
        return 0;
      });  

        setImages(sortedImages);
      }
    }
  }, [detailData, isEditMode, reset, setImages]);

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

  //====================================================================

  const onSubmit = async () => {
    if (!tempData) return;

    setIsOpen(false);
    try {
      const originalImageIds =
        detailData?.productImages?.map((img) => img.productImgId) || [];

      const currentImageIds = images
        .map((img) => img.productImgId)
        .filter((id): id is string => !!id);

      const deleteImageIds = originalImageIds.filter(
        (id) => !currentImageIds.includes(id),
      );
      const newImagesList = images.filter((img) => !img.productImgId);

      const primaryImageInUI = images[0];
      const originalPrimaryImgId = detailData?.productImages?.find(img => img.isPrimary)?.productImgId;

      let finalExistIntoPrimary = "";
      let finalPrimaryIndex: number | string = "";

      if (isEditMode) {
        if (primaryImageInUI?.productImgId) {
          // --- เคส A: เอารูปเก่าขึ้นเป็นรูปหลัก ---
          
          if (primaryImageInUI.productImgId === originalPrimaryImgId) {
          
            finalExistIntoPrimary = "";
          } else {
           
            finalExistIntoPrimary = primaryImageInUI.productImgId;
          }
          finalPrimaryIndex = "";
        } else {
          // --- เคส B: เอารูปใหม่ที่เพิ่งอัปโหลดขึ้นเป็นรูปหลัก ---
          finalExistIntoPrimary = "";
          const indexInNewImages = newImagesList.findIndex(
            (img) => img === primaryImageInUI,
          );
          finalPrimaryIndex = indexInNewImages !== -1 ? indexInNewImages : 0;
        }
      } else {
        // --- เคสเพิ่มสินค้าใหม่ (Add Mode) ---
        finalExistIntoPrimary = "";
        finalPrimaryIndex = 0;
      }
      const payload: CreateProductRequest = {
        productName: tempData.productName,
        description: tempData.description,
        price: Number(tempData.price),
        weight: Number(tempData.weight),
        active: tempData.active,
        featured:
          isEditMode && detailData
            ? (detailData.product.featured ?? false)
            : false,
        primary_index: finalPrimaryIndex,
          imagesData: images
          .filter((img) => !img.productImgId)
          .map((img) => img.file),
      };

      if (isEditMode && productId) {
        if (process.env.NODE_ENV === "development") {
          console.log("===== 📝 LOGIC CHECK: PRE-SUBMISSION =====");
          console.log("ProductName", tempData.productName);
          console.log("Description", payload.productName);
          console.log("Price", payload.price);
          console.log("Weight", payload.weight);
          console.log("Active", payload.active);
          console.log("Featured", payload.featured);
          console.log("Original Image IDs:", originalImageIds);
          console.log("Current Image IDs (from UI):", currentImageIds);
          console.log(">>> Result - deleteImageIds:", deleteImageIds);
          console.log(
            "Primary Image Type:",
            finalExistIntoPrimary ? "SERVER_IMAGE" : "NEW_BLOB_IMAGE",
          );
          console.log(">>> Result - existIntoPrimary:", finalExistIntoPrimary);
          console.log(
            "New Files to Upload (imagesData):",
            images.filter((img) => !img.productImgId).length,
          );
          console.log("==========================================");
        }
        await handleUpdate({
          id: productId,
          payload,
          deleteImageIds,
          existIntoPrimary: finalExistIntoPrimary,
        });
      } else {
        await handleCreate(payload);
      }
      if (isEditMode) {
        console.log("Edit Product Success");
      } else {
        console.log("Add Product Success");
      }
    } catch (error) {
      console.error("Submission failed in Page:", error);
    }
  };

  if (isFetchingDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
        <p className="mt-4 font-bold">กำลังเตรียมข้อมูลสินค้า...</p>
      </div>
    );
  }

  if (isEditMode && !detailData) return null;

  return (
    <div className="flex flex-col w-full min-h-screen bg-white">
      <SellerHeader />
      <main className="grow bg-white">
        <div className="max-w-300 mx-auto p-4">
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
                  isEditMode={isEditMode}
                  setPrimaryImage={setPrimaryImage}
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
                  className="flex-1 py-4 bg-[#E5B6A9] border-2 border-black rounded-2xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={isBusy || isCompressing}
                  className="flex-1 py-4 bg-green-400 border-2 border-black rounded-2xl font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer"
                >
                  {isBusy
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
            <p className="text-xl font-black text-cprojectthree wrap-break-word px-4">
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
