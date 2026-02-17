import { useState, useMemo, useEffect } from "react";
import { ShoppingCart, ShoppingCartItem } from "@/modules/cart/types";
import { cartService } from "../services/cartService";
import { useCartStore } from "@/modules/cart/hooks/useCartstore";

export const useCart = (initialCart: ShoppingCart) => {
  const [items, setItems] = useState<ShoppingCartItem[]>(initialCart.items || []);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const setTotalItems = useCartStore((state) => state.setTotalItems);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await cartService.getCart();
        const newItems = data.items || [];
        setItems(newItems);
        setTotalItems(newItems.length);
        setSelectedIds(newItems.map(item => item.Shopping_Cart_Item_id));
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
  }, []);

  // คำนวณยอดรวม 
  const totals = useMemo(() => {
    const selectedItems = items.filter(item => 
      selectedIds.includes(item.Shopping_Cart_Item_id)
    );  
    return selectedItems.reduce(
      (acc, item) => ({
        totalQuantity: acc.totalQuantity + item.quantity,
        totalPrice: acc.totalPrice + (item.product?.price || 0) * item.quantity,
      }),
      { totalQuantity: 0, totalPrice: 0 },
    );
  }, [items, selectedIds]);

  // ปรับจำนวนสินค้า 
  const updateQuantity = async (itemId: string, delta: number) => {
    const previousItems = [...items];
    const item = items.find(i => i.Shopping_Cart_Item_id === itemId);
    if (!item) return;

    const newQty = Math.max(1, item.quantity + delta);

    // Optimistic Update
    setItems(prev => prev.map(i => 
      i.Shopping_Cart_Item_id === itemId ? { ...i, quantity: newQty } : i
    ));

    try {
      await cartService.updateItemQuantity(itemId, newQty);
    } catch (error) {
      console.error("Sync failed, rolling back...");
      setItems(previousItems); 
    }
  };

  const isAllSelected = items.length > 0 && selectedIds.length === items.length;

  const toggleSelectAll = () => {
    setSelectedIds(isAllSelected ? [] : items.map(i => i.Shopping_Cart_Item_id));
  };

  const toggleSelect = (itemId: string) => {
    setSelectedIds(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  const removeItem = async (itemId: string) => {
    const previousItems = [...items];
    const newItems = items.filter(item => item.Shopping_Cart_Item_id !== itemId);
    setItems(newItems);
    setTotalItems(newItems.length);
    try {
      await cartService.deleteItem(itemId);
    } catch (error) {
      setItems(previousItems); 
    }
  };

  const getPrimaryImage = (item: ShoppingCartItem) => {
    const primary = item.product?.images?.find((img) => img.is_primary);
    return primary?.product_img_slug || item.product?.images?.[0]?.product_img_slug || "";
  };

  return {
    items,
    isLoading,
    selectedIds,
    isAllSelected,
    toggleSelectAll,
    toggleSelect,
    updateQuantity,
    removeItem,
    getPrimaryImage,
    ...totals,
  };
};
