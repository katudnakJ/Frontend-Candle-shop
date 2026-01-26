import { Product } from "../products/type";

export interface ShoppingCartItem {
  Shopping_Cart_Item_id: string;
  Shopping_Cart_id: string;
  product_id: string;
  quantity: number;
  product?: Product;
}

export interface ShoppingCart {
  Shopping_Cart_id: string;
  Customer_id: string;
  items?: ShoppingCartItem[];
}

