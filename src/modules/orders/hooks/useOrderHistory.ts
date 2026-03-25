import { useState, useMemo, useEffect } from "react";
import { OrdersResponse } from "../type";
import { ORDER_STATUS } from "@/constants/status";

export const useOrderHistory = () => {
 
  const [activeTab, setActiveTab] = useState<OrdersResponse["orderStatus"] | "ALL">("PD");
  const [orders, setOrders] = useState<OrdersResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
       
        await new Promise((resolve) => setTimeout(resolve, 500));
        setOrders([]);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      if (activeTab === "ALL") return true;
      
      if (activeTab === "PD") {
        return order.orderStatus.toUpperCase() === ORDER_STATUS.PENDING || order.rejectionReason !== null;
      }
      return order.orderStatus === activeTab;
    });
  }, [orders, activeTab]);

  return {
    activeTab,
    setActiveTab,
    filteredOrders,
    isLoading,
    totalCount: orders.length,
  };
};