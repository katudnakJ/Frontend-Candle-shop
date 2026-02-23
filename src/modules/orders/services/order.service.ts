import axios from "axios";
import { Order } from "../type";

// กำหนด Base URL ของ Backend Java (ปรับตามจริงของคุณ)
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

export const OrderService = {
  getOrders: async (): Promise<Order[]> => {
    // 1. ดึง Token จากที่ที่คุณเก็บไว้ (เช่น Cookie หรือ LocalStorage)
    try {
      const token = localStorage.getItem("access_token");

      const response = await axios.get(`${API_URL}/orders/my-orders`, {
        headers: {
          // 2. แนบ Token ไปในรูปแบบ Bearer
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error in getOrders:", error);
      throw error;
    }
  },
  getOrdersByCustomerId: async (customerId: string): Promise<Order[]> => {
    try {
      const response = await axios.get<Order[]>(
        `${API_URL}/orders/customer/${customerId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  },

  /**
   * ยืนยันการได้รับสินค้า (เปลี่ยนสถานะจาก TR เป็น CM)
   */
  confirmOrderReceipt: async (orderId: string): Promise<void> => {
    try {
      await axios.put(`${API_URL}/orders/${orderId}/confirm`);
    } catch (error) {
      console.error("Error confirming order:", error);
      throw error;
    }
  },

  /**
   * ดึงรายละเอียดออเดอร์เดียว (เผื่อใช้ในหน้า Detail)
   */
  getOrderById: async (orderId: string): Promise<Order> => {
    try {
      const response = await axios.get<Order>(`${API_URL}/orders/${orderId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching order detail:", error);
      throw error;
    }
  },
};
