import {
  Controller,
  Control,
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";
import { Switch, FormControlLabel, Typography } from "@mui/material";
import { ProductFormValues } from "@/modules/products/schemas/productSchema";

interface ProductFormFieldsProps {
  register: UseFormRegister<ProductFormValues>;
  errors: FieldErrors<ProductFormValues>;
  control: Control<ProductFormValues>;
  isEditMode: boolean;
}

export const ProductFormFields = ({
  register,
  errors,
  control,
  isEditMode,
}: ProductFormFieldsProps) => {
  return (
    <>
      <div className="space-y-5">
        <div className="flex flex-col">
          <label className="text-sm font-bold ml-1 mb-1">ชื่อสินค้า</label>
          <input
            {...register("productName")}
            placeholder="เช่น เทียนหอม Soy Wax"
            className={`w-full p-3 max-[440px]:text-[12px] border-2 rounded-xl outline-none transition-all ${
              errors.productName
                ? "border-red-500 bg-red-50"
                : "border-black focus:bg-cprojecttwo focus:ring-2 focus:ring-black/5"
            }`}
          />
          {errors.productName && (
            <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
              {errors.productName.message}
            </p>
          )}
        </div>

        <div className="flex flex-col">
          <label className="text-sm  font-bold ml-1 mb-1">
            รายละเอียดสินค้า
          </label>
          <textarea
            {...register("description")}
            rows={4}
            placeholder="คำอธิบายสินค้า เช่น ช่วยทำให้ผ่อนคลาย..."
            className={`w-full p-3 max-[440px]:text-[12px] border-2 rounded-xl outline-none transition-all ${
              errors.description
                ? "border-red-500 bg-red-50"
                : "border-black focus:bg-cprojecttwo focus:ring-2 focus:ring-black/5"
            }`}
          />
          {errors.description && (
            <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-bold ml-1 mb-1">น้ำหนัก</label>
            <div className="relative">
              <input
                {...register("weight")}
                  type="number"
                min="0"
                step="1"
                placeholder="0"
                className={`w-full p-3 max-[440px]:text-[12px] border-2 rounded-xl pr-10 outline-none transition-all ${
                  errors.weight
                    ? "border-red-500 bg-red-50"
                    : "border-black focus:bg-cprojecttwo focus:ring-2 focus:ring-black/5"
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs pointer-events-none">
                Kg
              </span>
            </div>
            {errors.weight && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                {errors.weight.message}
              </p>
            )}
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-bold ml-1 mb-1">ราคา/ชิ้น</label>
            <div className="relative">
              <input
                {...register("price")}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                className={`w-full p-3 max-[440px]:text-[12px] border-2 rounded-xl pr-10 outline-none transition-all ${
                  errors.price
                    ? "border-red-500 bg-red-50"
                    : "border-black focus:bg-cprojecttwo focus:ring-2 focus:ring-black/5"
                }`}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 font-bold text-xs pointer-events-none">
                บาท
              </span>
            </div>
            {errors.price && (
              <p className="text-red-500 text-xs mt-1 ml-1 font-medium">
                {errors.price.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {isEditMode && (
        <div className="flex items-center gap-3 py-4 px-1 bg-gray-50 rounded-2xl mb-4">
          <Controller
            name="isActive"
            control={control}
            render={({ field: { onChange, value } }) => (
              <FormControlLabel
                className="ml-0"
                control={
                  <Switch
                    checked={value}
                    onChange={(e) => onChange(e.target.checked)}
                    color="success"
                    sx={{
                      "& .MuiSwitch-switchBase.Mui-checked": {
                        color: "#4ADE80",
                      },
                      "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                        {
                          backgroundColor: "#4ADE80",
                        },
                    }}
                  />
                }
                label={
                  <div className="flex flex-col ml-2">
                    <Typography className="font-black text-sm font-prompt">
                      สถานะการขาย: {value ? "เปิดใช้งาน" : "ปิดชั่วคราว"}
                    </Typography>
                    <Typography className="text-[10px] text-gray-500 font-prompt">
                      {value
                        ? "สินค้าจะแสดงบนหน้าร้านค้าตามปกติ"
                        : "ลูกค้าจะไม่สามารถกดสั่งซื้อสินค้านี้ได้"}
                    </Typography>
                  </div>
                }
              />
            )}
          />
        </div>
      )}
    </>
  );
};
