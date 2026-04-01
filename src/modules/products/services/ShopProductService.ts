// services/product.service.ts


import { apiClient } from "@/utils/api";
import { GenericResponse } from "@/types/response.type";
import { ProductHomeResData,SearchProductResData } from "@/modules/products/homeproduct";



export const getAllShopProducts = async ({pageParam, size}:{ pageParam?: number , size?:number }): Promise<ProductHomeResData> => {

  
  const response = await apiClient.get<void, GenericResponse<ProductHomeResData>>(
    `/v1/products?page=${pageParam}&size=${size}`
  );

  return response.data;
};

export const getShopProductsBySearch = async ({pageParam, size, q}:{ pageParam?: number , size?:number, q: string }): Promise<SearchProductResData> => {

  
  const response = await apiClient.get<void, GenericResponse<SearchProductResData>>(
    `/v1/products/search?q=${q}&page=${pageParam}&size=${size}`
  );

  return response.data;
};



export const deleteProduct = async (productId: string): Promise<GenericResponse<null>> => {
  console.log(`Sending DELETE request for product: ${productId}`);

const response = await apiClient.delete(`/v1/products/${productId}`);

  if (!response) {
    throw new Error("Delete failed: No response from server");
  }
  console.log("DELETERESPRODUCT",response);
  console.log("DELETEPRODUCT",response.data);
 return response as unknown as GenericResponse<null>;
};

export const toggleProductStatus = async (
  productId: string,
  currentStatus: boolean,
) => {
  console.log(
    `Toggling status for ${productId} from ${currentStatus} to ${!currentStatus}`,
  );
  return { success: true };
};
