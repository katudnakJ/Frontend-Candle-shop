export interface ProductItem {
  productId: string;
  productName: string;
  description: string;
  price: number;
  weight: number;
  slug: string;
  isActive: string;
  isFeatured: boolean | null;
}

export interface ProductDetailImage {
  isPrimary: boolean;
  productImgId: string;
  productImgPath: string;
}

export interface ProductDetailData {
  product: ProductItem;
  productImages: ProductDetailImage[];
}