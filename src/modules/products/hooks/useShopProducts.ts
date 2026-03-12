// hooks/useProducts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getShopProducts,
  deleteProduct,
} from "@/modules/products/services/ShopProductService";
import { useShopProductStore } from "@/modules/products/hooks/useShopProductStore";
import { toast } from "react-hot-toast";

export const useShopProducts = () => {
  const queryClient = useQueryClient();
  const searchQuery = useShopProductStore((state) => state.searchQuery);

  const {
    data,
    isLoading: isFetching,
    isError,
  } = useQuery({
    queryKey: ["shop-products"],
    queryFn: getShopProducts,
  });

  //const featuredCount = data?.featuredProduct?.length || 0;

  const filteredFeatured = (data?.featuredProducts || []).filter((product) =>
    product.productName.toLowerCase().includes(searchQuery.toLowerCase()),
  );

 // const nonFeaturedCount = data?.nonFeaturedProduct?.length || 0;

  const filteredallproduct = (data?.allProducts|| []).filter(
    (product) =>
      product.productName.toLowerCase().includes(searchQuery.toLowerCase()),
  );
  const totalAll = filteredFeatured.length + filteredallproduct.length;

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
    featuredProducts: filteredFeatured, 
    nonFeaturedProducts: filteredallproduct,
    totalCount: data?.totalProducts || 0,
    totalAll,
    isLoading,
    isError,
    deleteProduct: deleteMutation.mutateAsync,
    editProduct: editMutation.mutate,
    isDeleting: deleteMutation.isPending,
    isEditing: editMutation.isPending,
  };
};
