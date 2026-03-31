// services/product.service.ts

import { MOCK_PRODUCT_SHOP_DATA } from "../mockShopProductData";

import { apiClient } from "@/utils/api";
import { GenericResponse } from "@/types/response.type";
import { ProductHomeResData,SearchProductResData } from "@/modules/products/homeproduct";

let localMockData = { ...MOCK_PRODUCT_SHOP_DATA };

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



export const deleteProduct = async (productId: string) => {
  console.log(`Deleting product: ${productId}`);
  localMockData = {
    ...localMockData, 
    featuredProducts: localMockData.featuredProducts.filter(
      (p) => p.productId !== productId,
    ),
    allProducts: localMockData.allProducts.filter(
      (p) => p.productId !== productId,
    ),
  };

  return { success: true };
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
