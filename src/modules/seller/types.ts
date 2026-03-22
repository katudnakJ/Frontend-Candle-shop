export interface Seller {
  seller_id: string;
  user_id: string;
  qr_payment_img_path: string;
}

export interface GetSignedFileResponse {
  signedFileUrl: string;
  expiresAt: string;
}