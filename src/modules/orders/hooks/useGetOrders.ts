import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { useGetOrdersByStatus } from "@/modules/seller/hooks/useGetOrder";
import { OrdersResponse } from "../type";

export const useInfiniteOrdersByStatus = () => {
  const [activeTab, setActiveTab] = useState<OrdersResponse["orderStatus"] | "ALL">("PD");
  const observerRef = useRef<IntersectionObserver | null>(null);

  const {
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetOrdersByStatus(activeTab.toUpperCase());

  const OrdersByTab = useMemo(() => {
    const orders = data?.pages?.flatMap((page) => page.data.orders) || [];
    const lastPage = data?.pages[data.pages.length - 1];

    return {
      orders: orders,
      page: lastPage?.data.page || 0,
      size: lastPage?.data.size || 0,
      startAt: lastPage?.data.startAt || 0,
      endAt: lastPage?.data.endAt || 0,
      hasNext: lastPage?.data.hasNext || false,
      totalOrders: lastPage?.data.totalOrders || 0,
    };
  }, [data]);

  const handleLoadMoreRef = useCallback((node: HTMLDivElement | null) => {
    if (isLoading || isFetchingNextPage) return;
    if (observerRef.current) observerRef.current.disconnect();

    if (node) {
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });
      observerRef.current.observe(node);
    }
  }, [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage]);

  useEffect(() => {
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, []);

  return {
    activeTab,
    setActiveTab,
    OrdersByTab,
    isLoading,
    orders: OrdersByTab.orders,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    handleLoadMoreRef,
  };
};