import { apiClient } from "@/utils/api";
import { GenericResponse } from "@/types/response.type";
import {OrderDetailResponse} from "@/modules/orders/type"



export const fetchOrderDetail = async (orderId: string) => {
  const response = await apiClient.get<GenericResponse<OrderDetailResponse>>(
    `/v1/order/${orderId}`,
  );

  if (!response || !response.data) {
    throw new Error("No Order Detail data received from API");
  }
  return response.data;
};