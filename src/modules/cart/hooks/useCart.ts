import { useEffect, useMemo } from "react";
import { useCartStore } from "@/modules/cart/hooks/useCartstore";
import {
  useUpdateCartItem,
  useDeleteCartItem,
  useUpdateCartLocal,
} from "./useCartMutations";
import { useGetCartData } from "./useGetCartData";
import { useDebouncedCallback } from "use-debounce";

import { useQueryClient } from "@tanstack/react-query";

export const useCart = () => {
  //ถ้าปรับ size ต้องไปปรับ sizesameinusecart ที่ useCartMutations ด้วยให้้เท่ากัน
  const size = 10;
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isPlaceholderData,
  } = useGetCartData(size);

  if (process.env.NODE_ENV === "development") {
    console.log("DATA IN useCart:", data);
  }
  const { cartItem, shoppingCartId, endAt, totalItemsFromApi } = useMemo(() => {
    const pages = data?.pages || [];

    if (pages.length === 0) {
      return {
        cartItem: [],
        shoppingCartId: "",
        totalItemsFromApi: 0,
        endAt: 0,
      };
    }
    const allItems = pages.flatMap((p) => {
      const actualData = p?.data || p;
      return actualData?.cartItems || [];
    });
    const lastPage = pages[pages.length - 1];
    const lastPageData = lastPage?.data || lastPage;
    return {
      cartItem: allItems,
      shoppingCartId: lastPageData?.shoppingCartId ?? "",
      totalItemsFromApi: lastPageData?.totalItems ?? 0,
      endAt: allItems.length,
    };
  }, [data]);

  const {
    selectedIds,
    allCartItems,
    setTotalItems,
    setSelectedIds,
    setAllCartItems,
    setCheckoutItems,
    removeFromStore,
  } = useCartStore();

  useEffect(() => {
    if (!isLoading) {
      setTotalItems(totalItemsFromApi);
    }
    if (!isLoading && cartItem.length > 0) {
      setAllCartItems(cartItem);
    }
  }, [cartItem, totalItemsFromApi, isLoading, setTotalItems, setAllCartItems]);

  useEffect(() => {
    const selectedItems = allCartItems.filter((item) =>
      selectedIds.includes(item.shoppingCartItemId),
    );

    setCheckoutItems(selectedItems);
  }, [allCartItems, selectedIds, setCheckoutItems]);

  const totals = useMemo(() => {
    const selectedItems = allCartItems.filter((item) =>
      selectedIds.includes(item.shoppingCartItemId),
    );
    return selectedItems.reduce(
      (acc, item) => ({
        totalQuantity: acc.totalQuantity + (item.quantity || 0),
        totalPrice: acc.totalPrice + (item.price || 0) * (item.quantity || 0),
      }),
      { totalQuantity: 0, totalPrice: 0 },
    );
  }, [allCartItems, selectedIds]);

  const isAllSelected = useMemo(
    () =>
      cartItem.length > 0 &&
      cartItem.every((item) => selectedIds.includes(item.shoppingCartItemId)),
    [cartItem, selectedIds],
  );

  const toggleSelectAll = () => {
    if (isAllSelected) {
      const currentIds = cartItem.map((i) => i.shoppingCartItemId);
      setSelectedIds(selectedIds.filter((id) => !currentIds.includes(id)));
    } else {
      const currentIds = cartItem.map((i) => i.shoppingCartItemId);
      setSelectedIds(Array.from(new Set([...selectedIds, ...currentIds])));
    }
  };

  const toggleSelect = (itemId: string) => {
    setSelectedIds(
      selectedIds.includes(itemId)
        ? selectedIds.filter((id) => id !== itemId)
        : [...selectedIds, itemId],
    );
  };

  const updateLocal = useUpdateCartLocal();
  const { mutate: updateQty } = useUpdateCartItem(size);
  const { mutate: removeItem } = useDeleteCartItem(size);

  const debouncedUpdate = useDebouncedCallback((payload) => {
    updateQty(payload);
  }, 800);

  return {
    cartItem,
    isLoading,
    isFetchingNextPage,
    isPlaceholderData,
    totalItems: totalItemsFromApi,
    hasNext: hasNextPage,
    startAt: 1,
    endAt,
    pageSize: size,
    selectedIds,
    isAllSelected,
    fetchNextPage,
    toggleSelectAll,
    toggleSelect,
    updateQuantity: (itemId: string, delta: number) => {
      const item = cartItem.find((i) => i.shoppingCartItemId === itemId);
      if (item && shoppingCartId) {
        const newQty = Math.max(1, item.quantity + delta);
        updateLocal(itemId, newQty);

        const updatedAll = allCartItems.map((i) =>
          i.shoppingCartItemId === itemId ? { ...i, quantity: newQty } : i,
        );
        setAllCartItems(updatedAll);

        debouncedUpdate({
          shoppingCartItemId: item.shoppingCartItemId,
          productId: item.productId,
          quantity: newQty,
          shoppingCartId,
        });
      }
    },
    removeItem: (itemId: string) => {
      const item = cartItem.find((i) => i.shoppingCartItemId === itemId);
      if (item) {
        removeItem(
          { shoppingCartId, shoppingCartItemId: item.shoppingCartItemId },
          {
            onSuccess: () => {
              removeFromStore(itemId);
              queryClient.invalidateQueries({
                queryKey: ["shopping-cart", size],
              });
            },
          },
        );
      }
    },
    ...totals,
  };
};
