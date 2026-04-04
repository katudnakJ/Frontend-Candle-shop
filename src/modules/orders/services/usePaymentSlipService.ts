import { apiClient } from "@/utils/api"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import toast from "react-hot-toast";
import { OrderRejectPayload } from "../type";


export const usePaymentSlipService = () => {
    const queryClient = useQueryClient()
    
    const confirmPayment = useMutation({
        mutationKey: ["confirmPayment"],
        mutationFn: async (orderId: string) => {
            await apiClient.patch(`/v1/order/${orderId}/confirm`);
        },
        onSuccess: () => {   
            queryClient.invalidateQueries({ queryKey: ["getDashboardReportsData"] });     
            toast.success("ยืนยันการชำระเงินเรียบร้อยแล้ว");
        },
        onError: () => {
            toast.error("เกิดข้อผิดพลาดในการยืนยันการชำระเงิน กรุณาลองใหม่อีกครั้ง");
        },

    })

    const rejectPayment = useMutation({
        mutationKey: ["rejectPayment"],
        mutationFn: async ({ orderId, reason }: OrderRejectPayload) => {
            await apiClient.patch(`/v1/order/${orderId}/reject`, {
                reason: reason,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getDashboardReportsData"] });
            toast.success("ปฏิเสธการชำระเงินเรียบร้อยแล้ว");
        },
        onError: () => {
            toast.error("เกิดข้อผิดพลาดในการปฏิเสธการชำระเงิน กรุณาลองใหม่อีกครั้ง");
        }
    })

    return {
        confirmPayment,
        rejectPayment,
    }
}