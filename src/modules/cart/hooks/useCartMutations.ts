import {
  AddShoppingCartItemReq,
  CartItem,
  ShoppingCartData,
} from "../shoppingcartInterface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  updateShoppingCartItem,
  deleteShoppingCartItem,
  DeleteShoppingCartItemReq,
} from "../services/ShoppingCartService";
import { toast } from "react-hot-toast";
import { Status } from "@/types/response.type";

type UpdateCartMutationPayload = AddShoppingCartItemReq & {
  shoppingCartItemId: string;
};

export const useUpdateCartLocal = () => {
  const queryClient = useQueryClient();
  
  return (itemId: string, newQty: number, page: number, size: number) => {
    const queryKey = ["shopping-cart", page, size];
    queryClient.setQueryData<ShoppingCartData>(queryKey, (old) => {
      if (!old) return old;
      return {
        ...old,
        cartItems: old.cartItems.map((item) =>
          item.shoppingCartItemId === itemId
            ? { ...item, quantity: newQty }
            : item
        ),
      };
    });
  };
};


export const useUpdateCartItem = (page: number = 0, size: number = 100) => {
  const queryClient = useQueryClient();
  const queryKey = ["shopping-cart", page, size];

  return useMutation({
    mutationFn: (payload: UpdateCartMutationPayload) => {
      const { shoppingCartItemId, ...apiPayload } = payload;
      return updateShoppingCartItem(apiPayload);
    },

    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey });
      const previousCart = queryClient.getQueryData<ShoppingCartData>(queryKey);

      queryClient.setQueryData<ShoppingCartData>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          cartItems: old.cartItems.map((item) =>
            item.shoppingCartItemId === newData.shoppingCartItemId
              ? { ...item, quantity: newData.quantity }
              : item,
          ),
        };
      });

      return { previousCart };
    },

    onError: (error: Status, newData, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKey, context.previousCart);
      }
      const err = error as Status;
      const message = err.message ?? "การเชื่อมต่อขัดข้อง";
      toast.error(message, {
        id: "update-cart-error",
      });
      if (process.env.NODE_ENV === "development") {
        console.error(
          `[UpdateCart Error] Status: ${err?.statusCode ?? 'N/A'}, Remark: ${err?.remark ?? 'Client Error'}`
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};

export const useDeleteCartItem = (page: number = 0, size: number = 100) => {
  const queryClient = useQueryClient();
  const queryKey = ["shopping-cart", page, size];

  return useMutation({
    mutationFn: (payload: DeleteShoppingCartItemReq) =>
      deleteShoppingCartItem(payload),

    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey });
      const previousCart = queryClient.getQueryData<ShoppingCartData>(queryKey);

      queryClient.setQueryData<ShoppingCartData>(queryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          cartItems: old.cartItems.filter(
            (item) => item.shoppingCartItemId !== payload.shoppingCartItemId,
          ),
        };
      });

      return { previousCart };
    },

    onError: (error: Status, itemId, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKey, context.previousCart);
      }
      const err = error as Status;
      const message = err.message ?? "การเชื่อมต่อขัดข้อง";
      toast.error(message, {
        id: "delete-cart-error",
      });
      if (process.env.NODE_ENV === "development") {
        console.error(
          `[DeleteCart Error] Status: ${err?.statusCode ?? 'N/A'}, Remark: ${err?.remark ?? 'Client Error'}`
        );
      }
    },

    onSuccess: () => {
      toast.success("ลบสินค้าเรียบร้อย");
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey });
    },
  });
};
