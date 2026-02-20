import { Order } from "./type";

export const mockOrders: Order[] = [
  {
    order_id: "uuid-1",
    customer_id: "cus-123",
    order_no: "CD28120001",
    order_status: "RJ", // การชำระเงินถูกปฏิเสธ
    total_quantity: 200,
    total_amount: 15000,
    net_amount: 15120,
    order_created_date: "2026-02-20T10:30:00Z",
    rejection_reason: "ส่งสลิปผิดรูป", // จาก table payments
    shipping_fee: 120, // จาก table shipment
    items: [
      {
        order_item_id: "oi-1",
        order_id: "uuid-1",
        product_id: "p-1",
        product_name_at_purchase: "เทียนหอมกลิ่นกุหลาบ",
        price_at_purchase: 75,
        quantity: 200,
        product_img_path:
          "https://images.unsplash.com/photo-1596433809252-260c2745dfdd", // จาก table product_images
      },
    ],
  },
  {
    order_id: "uuid-4",
    customer_id: "cus-123",
    order_no: "CD28120004",
    order_status: "PD", // การชำระเงินถูกปฏิเสธ
    total_quantity: 200,
    total_amount: 15000,
    net_amount: 15120,
    order_created_date: "2026-02-20T10:30:00Z",
    rejection_reason: "", // จาก table payments
    carrier: "Flash Express",
    shipping_fee: 240, // จาก table shipment
    items: [
      {
        order_item_id: "oi-1",
        order_id: "uuid-1",
        product_id: "p-1",
        product_name_at_purchase: "เทียนหอมกลิ่นกุหลาบ",
        price_at_purchase: 75,
        quantity: 200,
        product_img_path:
          "https://images.unsplash.com/photo-1596433809252-260c2745dfdd", // จาก table product_images
      },
    ],
  },
  {
    order_id: "uuid-2",
    customer_id: "cus-123",
    order_no: "CD28120002",
    order_status: "TS", // ที่ต้องจัดส่ง
    total_quantity: 1,
    total_amount: 500,
    net_amount: 550,
    order_created_date: "2026-02-19T14:00:00Z",
    carrier: "Flash Express",
    shipping_fee: 50,
    items: [
      {
        order_item_id: "oi-2",
        order_id: "uuid-2",
        product_id: "p-2",
        product_name_at_purchase: "โคมไฟตั้งโต๊ะ",
        price_at_purchase: 500,
        quantity: 1,
        product_img_path:
          "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d",
      },
    ],
  },
  {
    order_id: "uuid-3",
    customer_id: "cus-123",
    order_no: "CD28120003",
    order_status: "TR", // ที่ต้องได้รับ
    total_quantity: 2,
    total_amount: 300,
    net_amount: 650,
    order_created_date: "2026-02-18T09:00:00Z",
    tracking_number: "FD1058412308F", // จาก table shipment ///ต้องมาเพิ่มการ ใส่ tracking number  มากว่า 1 กล่อง
    carrier: "Flash Express", // จาก table shipment
    shipping_fee: 50,
    items: [
      {
        order_item_id: "oi-3",
        order_id: "uuid-3",
        product_id: "p-3",
        product_name_at_purchase: "น้ำหอมปรับอากาศ",
        price_at_purchase: 300,
        quantity: 1,
        product_img_path:
          "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6",
      },

      {
        order_item_id: "oi-7",
        order_id: "uuid-3",
        product_id: "p-3",
        product_name_at_purchase: "น้ำหอมปรับอากาศ",
        price_at_purchase: 300,
        quantity: 1,
        product_img_path:
          "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6",
      },
    ],
  },

  {
    order_id: "uuid-5",
    customer_id: "cus-123",
    order_no: "CD28120003",
    order_status: "CM", // ที่ต้องได้รับ
    total_quantity: 1,
    total_amount: 300,
    net_amount: 350,
    order_created_date: "2026-02-18T09:00:00Z",
    tracking_number: "FD1058412308F", // จาก table shipment
    carrier: "Flash Express", // จาก table shipment
    shipping_fee: 50,
    items: [
      {
        order_item_id: "oi-3",
        order_id: "uuid-3",
        product_id: "p-3",
        product_name_at_purchase: "น้ำหอมปรับอากาศ",
        price_at_purchase: 300,
        quantity: 1,
        product_img_path:
          "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6",
      },
    ],
  },
];
