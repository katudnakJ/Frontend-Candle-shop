import { Status } from "@/types/response.type";
import { apiClient } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { AddTrackingNumberPayload } from "../type";


export const useOrderCardService = () => {
    const addTrackingNumber = useMutation({
        mutationKey: ["addTrackingNumber"],
        mutationFn: async ({orderId, trackingNumber}: AddTrackingNumberPayload) => {
            await apiClient.patch(`/v1/order/${orderId}/track`, {
                trackingNumber,
            });
        },
        onSuccess: () => {
            toast.success("เพิ่มหมายเลขพัสดุเรียบร้อยแล้ว");
        },
        onError: (error : Status) => {
            toast.error(error.message ?? "เกิดข้อผิดพลาดในการเพิ่มหมายเลขติดตามพัสดุ กรุณาลองใหม่อีกครั้ง");
        }
    })

    return {
        addTrackingNumber,
    }
}