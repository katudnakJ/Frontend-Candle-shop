export interface ProductHomeItem {
  productId: string;
  productName: string;
  price: number;
  active: boolean;
  productCreatedDate: string;
  totalSold: number;
  productSlug: string;
  productImgPath: string;
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


export interface SearchProductResData {
  endAt: number;
  hasNext: boolean;
  page: number;
  products: ProductHomeItem[];
  size: number;
  startAt: number;
  totalProducts: number;
}

export interface CreateProductRequest {
  productName: string;
  price: number;
  weight: number;
  description: string;
  active: boolean;
  featured: boolean;
  primary_index: number | string; 
  imagesData: File[];
  existingImages?: string[];    
}


export interface CreateProductResData {
  product_id: string;
}