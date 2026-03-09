// services/product.service.ts
import axios from "axios";
import { ProductHomeItem,ProductHomeData } from "@/modules/products/homeproduct";
import { MOCK_PRODUCT_SHOP_DATA } from "../mockShopProductData";

export const getShopProducts = async (): Promise<ProductHomeData> => {

  await new Promise((resolve) => setTimeout(resolve, 1000));


 return MOCK_PRODUCT_SHOP_DATA;
};


export const deleteProduct = async (productId: string) => {

  console.log(`Deleting product: ${productId}`);

  return { success: true };
};


export const toggleProductStatus = async (productId: string, currentStatus: boolean) => {

    console.log(`Toggling status for ${productId} from ${currentStatus} to ${!currentStatus}`);
    return { success: true };
};