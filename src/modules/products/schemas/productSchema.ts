import { z } from "zod";

export const productSchema = z.object({
  productName: z.string().min(1, "กรุณากรอกชื่อสินค้า"),
  description: z.string().min(1, "กรุณากรอกรายละเอียดสินค้า"),
  weight: z
    .string()
    .min(1, "กรุณากรอกน้ำหนัก")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "น้ำหนักต้องเป็นตัวเลขที่มากกว่า 0",
    }),
  price: z
    .string()
    .min(1, "กรุณากรอกราคา")
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: "ราคาต้องเป็นตัวเลขที่ไม่ติดลบ",
    }),
  active: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;
