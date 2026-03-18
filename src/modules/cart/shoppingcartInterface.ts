// body สำหรับ POST cart
export interface AddShoppingCartItemReq {
  productId: string; 
  quantity: number;
}

// สำหรับข้อมูลที่ได้รับจาก GET cart
export interface CartItem {
  cartItemId: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  imageUrl?: string;
}

export interface ShoppingCartData {
  shoppingCartId: string;
  items: CartItem[];
  grandTotal: number;
}

// สำหรับตอนแอดสำเร็จ
export interface AddCartResData {
  id: string; 
}