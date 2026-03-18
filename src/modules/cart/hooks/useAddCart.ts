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
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ["shopping-cart"] });

      console.log("Add to cart success:", response);
    },
    onError: (error: Status) => {
      const err = error as Status;
      const message = err.message || "การเชื่อมต่อขัดข้อง";

      toast.error(message, {
        id: "add-cart-error",
      });

      console.error("Add to cart error status:", error.status);
      console.error("Add to cart error remark:", error.remark);
    },
  });
};
