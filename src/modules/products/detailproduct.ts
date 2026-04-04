export interface ProductItem {
  productId: string;
  productName: string;
  description: string;
  price: number;
  weight: number;
  slug: string;
  active: boolean | null;
  featured: boolean | null;
}

export interface ProductDetailImage {
  isPrimary: boolean;
  productImgId: string;
  productImgPath: string;
}

export interface ProductDetailResData {
  product: ProductItem;
  productImages: ProductDetailImage[];
}