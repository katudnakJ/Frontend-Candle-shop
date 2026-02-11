import { create } from "zustand";
import { cartService } from "@/modules/cart/services/cartService"; 
import { ShoppingCartItem } from "@/modules/cart/types";

interface CartState {
  items: ShoppingCartItem[];
  totalItems: number;

  setTotalItems: (count: number) => void;
  refreshCart: () => Promise<void>;
  updateItem: (itemId: string, newQty: number) => Promise<void>;
}

export const useCartStore = create<CartState>((set) => ({
  totalItems: 0,
  items: [],
  setTotalItems: (count) => set({ totalItems: count }),

 refreshCart: async () => {
    try {
      const latestCart = await cartService.getCart();
      const newItems = latestCart.items || [];
      set({ 
        items: newItems, 
        totalItems: newItems.length 
      });
    } catch (error) {
      console.error("Failed to refresh cart:", error);
    }
  },

updateItem: async (itemId, newQty) => {
    try {
      await cartService.updateItemQuantity(itemId, newQty);
  
      const latestCart = await cartService.getCart();
      const newItems = latestCart.items || [];
      set({ 
        items: newItems,
        totalItems: newItems.length 
      });
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  }
}));
