import { useState } from "react";
import { createProduct } from "@/modules/products/services/ShopProductService";
import { CreateProductRequest } from "@/modules/products/homeproduct"
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";


export const useCreateProduct = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleCreate = async (payload: CreateProductRequest) => {
    setIsSubmitting(true);
    try {
      const response = await createProduct(payload);
      
      if (response.status.statusCode.includes("201")) {
        await queryClient.invalidateQueries({ queryKey: ['seller-shop-products'] });
        toast.success("ทำการเพิ่มสินค้าสำเร็จ");
        router.push("/seller/sellerproducts/");
        router.refresh();
        
      }
    } catch (error) {
      console.error("Create product failed:", error);
      toast.error("เกิดข้อผิดพลาดในการบันทึก");
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleCreate,
    isSubmitting
  };
};