import { useState, useMemo, useEffect } from "react";
import { Order } from "../type";
import { useGetOrdersByStatus } from "@/modules/seller/hooks/useGetOrder";

export const useSellerOrders = () => {
 
  const [activeTab, setActiveTab] = useState<Order["order_status"] | "ALL">("PD");

  const {data : orders, isLoading} = useGetOrdersByStatus(activeTab.toUpperCase());

  
  const OrdersByTab = useMemo(() => {
    return orders?.data.orders || [];
  }, [orders]);

  return {
    activeTab,
    setActiveTab,
    OrdersByTab,
    isLoading,
    orders
  };
};