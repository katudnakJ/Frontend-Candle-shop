import { OrdersResponse } from "@/modules/orders/type";
import { GenericResponse } from "@/types/response.type";
import { apiClient } from "@/utils/api";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query"


 export interface OrderByStatusResponse {
  orders: OrdersResponse[];
  page: number;
  size: number;
  startAt: number;
  endAt: number;
  hasNext: boolean;
  totalOrders: number;
}

export const useGetOrderCountByStatus = (status: string, enabled: boolean) => {
    return useQuery({
        queryKey: ["getOrderCountByStatus", status],
        queryFn: async () => {
            return await apiClient.get<void, GenericResponse<number>>(`/v1/seller/orders/count`,
                {
                    params: {
                        status: status,
                    }
                }
            );
        },
        retry: 0,
        staleTime: 5 * 60 * 1000,
        enabled : enabled,
    })
}

export const useGetOrdersByStatus = (status: string) => {
    return useInfiniteQuery({
        queryKey: ["getOrdersByStatus", status],
        queryFn: async ({ pageParam = 0 }) => {
            const response = await apiClient.get<void, GenericResponse<OrderByStatusResponse>>(`/v1/order`,
                {
                    params: {
                        status: status,
                        page: pageParam,
                        size : 2,
                    }
                }
            );
            return response;
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage) => {
          return lastPage.data?.hasNext ? lastPage.data.page + 1 : undefined;
        },
        retry: 0,
        staleTime: 5 * 60 * 1000,
        enabled: !!status,
    })
}

