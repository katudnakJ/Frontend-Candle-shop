import { useMemo } from "react";
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

export const useCart = () => {
  const page = 0;
  const size = 10;

  const { data, isLoading } = useGetCartData(page, size) as {
    data: GenericResponse<ShoppingCartData> | undefined;
    isLoading: boolean;
  };
const { cartItem, shoppingCartId } = useMemo(() => {
    const rawData = data?.data || data; 
    const cartData = rawData as ShoppingCartData;
    
    return {
      cartItem: cartData?.cartItems || [],
      shoppingCartId: cartData?.shoppingCartId
    };
  }, [data]);

  if (process.env.NODE_ENV === "development") {
    console.log("ITEMS IN USECART:", cartItem);
  }

  const { selectedIds, setSelectedIds } = useCartStore();

  const totals = useMemo(() => {
    const selectedItems = cartItem.filter((item) =>
      selectedIds.includes(item.shoppingCartItemId),
    );
    return selectedItems.reduce(
      (acc, item) => ({
        totalQuantity: acc.totalQuantity + item.quantity,
        totalPrice: acc.totalPrice + (item.price || 0) * item.quantity,
      }),
      { totalQuantity: 0, totalPrice: 0 },
    );
  }, [cartItem, selectedIds]);

  const isAllSelected =
    cartItem.length > 0 && selectedIds.length === cartItem.length;

  const toggleSelectAll = () => {
    setSelectedIds(
      isAllSelected ? [] : cartItem.map((i) => i.shoppingCartItemId),
    );
  };

  const toggleSelect = (itemId: string) => {
    setSelectedIds(
      selectedIds.includes(itemId)
        ? selectedIds.filter((id) => id !== itemId)
        : [...selectedIds, itemId],
    );
  };

  const updateLocal = useUpdateCartLocal();
  const { mutate: updateQty } = useUpdateCartItem(page, size);
  const { mutate: removeItem } = useDeleteCartItem(page, size);

  const debouncedUpdate = useDebouncedCallback((payload) => {
    updateQty(payload);
  }, 800);

  return {
    cartItem,
    isLoading,
    selectedIds,
    isAllSelected,
    toggleSelectAll,
    toggleSelect,
    updateQuantity: (itemId: string, delta: number) => {
      const item = cartItem.find((i) => i.shoppingCartItemId === itemId);
      if (item && shoppingCartId) {
        const newQty = Math.max(1, item.quantity + delta);

        updateLocal(itemId, newQty, page, size);
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
        removeItem({
          shoppingCartId: shoppingCartId,
          shoppingCartItemId: item.shoppingCartItemId,
        });
      }
    },
    ...totals,
  };
};
