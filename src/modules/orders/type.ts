export type OrderStatus = "PD" | "RJ" | "TS" | "TR" | "CP" | "AP";

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
  orderNo: string;
  orderStatus: string;
  rejectionReason: string | null;
  paymentStatus: string;
  orderCreatedAt: string;
  totalAmount: number;
  totalQuantity: number;
  trackingNo: string[];
  orderItems: OrderItemsResponse[];
}

export interface OrderRejectPayload {
  orderId: string;
  reason: string;
}

export interface AddTrackingNumberPayload {
  orderId: string;
  trackingNumber: string[];
}
export interface TrackOrderReq {
  trackingNumber: string[];
}