
// API : Get Products (All products)


import { apiClient } from "@/utils/api";

import { GenericResponse } from "@/types/response.type";

import { ProductHomeData } from "@/modules/products/homeproduct";
import { ProductDetailData } from "../detailproduct";


export const fetchCusProducts = async (page: number, size: number) => {
  const response = await apiClient.get<GenericResponse<ProductHomeData>>(
    "/v1/products",
    { params: { page, size } }
  );

  if (!response || !response.data) {
    throw new Error("No ProductData received from API");
  }
  
  return response.data;
};


export const fetchCusProductsDetail = async (productId: string) => {
  const response = await apiClient.get<GenericResponse<ProductDetailData>>(
    `/v1/products/details/${productId}`,
  );

  if (!response || !response.data) {
    throw new Error("No DetailProductData received from API");
  }
  
  return response.data;
};