// services/product.service.ts
import axios from "axios";
import {
  ProductHomeItem,
  ProductHomeResData,
} from "@/modules/products/homeproduct";
import { MOCK_PRODUCT_SHOP_DATA } from "../mockShopProductData";

let localMockData = { ...MOCK_PRODUCT_SHOP_DATA };
export const getShopProducts = async (): Promise<ProductHomeResData> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return localMockData;
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
