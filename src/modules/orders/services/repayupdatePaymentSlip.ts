import { apiClient } from "@/utils/api";
import { GenericResponse } from "@/types/response.type";
import { UpdatePaymentSlipRequest } from "@/modules/orders/type";

export const repayupdatePaymentSlip = async (
  payload: UpdatePaymentSlipRequest,
) => {
  const formData = new FormData();
  formData.append("orderId", payload.orderId);
  formData.append("image_data", payload.imageData);

  if (process.env.NODE_ENV === "development") {
    console.log("--- 📦🛺Checking RepayFormData ---");

    for (const pair of formData.entries()) {
      console.log(`${pair[0]}:`, pair[1]);
    }
    console.log("--- Ending  RepayFormData  🛺📦 ---");
  }

  const response = await apiClient.put<
    GenericResponse<UpdatePaymentSlipRequest>
  >(`/v1/checkout/${payload.orderId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
