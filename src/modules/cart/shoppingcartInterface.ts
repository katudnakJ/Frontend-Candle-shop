// body สำหรับ POST cart
export interface AddShoppingCartItemReq {
  productId: string; 
  quantity: number;
}

// สำหรับข้อมูลที่ได้รับจาก GET cart
export interface CartItem {
  price: number;
  productId: string;
  productImgPath?: string;
  productName: string;
  productSlug:string;
  quantity: number;
  shoppingCartItemId:string;
}

export interface ShoppingCartData {
  shoppingCartId: string;
  cartItems: CartItem[];
}

// สำหรับตอนแอดสำเร็จ
export interface AddCartResData {
  id: string; 
}