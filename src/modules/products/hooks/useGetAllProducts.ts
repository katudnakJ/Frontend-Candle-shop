"use client";
// API : Get Products (All products)

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiClient } from "@/utils/api";
import { ProductHomeData } from "@/modules/products/homeproduct";
import { GenericResponse } from "@/types/response.type";

export const useGetAllProducts = (page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: ["products-home", page, size],
    queryFn: async () => {
      const response = await apiClient.get<GenericResponse<ProductHomeData>>(
        "/v1/products",
        {
          params: { page, size }, 
        },
      );
      console.log("API Response raw:", response);
      if (!response || !response.data) {
        throw new Error("No data received from API");
      }
      return response.data;
    },
    placeholderData: keepPreviousData,
  });
};
