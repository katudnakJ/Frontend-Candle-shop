export interface Payment {
  payment_id: string;
  order_id: string;
  seller_id: string;
  slip_image_url: string;
  payment_status: 'PD' | 'TS' | 'RJ' | 'CP' | 'AP';
  admin_comment?: string;
  payment_request_Date: string;
  approve_date?: string;
  receipt_number?: string;
}

export interface Shipment {
  shipping_id: string;
  order_id: string;
  shipping_name: string;
  shipping_type: string;
  shipping_fee: number;
  tracking_number: string;
}