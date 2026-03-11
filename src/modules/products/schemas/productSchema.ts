import { z } from "zod";

export const productSchema = z.object({
  productName: z.string().min(1, "กรุณากรอกชื่อสินค้า"),
  description: z.string().min(1, "กรุณากรอกรายละเอียดสินค้า"),
  weight: z.string().min(1, "กรุณากรอกน้ำหนัก").regex(/^\d*\.?\d*$/, "กรุณาระบุเป็นตัวเลข"),
  price: z.string().min(1, "กรุณากรอกราคา").regex(/^\d+$/, "กรุณาระบุเป็นตัวเลข"),
  isActive: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
