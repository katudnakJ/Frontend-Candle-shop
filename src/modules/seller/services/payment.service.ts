import { GenericResponse } from "@/types/response.type";
import { apiClient } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import {GetSignedFileResponse} from "@/modules/orders/type";

export const PaymentService = {
  // Logic การดาวน์โหลดรูป
  downloadQR: async (url: string, fileName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      toast.error("ไม่สามารถดาวน์โหลดรูปภาพได้");
    }
  },

  // Logic การตรวจสอบไฟล์
  validateFile: (file: File) => {
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      return "รองรับเฉพาะไฟล์รูปภาพ (JPG, JPEG, PNG)";
    }
    if (file.size > 2*1024 * 1024) {
      return "กรุณาใช้ไฟล์ขนาดไม่เกิน 2MB";
    }
    return null;
  },
  
};


export const useGetQRPaymentImage = (enabled?: boolean) => useQuery({
  queryKey: ["getQRPaymentImage"],
  queryFn: async () => {
    const response = await apiClient.get<void, GenericResponse<GetSignedFileResponse>>("/v1/seller/qr-payment");
    return response.data ?? null;
  },
  enabled,
  staleTime: (response) => {
    const data = response.state.data as GetSignedFileResponse | null;
    if (data && data.expiresAt){
      const remaining = new Date(data.expiresAt).getTime() - Date.now();
      return remaining * 0.8
    }
    return 2 * 60 * 1000;
  },
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});


export const useGetQRPaymentImageForCus = () => useQuery({
  queryKey: ["getQRPaymentImageForCus"],
  queryFn: async () => {
    const response = await apiClient.get<void, GenericResponse<GetSignedFileResponse>>("/v1/seller/qr-payment");
    return response.data ?? null;
  },

  staleTime: 5 * 60 * 1000 ,
  gcTime: 10 * 60 *1000 ,
  retry: 3,
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});