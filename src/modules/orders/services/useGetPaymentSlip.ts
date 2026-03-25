import { GetSignedFileResponse } from "@/modules/seller/types";
import { GenericResponse } from "@/types/response.type";
import { apiClient } from "@/utils/api";
import { useQuery } from "@tanstack/react-query"


export const useGetPaymentSlip = (orderId : string) => {
    return useQuery({
        queryKey: ["getPaymentSlip", orderId],
        queryFn: async () => {
            const response = await apiClient.get<void, GenericResponse<GetSignedFileResponse>>(
                `/v1/order/${orderId}/payment-proof`,
            );
            return response.data ?? null;
        },
        staleTime: (response) => {
            const data = response.state.data as GetSignedFileResponse | null;
            if (data && data.expiresAt){
                const remaining = new Date(data.expiresAt).getTime() - Date.now();
                return remaining * 0.8
            }
            return 2 * 60 * 1000;
        },
        retry: 0,
        enabled: !!orderId,
    })
}