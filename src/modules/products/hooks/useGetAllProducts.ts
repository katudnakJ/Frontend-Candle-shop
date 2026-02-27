'use client'

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/utils/api";
import { ProductHomeData } from "@/modules/products/homeproduct";
import { GenericResponse } from "@/types/response.type";

export const useGetAllProducts = () => {
  return useQuery({
    queryKey: ["products-home"],
    queryFn: async () => {
      const response =
        await apiClient.get<GenericResponse<ProductHomeData>>("/v1/products");
      console.log("API Response raw:", response);
      if (!response || !response.data) {
        throw new Error("No data received from API");
      }
      return response.data;
    },
  });
};
