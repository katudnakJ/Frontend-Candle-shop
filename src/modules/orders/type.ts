export interface OrderItem {
  order_item_id: number;
  order_id: string;
  product_id: string;
  product_name_at_purchase: string;
  price_at_purchase: number;
  quantity: number;
}

export interface Order {
  order_id: string;
  customer_id: string;
  total_quantity: number;
  total_amount: number;
  net_amount: number;
  order_status: "PD" | "RJ" | "TS" | "TR" | "CM";
  order_created_date: string;
  total_amount_purchase: number;
  total_quantity_amount: number;
}
