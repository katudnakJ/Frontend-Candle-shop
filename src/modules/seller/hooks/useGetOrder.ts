import { Order, OrdersResponse } from "@/modules/orders/type";
import { GenericResponse } from "@/types/response.type";
import { apiClient } from "@/utils/api";
import { useQuery } from "@tanstack/react-query"


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
    return useQuery({
        queryKey: ["getOrdersByStatus", status],
        queryFn: async () => {
            return await apiClient.get<void, GenericResponse<OrderByStatusResponse>>(`/v1/order`,
                {
                    params: {
                        status: status,
                        page : 0,
                        size : 10,
                    }
                }
            );
        },
        retry: 0,
        staleTime: 5 * 60 * 1000,
        enabled: !!status,
    })
}