export interface ProductHomeItem {
  productId: string;
  productName: string;
  price: number;
  isActive: boolean;
  productCreatedDate: string;
  totalSelled: number;
  productImgPath: string;
  productSlug: string;
}

export interface ProductHomeData {
  featuredProduct: ProductHomeItem[];
  nonFeaturedProduct: ProductHomeItem[];
  nonFeaturedTotal: number;
}