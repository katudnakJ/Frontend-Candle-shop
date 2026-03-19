import {  useMemo} from "react";
import { useCartStore } from "@/modules/cart/hooks/useCartstore";
import { useUpdateCartItem, useDeleteCartItem } from "./useCartMutations";
import { useGetCartData } from "./useGetCartData";
import { GenericResponse } from "@/types/response.type";
import { ShoppingCartData } from "../shoppingcartInterface";

export const useCart = () => {
  const { data, isLoading } = useGetCartData() as {
    data: GenericResponse<ShoppingCartData> | undefined;
    isLoading: boolean;
  };
  const resDate = data?.data || data;
  const cartItem = (resDate as ShoppingCartData)?.cartItems || [];
  const shoppingCartId = (resDate as ShoppingCartData)?.shoppingCartId;

  console.log("ITEMS IN USECART:", cartItem);

  const { mutate: updateQty } = useUpdateCartItem();
  const { mutate: removeItem } = useDeleteCartItem();
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


  const isAllSelected = cartItem.length > 0 && selectedIds.length === cartItem.length;

  const toggleSelectAll = () => {
    setSelectedIds(isAllSelected ? [] : cartItem.map((i) => i.shoppingCartItemId));
  };

  const toggleSelect = (itemId: string) => {
    setSelectedIds(
      selectedIds.includes(itemId)
        ? selectedIds.filter((id) => id !== itemId)
        : [...selectedIds, itemId],
    );
  };


  return {
    cartItem,
    isLoading,
    selectedIds,
    isAllSelected,
    toggleSelectAll,
    toggleSelect,
    updateQuantity: (itemId: string, delta: number) => {
      const item = cartItem.find((i) => i.shoppingCartItemId === itemId);
      if (item) {
        updateQty({
          shoppingCartItemId: item.shoppingCartItemId,
          productId: item.productId,
          quantity: Math.max(1, item.quantity + delta),
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
