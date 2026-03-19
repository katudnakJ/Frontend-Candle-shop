
import { create } from "zustand";
import { CartItem } from "../shoppingcartInterface";

interface CartState {
  selectedIds: string[]; 
  setSelectedIds: (ids: string[]) => void;
  getPrimaryImage: (item: CartItem) => string;
}

export const useCartStore = create<CartState>((set) => ({
  selectedIds: [],
  setSelectedIds: (ids) => set({ selectedIds: ids }),

  getPrimaryImage: (item: CartItem) => {
    return item?.productImgPath || "/placeholder-image.svg";
  },
}));