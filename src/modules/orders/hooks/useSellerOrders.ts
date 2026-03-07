import { useState, useMemo, useEffect } from "react";
import { Order } from "../type";
import { mockOrders } from "../mockOrderData"; // เดี๋ยวเปลี่ยนเป็นเรียก Service ตอนต่อ BE

export const useSellerOrders = () => {
 
  const [activeTab, setActiveTab] = useState<Order["order_status"] | "ALL">("PD");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      try {
       
        await new Promise((resolve) => setTimeout(resolve, 500));
        setOrders(mockOrders);
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
        return order.order_status === "PD" 
        //|| order.order_status === "RJ";
      }
      return order.order_status === activeTab;
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