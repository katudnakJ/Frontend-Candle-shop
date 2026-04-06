// modules/cart/hooks/useCheckoutMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postCheckoutService } from "@/modules/cart/services/CheckoutCartService";
import { useCartStore } from "@/modules/cart/hooks/useCartstore";
import { Status } from "@/types/response.type";
import toast from "react-hot-toast";

export const useCheckoutMutation = () => {
  const queryClient = useQueryClient();
  const { setTotalItems } = useCartStore();

  return useMutation({
    mutationFn: postCheckoutService,
    retry: 1,

    onSuccess: () => {
      queryClient.cancelQueries({ queryKey: ["shopping-cart"] });
      queryClient.removeQueries({ queryKey: ["shopping-cart"], exact: false });
      queryClient.invalidateQueries({
        queryKey: ["shopping-cart"],
        exact: false,
      });

      const { totalItems, checkoutItems } = useCartStore.getState();
      const purchasedCount = checkoutItems.length;
      const newTotal = Math.max(0, totalItems - purchasedCount);

      setTotalItems(newTotal);
      toast.loading("กำลังเตรียมหน้าคำสั่งซื้อ...", { duration: 1000 });
      toast.success("ยืนยันการชำระเงินเรียบร้อย");
    },

    onError: (error: Status) => {
      const err = error as Status;
      const message = "การเชื่อมต่อขัดข้อง";
      toast.error(message, {
        id: "Create-Order-error",
      });
    },
  });
};
