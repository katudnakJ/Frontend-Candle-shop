"use client";
// API : Get Products (All products)

import { useEffect } from "react";
import {
  useQuery,
  keepPreviousData,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchCusProducts } from "../services/productCusService";

export const useGetAllProducts = (page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: ["products-home", page, size],
    queryFn: () => fetchCusProducts(page, size),
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 60, // 1 ชม.
    gcTime: 1000 * 60 * 70, // 1 ชม.
  });
};

export const usePrefetchHomeProducts = (
  nextPage: number,
  pageSize: number,
  hasNext: boolean,
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (hasNext) {
      const cachedData = queryClient.getQueryData([
        "products-home",
        nextPage,
        pageSize,
      ]);
      if (!cachedData) {
        queryClient.prefetchQuery({
          queryKey: ["products-home", nextPage, pageSize],
          queryFn: () => fetchCusProducts(nextPage, pageSize),
        });
      }
    }
  }, [nextPage, pageSize, hasNext, queryClient]);
};
