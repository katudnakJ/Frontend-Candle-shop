export interface CheckoutRequest {
  shoppingCartItemIds: string[];
  addressId: string;
  imageData: File; 
}