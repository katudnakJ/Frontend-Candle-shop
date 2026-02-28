import { apiClient } from "@/utils/api";
import { Customer } from "../types";
import { ApiResponse } from "@/types/api.type";

export const getCustomerProfile = async () => {
  const res = await apiClient.get<void, ApiResponse<Customer>>("/customers/profile");
  return res;
};