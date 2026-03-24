
import { create } from "zustand";
import { CartItem } from "../shoppingcartInterface";
import { Addresses } from "@/modules/account/addresses";

interface CartState {
  selectedIds: string[]; 
  checkoutItems: CartItem[];
  selectedAddress: Addresses | null ;
  setSelectedIds: (ids: string[]) => void;
  setCheckoutItems: (items: CartItem[]) => void;
  setSelectedAddress: (address: Addresses | null) => void;
  getPrimaryImage: (item: CartItem) => string;
}

export const useCartStore = create<CartState>((set) => ({
  selectedIds: [],
  checkoutItems: [],
  selectedAddress: null,
  setSelectedIds: (ids) => set({ selectedIds: ids }),
  setCheckoutItems: (items) => set({ checkoutItems: items }),
  setSelectedAddress:(address) => set({selectedAddress: address}),
  getPrimaryImage: (item: CartItem) => {
    return item?.productImgPath || "/placeholder-image.svg";
  },
})
);