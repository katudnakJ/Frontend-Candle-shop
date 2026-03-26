
import { apiClient } from "@/utils/api";
import { PDFResponse } from "../type";

const pdfExpiredAt : Record<string, PDFResponse> = {};

export const getOrderReceiptWithStale = async (orderId: string) => {
    const cached = pdfExpiredAt[orderId];
     const now = Date.now();

     if (cached && new Date(cached.pdfSignedUrl.expiresAt) > new Date(now * 0.8)) {
       return cached.pdfSignedUrl;
     }

     const res = await apiClient.get<PDFResponse>(`/v1/order/${orderId}/receipt`);
     const data = res?.data ?? null;
     
     if (data === null) return null;

     const expireAt = new Date(data?.pdfSignedUrl.expiresAt).getTime();

     pdfExpiredAt[orderId] = {
       pdfName: data?.pdfName,
       pdfSignedUrl: {
            signedFileUrl: data?.pdfSignedUrl.signedFileUrl,
            expiresAt: expireAt.toString(),
       },
     };

    return data?.pdfSignedUrl || null;
}