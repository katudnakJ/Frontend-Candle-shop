"use client";
// API : Get Products (All products)

import { useEffect } from "react";
import {
  useQuery,
  keepPreviousData,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchCusProductsDetail } from "../services/productCusService";

export const useGetProductDetail = (productId: string | null) => {
  return useQuery({
    queryKey: ["products-Detail", productId],
    queryFn: () => fetchCusProductsDetail(productId!),
    placeholderData: keepPreviousData,
    enabled: !!productId,
    staleTime: 1000 * 60 * 60, // 1 ชม.
    gcTime: 1000 * 60 * 60, // 1 ชม.
  });
};

