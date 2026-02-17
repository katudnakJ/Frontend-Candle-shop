import { create } from "zustand";
import { cartService } from "@/modules/cart/services/cartService";
import { ShoppingCartItem } from "@/modules/cart/types";

interface CartState {
  items: ShoppingCartItem[];
  totalItems: number;
  selectedIds: string[];
  setTotalItems: (count: number) => void;
  setSelectedIds: (ids: string[]) => void;
  setItems: (items: ShoppingCartItem[]) => void;
  refreshCart: () => Promise<void>;
  updateItem: (itemId: string, newQty: number) => Promise<void>;
  getPrimaryImage: (item: ShoppingCartItem) => string;
}

export const useCartStore = create<CartState>((set) => ({
  totalItems: 0,
  items: [],
  selectedIds: [],
  setTotalItems: (count) => set({ totalItems: count }),
  setSelectedIds: (ids) => set({ selectedIds: ids }),

  setItems: (newItems) =>
    set({
      items: newItems,
      totalItems: newItems.length,
    }),

  getPrimaryImage: (item) => {
    const images = item.product?.images;
    if (Array.isArray(images)) {
      const primary = images.find((img) => img.is_primary);
      return (
        primary?.product_img_slug ||
        images[0]?.product_img_slug ||
        "/placeholder-image.svg"
      );
    }
    return "/placeholder-image.svg";
  },

  refreshCart: async () => {
    try {
      const latestCart = await cartService.getCart();
      const newItems = latestCart.items || [];
      set((state) => {
        const validSelectedIds = state.selectedIds.filter((id) =>
          newItems.some((item) => item.Shopping_Cart_Item_id === id),
        );
        return {
          items: newItems,
          totalItems: newItems.length,
          selectedIds: validSelectedIds,
        };
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
      set((state) => {
        const validSelectedIds = state.selectedIds.filter((id) =>
          newItems.some((item) => item.Shopping_Cart_Item_id === id),
        );
        return {
          items: newItems,
          totalItems: newItems.length,
          selectedIds: validSelectedIds,
        };
      });
    } catch (error) {
      console.error("Failed to update item:", error);
    }
  },
}));
