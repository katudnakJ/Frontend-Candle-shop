import { create } from "zustand";
import { CartItem } from "../shoppingcartInterface";
import { Addresses } from "@/modules/account/addresses";

interface CartState {
  totalItems: number;
  selectedIds: string[];
  allCartItems: CartItem[];
  checkoutItems: CartItem[];
  selectedAddress: Addresses | null;
  setSelectedIds: (ids: string[]) => void;
  setCheckoutItems: (items: CartItem[]) => void;
  setAllCartItems: (items: CartItem[]) => void;
  setSelectedAddress: (address: Addresses | null) => void;
  setTotalItems: (total: number) => void;
  getPrimaryImage: (item: CartItem) => string;
  removeFromStore: (itemId: string) => void;
}

export const useCartStore = create<CartState>((set) => ({
  selectedIds: [],
  checkoutItems: [],
  allCartItems: [],
  selectedAddress: null,
  totalItems: 0,
  setTotalItems: (total) =>
    set((state) => {
     
      if (state.totalItems === total) return state;
      return { totalItems: total };
    }),
  setSelectedIds: (ids) => set({ selectedIds: ids }),
  setCheckoutItems: (items) => set({ checkoutItems: items }),
  setAllCartItems: (newItems) =>
    set((state) => {
      const itemMap = new Map(
        state.allCartItems.map((item) => [item.shoppingCartItemId, item]),
      );
      newItems.forEach((item) => {
        itemMap.set(item.shoppingCartItemId, item);
      });
      return { allCartItems: Array.from(itemMap.values()) };
    }),
  setSelectedAddress: (address) => set({ selectedAddress: address }),
  getPrimaryImage: (item: CartItem) => {
    return item?.productImgPath || "/placeholder-image.svg";
  },
  removeFromStore: (itemId: string) =>
    set((state) => ({
      allCartItems: state.allCartItems.filter(
        (i) => i.shoppingCartItemId !== itemId,
      ),
      selectedIds: state.selectedIds.filter((id) => id !== itemId),

      totalItems: Math.max(0, state.totalItems - 1),
    })),
}));
