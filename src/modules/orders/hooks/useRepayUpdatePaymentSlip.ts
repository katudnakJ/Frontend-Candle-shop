// @/modules/orders/hooks/useUpdatePaymentSlipMutation.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { repayupdatePaymentSlip } from "@/modules/orders/services/repayupdatePaymentSlip";
import { GenericResponse, Status } from "@/types/response.type";
import { toast } from "react-hot-toast";

export const useRepayUpdatePaymentSlip = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: repayupdatePaymentSlip,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["order-detail", variables.orderId],
      });
      console.log("Add to cart success:");
     // toast.success("อัปเดตสลิปชำระเงินเรียบร้อยแล้ว");
    },
    onError: (error: Status) => {
      const err = error as Status;
      const errorMessage = error?.message || "เกิดข้อผิดพลาดในการส่งสลิป";

      toast.error(errorMessage, {
        id: "repay-order-error",
      });
      if (process.env.NODE_ENV === "development") {
        console.error(
          `[RepayOrder Error] Status: ${err?.statusCode ?? "N/A"}, Remark: ${err?.remark ?? "Client Error"}`,
        );
      }
    },
  });
};
