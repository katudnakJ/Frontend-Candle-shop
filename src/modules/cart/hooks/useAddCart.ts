"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addShoppingCartItem } from "@/modules/cart/services/ShoppingCartService";
import { AddShoppingCartItemReq } from "@/modules/cart/shoppingcartInterface";
import { Status } from "@/types/response.type";
import { toast } from "react-hot-toast";

export const useAddCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AddShoppingCartItemReq) =>
      addShoppingCartItem(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-cart"] });
      toast.success("เพิ่มสินค้าลงในตะกร้าเรียบร้อยแล้ว!", {
        id: "add-cart-success",
      });
    },
    onError: (error: Status) => {
      const err = error as Status;
      const message ="การเชื่อมต่อขัดข้อง";

      toast.error(message, {
        id: "add-cart-error",
      });
      if (process.env.NODE_ENV === "development") {
        console.error(
          `[AddCart Error] Status: ${err?.statusCode ?? 'N/A'}, Remark: ${err?.remark ?? 'Client Error'}`,
        );
      }
    },
  });
};
