import { ProductHomeData } from "@/modules/products/homeproduct";
export const MOCK_PRODUCT_SHOP_DATA: ProductHomeData = {
 
  featuredProducts: [
    {
      productId: "prod-001",
      productName: "เทียนหอมกลิ่น Vanilla Dream",
      price: 350,
      isActive: true,
      productCreatedDate: "2026-01-15T08:30:00Z",
      totalSelled: 1540,
      productImgPath: "https://images.unsplash.com/photo-1602874801007-bd458bb1b8b6",
      productSlug: "vanilla-dream"
    },
    {
      productId: "prod-002",
      productName: "เทียนหอมกลิ่น Midnight Jasmine",
      price: 1290,
      isActive: true,
      productCreatedDate: "2026-02-01T10:00:00Z",
      totalSelled: 850,
      productImgPath: "https://images.unsplash.com/photo-1596433809252-260c2745dfdd",
      productSlug: "midnight-jasmine"
    }
  ],

  // สินค้าทั่วไป (Non-Featured)
  allProducts: [
    {
      productId: "prod-003",
      productName: "เทียนหอมกลิ่น  Jasmine",
      price: 199,
      isActive: true,
      productCreatedDate: "2026-02-10T14:20:00Z",
      totalSelled: 320,
      productImgPath: "https://images.unsplash.com/photo-1605651202774-7d573fd3f12d",
      productSlug: "jasmine"
    },
    {
      productId: "prod-004",
      productName: "ถุงเท้าซ่อนขอบระบายอากาศ แพ็ค 3 คู่",
      price: 150,
      isActive: true,
      productCreatedDate: "2026-02-12T09:15:00Z",
      totalSelled: 2100,
      productImgPath: "", // เคสไม่มีรูปเพื่อทดสอบ Placeholder
      productSlug: "no-show-socks-pack-3"
    },
    {
      productId: "prod-005",
      productName: "เสื้อเชิ้ตแขนสั้นลายสก็อต",
      price: 450,
      isActive: false, // เคสสินค้าปิดการใช้งาน หรือซ่อนอยู่
      productCreatedDate: "2025-12-20T11:45:00Z",
      totalSelled: 45,
      productImgPath: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=500",
      productSlug: "plaid-short-sleeve-shirt"
    },
    {
      productId: "prod-006",
      productName: "กระเป๋าเป้เดินทางกันน้ำ 20L",
      price: 890,
      isActive: true,
      productCreatedDate: "2026-03-01T16:00:00Z",
      totalSelled: 120,
      productImgPath: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500",
      productSlug: "waterproof-backpack-20l"
    }
  ],
  totalProducts: 4 
};