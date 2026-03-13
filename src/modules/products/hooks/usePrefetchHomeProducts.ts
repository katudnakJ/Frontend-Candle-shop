// hooks/usePrefetchProducts.ts
import { useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/utils/api";
import { useEffect } from "react";

export const usePrefetchHomeProducts = (
  nextPage: number,
  pageSize: number,
  hasNext: boolean,
) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (hasNext) {
      queryClient.prefetchQuery({
        queryKey: ["products-home", nextPage, pageSize],
        queryFn: async () => {
          const response = await apiClient.get("/v1/products", {
            params: { page: nextPage, size: pageSize },
          });
          return response.data;
        },
      });
    }
  }, [nextPage, pageSize, hasNext, queryClient]);
};
