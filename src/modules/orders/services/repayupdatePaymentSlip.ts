import { apiClient } from "@/utils/api";
import { GenericResponse } from "@/types/response.type";
import { UpdatePaymentSlipRequest } from "@/modules/orders/type";

export const repayupdatePaymentSlip = async (
  payload: UpdatePaymentSlipRequest,
) => {
  const formData = new FormData();
  formData.append("orderId", payload.orderId);
  formData.append("image_data", payload.imageData);

  const response = await apiClient.put<
    GenericResponse<UpdatePaymentSlipRequest>
  >(`/v1/checkout/${payload.orderId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
