import { useEffect, useMemo } from "react";
import { useCartStore } from "@/modules/cart/hooks/useCartstore";
import {
  useUpdateCartItem,
  useDeleteCartItem,
  useUpdateCartLocal,
} from "./useCartMutations";
import { useGetCartData } from "./useGetCartData";
import { useDebouncedCallback } from "use-debounce";
import { GenericResponse } from "@/types/response.type";
import { ShoppingCartData } from "../shoppingcartInterface";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";


export const useCart = (currentPage: number) => {
  const size = 2;
  const queryClient = useQueryClient();
  const router = useRouter();

  const { data, isLoading, isPlaceholderData} = useGetCartData(currentPage, size) as {
    data: GenericResponse<ShoppingCartData> | undefined;
    isLoading: boolean;
    isPlaceholderData: boolean;
  };
  const { cartItem, shoppingCartId, endAt, startAt, hasNext, totalItems } =
    useMemo(() => {
      const rawData = data?.data || data;
      const cartData = rawData as ShoppingCartData;

      return {
        cartItem: cartData?.cartItems || [],
        shoppingCartId: cartData?.shoppingCartId,
        endAt: cartData?.endAt || 0,
        startAt: cartData?.startAt || 0,
        hasNext: cartData?.hasNext || false,
        totalItems: cartData?.totalItems || 0,
      };
    }, [data]);

  if (process.env.NODE_ENV === "development") {
    console.log("ITEMS IN USECART:", cartItem);
    console.log("ShoppingCartId:", shoppingCartId);
    console.log("EndAt:", endAt);
    console.log("StartAt:", startAt);
    console.log("HasNext:", hasNext);
    console.log("TotalItems:", totalItems);
  }

  const {
    selectedIds,
    allCartItems,
    totalItems: storeTotalItems,
    setTotalItems,
    setSelectedIds,
    setAllCartItems,
    removeFromStore,
  } = useCartStore();

  useEffect(() => {
    const rawData = data?.data || data;

    const items = (rawData as ShoppingCartData)?.cartItems || [];
    const total = (rawData as ShoppingCartData)?.totalItems || 0;

    const currentStoreTotal = useCartStore.getState().totalItems;

    if (!isLoading) {
      if (total !== currentStoreTotal) {
        setTotalItems(total);
      }

      if (items.length > 0) {
        setAllCartItems(items);
      }
    }
  }, [data, isLoading, setTotalItems, setAllCartItems]);

  const totals = useMemo(() => {
    const selectedItems = allCartItems.filter((item) =>
      selectedIds.includes(item.shoppingCartItemId),
    );
    return selectedItems.reduce(
      (acc, item) => ({
        totalQuantity: acc.totalQuantity + item.quantity,
        totalPrice: acc.totalPrice + (item.price || 0) * item.quantity,
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
      const newSelected = Array.from(new Set([...selectedIds, ...currentIds]));
      setSelectedIds(newSelected);
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
  const { mutate: updateQty } = useUpdateCartItem(currentPage, size);
  const { mutate: removeItem } = useDeleteCartItem(currentPage, size);

  const debouncedUpdate = useDebouncedCallback((payload) => {
    updateQty(payload);
  }, 800);

  return {
    cartItem,
    isLoading,
    isPlaceholderData,
    totalItems: storeTotalItems,
    hasNext,
    startAt,
    endAt,
    pageSize: size,
    selectedIds,
    isAllSelected,
    toggleSelectAll,
    toggleSelect,
    updateQuantity: (itemId: string, delta: number) => {
      const item = cartItem.find((i) => i.shoppingCartItemId === itemId);
      if (item && shoppingCartId) {
        const newQty = Math.max(1, item.quantity + delta);

        updateLocal(itemId, newQty, currentPage, size);
        debouncedUpdate({
          shoppingCartItemId: item.shoppingCartItemId,
          productId: item.productId,
          quantity: newQty,
          shoppingCartId: shoppingCartId,
        });
      }
    },
    removeItem: (itemId: string) => {
      const item = cartItem.find((i) => i.shoppingCartItemId === itemId);
      if (item) {
        removeItem(
          {
            shoppingCartId: shoppingCartId,
            shoppingCartItemId: item.shoppingCartItemId,
          },
          {
            onSuccess: async () => {
              removeFromStore(itemId);
              await queryClient.invalidateQueries({ queryKey: ["shopping-cart"] });
              if (cartItem.length === 1 && currentPage > 0) {
                const displayPage = currentPage; // currentPage คือ index 0, ดังนั้นหน้าก่อนหน้าคือ index ปัจจุบันพอดี
                router.push(`?page=${displayPage}`, { scroll: true });
              }
            },
          },
        );
      }
    },
    ...totals,
  };
};
