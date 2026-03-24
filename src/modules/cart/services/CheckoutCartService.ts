import { apiClient } from "@/utils/api";
import { GenericResponse } from "@/types/response.type";
import {CheckoutRequest} from "@/modules/cart/checkoutInterface"

export const postCheckout = async (payload: CheckoutRequest) => {
  const formData = new FormData();
  
  // จัดการ Array ของ ID
  payload.shoppingCartItemIds.forEach((id) => {
    formData.append("shopping_cart_item_ids" , id);
  });
  
  formData.append("address_id", payload.addressId);
  formData.append("image_data", payload.imageData);

  if (process.env.NODE_ENV === "development") {
    console.log("--- Checking FormData Payload ---");

    for (const pair of formData.entries()) {

      console.log(`${pair[0]}:`, pair[1]);
    }
  }

  const response= await apiClient.post<GenericResponse<CheckoutRequest>>(
    "/v1/checkout",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  if (!response ) {
    throw new Error("Failed to Create Order to Shop");
  }
  return response.data;
};