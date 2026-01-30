export interface ProductImage {
  product_img_id: string;
  product_id: string;
  product_img_slug: string;
  is_primary: boolean;
}

export interface Product {
  product_id: string;
  product_name: string;
  price: number;
  weight: number;
  description: string;
  slug: string;
  is_active: boolean;
  is_featured: boolean;
  total_selled: number;
  product_created_date: string;
  product_updated_date: string;
  images?: ProductImage[]; 
}