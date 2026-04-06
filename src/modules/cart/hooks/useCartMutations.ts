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
import { InfiniteData } from "@tanstack/react-query";
import { GenericResponse } from "@/types/response.type";

type UpdateCartMutationPayload = AddShoppingCartItemReq & {
  shoppingCartItemId: string;
};

//ต้องตรงกับ size ที่ useCart
const sizesameinuseCart = 10;

export const useUpdateCartLocal = () => {
  const queryClient = useQueryClient();

  return (itemId: string, newQty: number) => {
    const queryKey = ["shopping-cart", sizesameinuseCart];
    queryClient.setQueryData<InfiniteData<GenericResponse<ShoppingCartData>>>(
      queryKey,
      (old) => {
       
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => {

            const target = page.data || page;
            if (!target?.cartItems) {
              return page;
            }

            const updatedItems = target.cartItems?.map((item: CartItem) =>
              item.shoppingCartItemId === itemId
                ? { ...item, quantity: newQty }
                : item,
            );

            return page.data
              ? { ...page, data: { ...page.data, cartItems: updatedItems } }
              : { ...page, cartItems: updatedItems };
          }),
        };
      },
    );
  };
};

export const useUpdateCartItem = (size: number = sizesameinuseCart) => {
  const queryClient = useQueryClient();
  const queryKey = ["shopping-cart", size];

  return useMutation({
    mutationFn: (payload: UpdateCartMutationPayload) => {
      const { shoppingCartItemId, ...apiPayload } = payload;
      return updateShoppingCartItem(apiPayload);
    },

    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey });
      const previousCart =
        queryClient.getQueryData<
          InfiniteData<GenericResponse<ShoppingCartData>>
        >(queryKey);

      queryClient.setQueryData<InfiniteData<GenericResponse<ShoppingCartData>>>(
        queryKey,
        (old) => {
          
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => {
             
              const target = page.data || page;
              
              const updatedItems = target.cartItems?.map((item: CartItem) =>
                item.shoppingCartItemId === newData.shoppingCartItemId
                  ? { ...item, quantity: newData.quantity }
                  : item,
              );

              return page.data
                ? { ...page, data: { ...page.data, cartItems: updatedItems } }
                : { ...page, cartItems: updatedItems };
            }),
          };
        },
      );

      return { previousCart };
    },

    onError: (error: Status, newData, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKey, context.previousCart);
      }
      const err = error as Status;
      const message = "การเชื่อมต่อขัดข้อง";
      toast.error(message, {
        id: "update-cart-error",
      });
      
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-cart"] });
    },
  });
};

export const useDeleteCartItem = (size: number = sizesameinuseCart) => {
  const queryClient = useQueryClient();
  const queryKey = ["shopping-cart", size];

  return useMutation({
    mutationFn: (payload: DeleteShoppingCartItemReq) =>
      deleteShoppingCartItem(payload),

    onMutate: async (payload) => {
      await queryClient.cancelQueries({ queryKey });
      const previousCart =
        queryClient.getQueryData<
          InfiniteData<GenericResponse<ShoppingCartData>>
        >(queryKey);

      queryClient.setQueryData<InfiniteData<GenericResponse<ShoppingCartData>>>(
        queryKey,
        (old) => {
           
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => {
             
              const target = page.data || page;

                if (!target?.cartItems) {
              return page;
            }
              const updatedItems = target.cartItems?.filter(
                (item: CartItem) =>
                  item.shoppingCartItemId !== payload.shoppingCartItemId,
              );

              // คำนวณจำนวนรวมใหม่
              const newTotal = Math.max(0, (target.totalItems || 0) - 1);

              return page.data
                ? {
                    ...page,
                    data: {
                      ...page.data,
                      cartItems: updatedItems,
                      totalItems: newTotal,
                    },
                  }
                : { ...page, cartItems: updatedItems, totalItems: newTotal };
            }),
          };
        },
      );

      return { previousCart };
    },

    onError: (error: Status, itemId, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(queryKey, context.previousCart);
      }
      const err = error as Status;
      const message = "การเชื่อมต่อขัดข้อง";
      toast.error(message, {
        id: "delete-cart-error",
      });
      if (process.env.NODE_ENV === "development") {
        console.error(
          `[DeleteCart Error] Status: ${err?.statusCode ?? "N/A"}, Remark: ${err?.remark ?? "Client Error"}`,
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
