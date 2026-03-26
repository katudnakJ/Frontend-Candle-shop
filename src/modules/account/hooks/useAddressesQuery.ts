import { GenericResponse } from "@/types/response.type";
import { apiClient } from "@/utils/api";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Addresses } from "../addresses";

export const useGetAddressesList = () => {
  return useQuery({
    queryKey: ["getAddressList"],
    queryFn: async () => {
      const response = await apiClient.get<void, GenericResponse<Addresses[]>>(
        "/v1/account/address",
      );
      return response.data ?? [];
    },
    staleTime: 5 * 60 * 1000,
    retry: 0,
  });
};

export const useGetAddressDetail = (
  addressId: string,
  options?: Partial<UseQueryOptions<Addresses | null, Error>>,
) => {
  return useQuery({
    queryKey: ["getAddressDetail", addressId],
    queryFn: async () => {
      const response = await apiClient.get<void, GenericResponse<Addresses>>(
        `/v1/account/address/${addressId}`,
      );
      return response.data ?? null;
    },
    staleTime: 5 * 60 * 1000,
    retry: 0,
    ...options,
    enabled: options?.enabled !== undefined ? options.enabled : !!addressId,
  });
};
