import { Status } from "@/types/response.type";
import { apiClient } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AddTrackingNumberPayload } from "../type";


export const useOrderCardService = () => {
    const queryClient = useQueryClient()

    const addTrackingNumber = useMutation({
        mutationKey: ["addTrackingNumber"],
        mutationFn: async ({orderId, trackingNumber}: AddTrackingNumberPayload) => {
            await apiClient.patch(`/v1/order/${orderId}/track`, {
                trackingNumber,
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getOrdersByStatus"] });
            toast.success("เพิ่มหมายเลขพัสดุเรียบร้อยแล้ว");
        },
        onError: (error : Status) => {
            toast.error("เกิดข้อผิดพลาดในการเพิ่มหมายเลขติดตามพัสดุ กรุณาลองใหม่อีกครั้ง");
        }
    })

    const confirmReceived = useMutation({
        mutationKey: ["confirmReceived"],
        mutationFn: async (orderId: string) => {
            await apiClient.patch(`/v1/order/${orderId}/received`,{});
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["getOrdersByStatus"] });
            toast.success("ยืนยันการรับสินค้าเรียบร้อยแล้ว");
        },
        onError: (error : Status) => {
            toast.error( "เกิดข้อผิดพลาดในการยืนยันการรับสินค้า กรุณาลองใหม่อีกครั้ง");
        }
    })


    return {
        addTrackingNumber,
        confirmReceived
    }
}

