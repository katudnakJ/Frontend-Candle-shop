import { Product } from "./types"; // เปลี่ยน path ให้ตรงกับที่เก็บไฟล์ interface

export const mockProducts: Product[] = [
  {
    product_id: "p1",
    product_name: "เทียนหอมกลิ่น Vanilla Dream",
    price: 350,
    weight: 200,
    description: "กลิ่นวานิลลาหอมละมุน ช่วยให้ผ่อนคลาย",
    slug: "vanilla-dream",
    is_active: true,
    is_featured: true,
    total_selled: 150,
    product_created_date: "2024-03-20T10:00:00Z",
    product_updated_date: "2024-03-20T10:00:00Z",
    // ข้อมูลส่วนรูปภาพต้องตรงตาม interface ProductImage
    images: [
      {
        product_img_id: "img1",
        product_id: "p1",
        product_img_slug: "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6",
        is_primary: true,
      }
    ],
  },
  {
    product_id: "p2",
    product_name: "เทียนหอมกลิ่น Midnight Jasmine",
    price: 390,
    weight: 200,
    description: "กลิ่นมะลิยามค่ำคืน หอมเย็นสดชื่น",
    slug: "midnight-jasmine",
    is_active: true,
    is_featured: true,
    total_selled: 85,
    product_created_date: "2024-03-21T08:30:00Z",
    product_updated_date: "2024-03-21T08:30:00Z",
    images: [
      {
        product_img_id: "img2",
        product_id: "p2",
        product_img_slug: "https://images.unsplash.com/photo-1596433809252-260c2745dfdd",
        is_primary: true,
      },
      {
        product_img_id: "img3",
        product_id: "p2",
        product_img_slug: "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d",
        is_primary: false,
      }
    ],
  },
   {
    product_id: "p3",
    product_name: "เทียนหอมกลิ่น  Jasmine",
    price: 390,
    weight: 200,
    description: "กลิ่นมะลิ หอมเย็นสดชื่น",
    slug: "jasmine",
    is_active: true,
    is_featured: true,
    total_selled: 85,
    product_created_date: "2024-03-21T08:30:00Z",
    product_updated_date: "2024-03-21T08:30:00Z",
    images: [
      {
        product_img_id: "img4",
        product_id: "p3",
        product_img_slug: "https://images.unsplash.com/photo-1596433809252-260c2745dfdd",
        is_primary: false,
      },
      {
        product_img_id: "img5",
        product_id: "p3",
        product_img_slug: "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d",
        is_primary: true,
      }
    ],
  }
];