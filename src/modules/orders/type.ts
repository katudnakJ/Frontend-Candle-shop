export type OrderStatus = "PD" | "RJ" | "TS" | "TR" | "CP" | "AP";

export interface OrderItem {
  order_item_id: string; 
  order_id: string;      
  product_id: string;    
  product_name_at_purchase: string;
  price_at_purchase: number;
  quantity: number;
  // Join มาจาก product_images
  product_img_path?: string; 
}

export interface Order {
  order_id: string;     
  customer_id: string;  
  order_no: string;
  order_status: "PD" | "RJ" | "TS" | "TR" | "CP" |"AP";
  total_quantity: number;
  total_amount: number;
  net_amount: number;
  order_created_date: string;
  
  // Join มาจาก table payments
  rejection_reason?: string;
  
  // Join มาจาก table shipment
  tracking_number?: string;
  carrier?: string;
  shipping_fee?: number;

  // รายการสินค้า
  items: OrderItem[];
  slipURL?:string;
}

export interface OrderItemsResponse {
  orderItemId : string;
  pricePerUnit : number;
  productImagePath : string | null;
  productName : string;
  quantity : number;
  subTotal : number;
}

export interface OrdersResponse {
  orderId: string;
  addressLabel: string | null;
  deliveryMethod: string | null;
  netAmount: number;
  orderItems: OrderItemsResponse[];

}