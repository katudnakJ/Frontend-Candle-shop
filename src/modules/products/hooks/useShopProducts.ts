// hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getShopProducts,
  deleteProduct,
} from "@/modules/products/services/ShopProductService";
import { toast } from "react-hot-toast";

export const useShopProducts = () => {
  const queryClient = useQueryClient();

  const {
    data,
    isLoading: isFetching,
    isError,
  } = useQuery({
    queryKey: ["shop-products"],
    queryFn: getShopProducts,
  });
  const featuredCount = data?.featuredProduct?.length || 0;
  const nonFeaturedCount = data?.nonFeaturedProduct?.length || 0;
  const totalAll = featuredCount + nonFeaturedCount;

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-products"] });
      toast.success("ลบสินค้าสำเร็จ");
    },
    onError: () => toast.error("ไม่สามารถลบสินค้าได้"),
  });
  const editMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Editing...", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shop-products"] });
      toast.success("แก้ไขข้อมูลสำเร็จ");
    },
    onError: () => toast.error("แก้ไขไม่สำเร็จ"),
  });
  const isLoading =
    isFetching || deleteMutation.isPending || editMutation.isPending;
  return {
    featuredProducts: data?.featuredProduct || [],
    nonFeaturedProducts: data?.nonFeaturedProduct || [],
    totalCount: data?.nonFeaturedTotal || 0,
    totalAll,
    isLoading,
    isError,
    deleteProduct: deleteMutation.mutate,
    editProduct: editMutation.mutate,
    isDeleting: deleteMutation.isPending,
    isEditing: editMutation.isPending,
  };
};
