// @/modules/cart/hooks/useCartMutations.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateShoppingCartItem, deleteShoppingCartItem } from "../services/ShoppingCartService";
import { toast } from "react-hot-toast";

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateShoppingCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-cart"] });
    },
    onError: () => toast.error("อัปเดตจำนวนไม่สำเร็จ"),
  });
};

export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteShoppingCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-cart"] });
      toast.success("ลบสินค้าเรียบร้อย");
    },
    onError: () => toast.error("ลบไม่สำเร็จ"),
  });
};