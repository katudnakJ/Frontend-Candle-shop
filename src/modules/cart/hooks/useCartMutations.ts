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
        if (process.env.NODE_ENV === "development") {
          console.log("1. Old Cache Data:", old);
        }
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page, index) => {
            if (process.env.NODE_ENV === "development") {
              console.log(`2. Page ${index} structure:`, page);
            }

            const target = page.data || page;
            if (process.env.NODE_ENV === "development") {
              console.log(
                `3. Target cartItems in Page ${index}:`,
                target?.cartItems,
              );
            }
            if (!target?.cartItems) {
              console.error("❌ ERROR: cartItems not found in this structure!");
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
          if (process.env.NODE_ENV === "development") {
            console.log("4. Old UpdateCart Data:", old);
          }
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => {
              if (process.env.NODE_ENV === "development") {
                console.log("5. Page UpdateCart structure:", page);
              }
              const target = page.data || page;
              if (process.env.NODE_ENV === "development") {
                console.log(
                  "6. Target UpdateCart in Page :",
                  target?.cartItems,
                );
              }
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
      const message = err.message ?? "การเชื่อมต่อขัดข้อง";
      toast.error(message, {
        id: "update-cart-error",
      });
      if (process.env.NODE_ENV === "development") {
        console.error(
          `[UpdateCart Error] Status: ${err?.statusCode ?? "N/A"}, Remark: ${err?.remark ?? "Client Error"}`,
        );
      }
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
           if (process.env.NODE_ENV === "development") {
            console.log("7. Old DeleteCart Data:", old);
          }
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => {
              if (process.env.NODE_ENV === "development") {
                console.log("8. Page DeleteCart structure:", page);
              }
              const target = page.data || page;
                if (process.env.NODE_ENV === "development") {
                console.log(
                  "9. Target DeleteCart in Page :",
                  target?.cartItems,
                );
              }

                if (!target?.cartItems) {
              console.error("❌ ERROR: cartItems not found Can't DeleteCartItem");
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
      const message = err.message ?? "การเชื่อมต่อขัดข้อง";
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
