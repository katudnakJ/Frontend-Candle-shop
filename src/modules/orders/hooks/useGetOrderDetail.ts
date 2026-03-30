
import { useQuery } from "@tanstack/react-query";
import { fetchOrderDetail } from "@/modules/orders/services/getOrderDetailService";

export const useGetOrderDetail = (orderId: string, options = {}) => {
  return useQuery({
    queryKey: ["order-detail", orderId],
    queryFn: () => fetchOrderDetail(orderId),
    enabled: !!orderId, 
    retry: 1,          
    retryDelay: 1000 ,   
    refetchOnWindowFocus: false,
    ...options,
    
  });
};