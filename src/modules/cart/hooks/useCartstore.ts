import { create } from "zustand";
import {
  deleteShoppingCartItem,
  fetchShoppingCart,
  updateShoppingCartItem,
} from "@/modules/cart/services/ShoppingCartService";

import {
  AddShoppingCartItemReq,
  CartItem,
  ShoppingCartData,
  AddCartResData,
} from "../shoppingcartInterface";
import toast from "react-hot-toast";

interface CartState {
  items: CartItem[];
  totalItems: number;
  selectedIds: string[];
  setTotalItems: (count: number) => void;
  setSelectedIds: (ids: string[]) => void;
  setItems: (items: CartItem[]) => void;
  refreshCart: () => Promise<void>;
  updateItem: (itemId: string, newQty: number) => Promise<void>;
  getPrimaryImage: (item: CartItem) => string;
}

export const useCartStore = create<CartState>((set, get) => ({
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

  getPrimaryImage: (item : CartItem) => {
if (item?.productImgPath) {
    return item.productImgPath;
  }
  return "/placeholder-image.svg";
},

  refreshCart: async () => {
    try {
      const latestCart = await fetchShoppingCart(0, 100);
      const checkoutdata = latestCart?.data || latestCart
     console.log("latestCart "+latestCart)
      const newItems = checkoutdata.cartItems || [];
       console.log("Refresh Cart - New Items:", newItems);
      set((state) => {
        const validSelectedIds = state.selectedIds.filter((id) =>
          newItems.some((item) => item.shoppingCartItemId === id),
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

  updateItem: async (itemId: string, newQty: number) => {
    try {
      const item = get().items.find((i) => i.shoppingCartItemId === itemId);

      if (!item?.productId) {
        console.error("Product ID not found for this item");
        return;
      }
      await updateShoppingCartItem({
        productId: item.productId,
        quantity: newQty,
      });
      await get().refreshCart();
    } catch (error) {
      console.error("Failed to update item via API:", error);
      toast.error("ไม่สามารถเปลี่ยนจำนวนได้");
    }
  },

  removeItem: async (shoppingCartId: string, itemId: string) => {
    try {
      await deleteShoppingCartItem({
        shoppingCartId,
        shoppingCartItemId: itemId,
      });
      await get().refreshCart();
      toast.success("ลบสินค้าเรียบร้อย");
    } catch (error) {
      toast.error("ลบสินค้าไม่สำเร็จ");
    }
  },
}));
