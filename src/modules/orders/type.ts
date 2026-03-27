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
  order_status: "PD" | "RJ" | "TS" | "TR" | "CP" | "AP";
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
  slipURL?: string;
}

export interface OrderItemsResponse {
  orderItemId: string;
  pricePerUnit: number;
  productImagePath: string | null;
  productName: string;
  quantity: number;
  subTotal: number;
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

export interface GetSignedFileResponse {
  signedFileUrl: string;
  expiresAt: string;
}

export interface PDFSignedUrlResponse {
  signedFileUrl: string;
  expiresAt: string;
}

export type PDFResponse = {
  pdfName: string;
  pdfSignedUrl: PDFSignedUrlResponse;
};

export interface OrderDetailInfo {
  addressLabel: string;
  completedAt: string | null;
  deliveryAddress: string;
  deliveryMethod: string | null;
  district: string;
  netAmount: number;
  orderCreatedAt: string;
  orderId: string;
  orderNo: string;
  orderStatus: string;
  paymentApproveAt: string | null;
  paymentCreatedAt: string;
  postcode: string;
  province: string;
  recipientFirstName: string;
  recipientLastName: string;
  recipientPhone: string;
  rejectionReason: string | null;
  subDistrict: string;
  totalAmount: number;
  totalQuantity: number;
  trackingNumber: string[];
}

export interface OrderDetailItem {
  orderItemId: string;
  pricePerUnit: number;
  productImagePath: string | null;
  productName: string;
  quantity: number;
  subTotal: number;
}

export interface OrderDetailResponse {
  orderDetail: OrderDetailInfo;
  orderItems: OrderDetailItem[];
}


export interface UpdatePaymentSlipRequest {
  orderId: string;
  imageData: File; 
}
