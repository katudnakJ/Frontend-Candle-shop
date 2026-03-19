import { ShoppingCart } from "../types";
import { MOCK_CART_DATA } from "../mockcart";

// จำลองการ Delay เหมือนการเรียก API จริง
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const cartService = {
  // 1. ดึงข้อมูลรถเข็นทั้งหมด
  async getCart(): Promise<ShoppingCart> {
    await delay(500); // จำลองเน็ตช้าเล็กน้อย
    return { ...MOCK_CART_DATA };
  },

  // 2. อัปเดตจำนวนสินค้า
  async updateItemQuantity(itemId: string, quantity: number): Promise<void> {
    await delay(300);
    console.log(`[API Update]: Item ${itemId} set to ${quantity}`);
    // ในอนาคต: await axios.patch(`/cart/items/${itemId}`, { quantity });
  },

  // 3. ลบสินค้าออกจากรถเข็น
  async deleteItem(itemId: string): Promise<void> {
    await delay(300);
    console.log(`[API Delete]: Item ${itemId} removed`);
    // ในอนาคต: await axios.delete(`/cart/items/${itemId}`);
  },

  //   4. (แถม) ตรวจสอบสต็อกสินค้าก่อนเพิ่ม/ลด
  //  async checkStock(productId: string): Promise<number> {
  //     สมมติว่าสต็อกมีจำกัด
  //     return 10;
  //   }
};
