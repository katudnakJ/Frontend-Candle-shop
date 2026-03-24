// modules/cart/hooks/useCheckoutMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postCheckout } from "@/modules/cart/services/CheckoutCartService";
import { Status } from "@/types/response.type";
import toast from "react-hot-toast";

export const useCheckoutMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postCheckout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shopping-cart"] });
    },

    onError: (error: Status) => {
      const err = error as Status;
      const message = err.message ?? "การเชื่อมต่อขัดข้อง";
        toast.error(message, {
        id: "Create-Order-error",
      });
    },
  });
};
