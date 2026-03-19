import { AddShoppingCartItemReq, CartItem } from "../shoppingcartInterface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateShoppingCartItem, deleteShoppingCartItem, DeleteShoppingCartItemReq } from "../services/ShoppingCartService";
import { toast } from "react-hot-toast";
import { Status } from "@/types/response.type";

type UpdateCartMutationPayload = AddShoppingCartItemReq & { 
  shoppingCartItemId: string 
};

export const useUpdateCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
   mutationFn: (payload: UpdateCartMutationPayload) => {
      const { shoppingCartItemId, ...apiPayload } = payload; 
      return updateShoppingCartItem(apiPayload);
    },

   onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: ["shopping-cart"] });
      const previousCart = queryClient.getQueryData<CartItem []>(["shopping-cart"]);

      queryClient.setQueryData<CartItem []>(["shopping-cart"], (old) =>
        old?.map((item) =>
          item.shoppingCartItemId === newData.shoppingCartItemId
            ? { ...item, quantity: newData.quantity }
            : item
        )
      );

      return { previousCart }; 
    },
    onError: (error: Status, newData, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["shopping-cart"], context.previousCart);
      }
      const err = error as Status;
      const message = err.message ?? "การเชื่อมต่อขัดข้อง";
        toast.error(message, {
        id: "update-cart-error",
      });
      if (process.env.NODE_ENV === "development") {
        console.error(
          `[UpdateCart Error] Status: ${err.statusCode}, Remark: ${err.remark}`,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-cart"] });
    },
  });
};

export const useDeleteCartItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeleteShoppingCartItemReq) => deleteShoppingCartItem(payload),

    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey: ["shopping-cart"] });
      const previousCart = queryClient.getQueryData<CartItem []>(["shopping-cart"]);

      queryClient.setQueryData<CartItem []>(["shopping-cart"], (old) =>
        old?.filter((item) => item.shoppingCartItemId !== payload.shoppingCartItemId)
      );

      return { previousCart };
    },

    onError: (error : Status, itemId, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["shopping-cart"], context.previousCart);
      }
      const err = error as Status;
      const message = err.message ?? "การเชื่อมต่อขัดข้อง";
        toast.error(message, {
        id: "delete-cart-error",
      });
      if (process.env.NODE_ENV === "development") {
        console.error(
          `[DeleteCart Error] Status: ${err.statusCode}, Remark: ${err.remark}`,
        );
      }
    },

    onSuccess: () => {
      toast.success("ลบสินค้าเรียบร้อย");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-cart"] });
    },
  });
};