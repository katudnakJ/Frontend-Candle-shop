import { useState, useMemo, useEffect } from "react";
import { ShoppingCart, ShoppingCartItem } from "@/modules/cart/types";
import { cartService } from "../services/cartService";

export const useCart = (initialCart: ShoppingCart) => {
  const [items, setItems] = useState<ShoppingCartItem[]>(
    initialCart.items || [],
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const data = await cartService.getCart();
        setItems(data.items || []);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCart();
  }, []);

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  useEffect(() => {
    if (items.length > 0 && selectedIds.length === 0) {
      setSelectedIds(items.map(item => item.Shopping_Cart_Item_id));
    }
  }, [items]);

  // 1. คำนวณยอดรวมทั้งหมด (คิดเฉพาะรายการที่มีข้อมูล product)
  const totals = useMemo(() => {
   const selectedItems = items.filter(item => 
      selectedIds.includes(item.Shopping_Cart_Item_id)
    );  
    return selectedItems.reduce(
      (acc, item) => {
        const cart_item_price = item.product?.price || 0;
        return {
          totalQuantity: acc.totalQuantity + item.quantity,
          totalPrice: acc.totalPrice + cart_item_price * item.quantity,
        };
      },
      { totalQuantity: 0, totalPrice: 0 },
    );
  }, [items, selectedIds]);

  const getPrimaryImage = (item: ShoppingCartItem) => {
    const primary = item.product?.images?.find((img) => img.is_primary);
    return (
      primary?.product_img_slug ||
      item.product?.images?.[0]?.product_img_slug ||
      ""
    );
  };

  // 2. ฟังก์ชันปรับจำนวนสินค้า (เพิ่ม/ลด)
  const updateQuantity = async (itemId: string, delta: number) => {
    const item = items.find(i => i.Shopping_Cart_Item_id === itemId);
    if (!item) return;

    const newQty = Math.max(1, item.quantity + delta);

    setItems((prev) =>
      prev.map((i) =>
        i.Shopping_Cart_Item_id === itemId
          ? { ...i, quantity: newQty }
          : i,
      ),
    );

    try {
      await cartService.updateItemQuantity(itemId, newQty);
    } catch (error) {
      
      console.error("Sync failed");
    }
  };

  const isAllSelected = items.length > 0 && selectedIds.length === items.length;

  const toggleSelectAll = () => {
  if (isAllSelected) {
    setSelectedIds([]); // ถ้าเลือกหมดอยู่แล้ว ให้เคลียร์ออก
  } else {
    setSelectedIds(items.map((i) => i.Shopping_Cart_Item_id)); // เลือกทุกตัว
  }
};

  const toggleSelect = (itemId: string) => {
    setSelectedIds((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId],
    );
  };

  // 3. ฟังก์ชันลบสินค้าออกจากตะกร้า
  const removeItem = async(itemId: string) => {
    setItems((prev) =>
      prev.filter((item) => item.Shopping_Cart_Item_id !== itemId));
    await cartService.deleteItem(itemId);
  };

  return {
    items,
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
