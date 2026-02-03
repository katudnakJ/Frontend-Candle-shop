import axiosInstance from "@/lib/axios";
import { Customer } from "../types";
import { ApiResponse } from "@/types/api.type";

export const getCustomerProfile = async () => {
  const res = await axiosInstance.get<void, ApiResponse<Customer>>("/customers/profile");
  return res;
};