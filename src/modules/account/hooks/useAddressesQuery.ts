import { GenericResponse } from "@/types/response.type";
import { apiClient } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { Addresses } from "../addresses";

export const useGetAddressesList = () => {
return useQuery({
      queryKey: ["getAddressList"],
      queryFn: async () => {
        const response = await apiClient.get<void, GenericResponse<Addresses[]>>("/v1/account/address");
        return response.data ?? [];
      },
      staleTime: 5 * 60 * 1000,
      retry: 0,
    })
}

export const useGetAddressDetail = (addressId: string) => {
    return useQuery({
      queryKey: ["getAddressDetail", addressId],
      queryFn: async () => {
        const response = await apiClient.get<void, GenericResponse<Addresses>>(`/v1/account/address/${addressId}`);
        return response.data ?? null;
      },
      staleTime: 5 * 60 * 1000,
      retry: 0,
      enabled: !!addressId,
    })
}