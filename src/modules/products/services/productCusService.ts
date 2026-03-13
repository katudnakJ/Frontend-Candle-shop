
// API : Get Products (All products)


import { apiClient } from "@/utils/api";
import { ProductHomeData } from "@/modules/products/homeproduct";
import { GenericResponse } from "@/types/response.type";


export const fetchCusProducts = async (page: number, size: number) => {
  const response = await apiClient.get<GenericResponse<ProductHomeData>>(
    "/v1/products",
    { params: { page, size } }
  );

  if (!response || !response.data) {
    throw new Error("No data received from API");
  }
  
  return response.data;
};