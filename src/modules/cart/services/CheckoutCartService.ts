import { apiClient } from "@/utils/api";
import { AxiosError } from "axios";
import { GenericResponse, Status } from "@/types/response.type";
import { CheckoutRequest } from "@/modules/cart/checkoutInterface";


export const postCheckoutService = async (payload: CheckoutRequest) => {
  try {
    const formData = new FormData();

    // จัดการ Array ของ ID
    payload.shoppingCartItemIds.forEach((id) => {
      formData.append("shopping_cart_item_ids", id);
    });

    formData.append("address_id", payload.addressId);

    formData.append("image_data", payload.imageData);

    const response = await apiClient.post<GenericResponse<CheckoutRequest>>(
      "/v1/checkout",
      formData,
      {
        headers: {
          //"Content-Type": "multipart/form-data",
          "Content-Type": "undefined",
        },
      },
    );
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<Status>;

    if (axiosError.response) {
      throw axiosError.response.data;
    }
    throw {
      statusCode: "500",
      message: axiosError.message || "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้",
    } as Status;
  }
};
