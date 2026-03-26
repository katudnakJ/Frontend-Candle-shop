
// API : Get Products (All products)


import { apiClient } from "@/utils/api";

import { GenericResponse } from "@/types/response.type";

import { ProductHomeResData } from "@/modules/products/homeproduct";
import { ProductDetailResData } from "../detailproduct";


export const fetchCusProducts = async (page: number, size: number) => {
  const response = await apiClient.get<GenericResponse<ProductHomeResData>>(
    "/v1/products",
    { params: { page, size } }
  );

  if (!response || !response.data) {
    throw new Error("No ProductData received from API");
  }
  
  return response.data;
};


export const fetchCusProductsDetail = async (productId: string) => {
  const response = await apiClient.get<GenericResponse<ProductDetailResData>>(
    `/v1/products/${productId}`,
  );

  if (!response || !response.data) {
    throw new Error("No DetailProductData received from API");
  }
  
  return response.data;
};