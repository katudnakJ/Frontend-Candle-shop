import { useState, useMemo } from "react";
import { OrderByStatusResponse, useGetOrdersByStatus } from "@/modules/seller/hooks/useGetOrder";
import { OrdersResponse } from "../type";

export const useSellerOrders = () => {
 
  const [activeTab, setActiveTab] = useState<OrdersResponse["orderStatus"] | "ALL">("PD");

  const {data : orders, isLoading} = useGetOrdersByStatus(activeTab.toUpperCase());

  
  const OrdersByTab: OrderByStatusResponse = useMemo(() => {
    return orders?.data || {
      orders: [],
      page: 0,
      size: 0,
      startAt: 0,
      endAt: 0,
      hasNext: false,
      totalOrders: 0,
    };
  }, [orders]);

  

  return {
    activeTab,
    setActiveTab,
    OrdersByTab,
    isLoading,
    orders
  };
};