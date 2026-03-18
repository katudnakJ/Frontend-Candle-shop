export interface ProductHomeItem {
  productId: string;
  productName: string;
  price: number;
  isActive: boolean;
  productCreatedDate: string;
  totalSold: number;
  productImgPath: string;
  productSlug: string;
}

export interface ProductHomeResData {
  allProducts: ProductHomeItem[];
  endAt: number;
  featuredProducts: ProductHomeItem[];
  hasNext: boolean;
  page: number;
  size: number;
  startAt: number;
  totalProducts: number;
}
