"use client";
import { useState, useEffect } from "react";
import { Addresses } from "@/modules/account/addresses";
import { PatternFormat } from "react-number-format";
import ThailandAddressTypeahead from "react-thailand-address-autocomplete";

interface AddressFormProps {
  initialData?: Addresses; // ถ้ามีคือโหมดแก้ไข
  onSubmit: (data: Addresses | Partial<Addresses>) => void;
  onCancel: () => void;
}

export default function AddressForm({
  initialData,
  onSubmit,
  onCancel,
}: AddressFormProps) {
  // สร้าง State จาก initialData ถ้าไม่มีให้เป็นค่าเริ่มต้น
  const [formData, setFormData] = useState<Partial<Addresses>>(() => {
    return (
      initialData || {
        recipient_first_name: "",
        recipient_last_name: "",
        recipient_phone: "",
        delivery_address: "",
        sub_district: "",
        district: "",
        province: "",
        postcode: "",
        address_label: "บ้าน",
        is_default: false,
      }
    );
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    const nameRegex = /^[a-zA-Zก-ฮะ-์\s]+$/;

    const phoneRegex = /^0\d{9}$/;
    const addressRegex = /^[a-zA-Z0-9ก-ฮ\u0E00-\u0E7F\s\/\-\.,]+$/;

    if (!formData.recipient_first_name?.trim()) {
      newErrors.recipient_first_name = "กรุณากรอกชื่อ";
    } else if (!nameRegex.test(formData.recipient_first_name)) {
      newErrors.recipient_first_name = "ชื่อห้ามมีอักขระพิเศษหรือตัวเลข";
    }

    if (!formData.recipient_last_name?.trim()) {
      newErrors.recipient_last_name = "กรุณากรอกนามสกุล";
    } else if (!nameRegex.test(formData.recipient_last_name)) {
      newErrors.recipient_last_name = "นามสกุลห้ามมีอักขระพิเศษหรือตัวเลข";
    }

    if (!formData.recipient_phone?.trim()) {
      newErrors.recipient_phone = "กรุณากรอกเบอร์โทรศัพท์";
    } else if (!phoneRegex.test(formData.recipient_phone)) {
      newErrors.recipient_phone =
        "เบอร์โทรต้องเป็นตัวเลข 10 หลัก และขึ้นต้นด้วย 0";
    }

    if (!formData.delivery_address?.trim()) {
      newErrors.delivery_address = "กรุณากรอกที่อยู่";
    } else if (formData.delivery_address.length < 5) {
      newErrors.delivery_address = "กรุณากรอกรายละเอียดที่อยู่ให้ชัดเจนกว่านี้";
    } else if (!addressRegex.test(formData.delivery_address)) {
      newErrors.delivery_address = "ชื่อห้ามมีอักขระพิเศษหรือตัวเลข";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      console.log(formData);
    }
  };

  // อัปเดตข้อมูลเมื่อ initialData เปลี่ยน (กรณีเปิดหน้า Edit)
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    if (name === "recipient_first_name" && value.length > 50) {
      return;
    }
    if (name === "recipient_last_name" && value.length > 50) {
      return;
    }
    
    if (name === "delivery_address" && value.length > 100) {
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-black">
      <h2 className="text-xl font-bold mb-6 text-black">
        {initialData ? "แก้ไขที่อยู่จัดส่ง" : "เพิ่มที่อยู่จัดส่ง"}
      </h2>

      <div className="space-y-4">
        {/* ชื่อ-นามสกุล */}
        <div className="grid grid-cols-2 gap-1 ">
          <div className="flex justify-between items-end mb-1">
            {/* ตัวนับอักขระ ชื่อ*/}
            <span
              className={`text-[10px] ml-auto  mr-10 ${
                (formData.recipient_first_name?.length || 0) >= 45
                  ? "text-red-500 font-bold"
                  : "text-gray-400"
              }`}
            >
              {formData.recipient_first_name?.length || 0}/50
            </span>
          </div>
          <div className="col-span-2 mb-2">
            <input
              name="recipient_first_name"
              placeholder="ชื่อผู้รับ *"
              value={formData.recipient_first_name}
              onChange={handleChange}
              className={`p-3 border-2 text-black border-gray-200 rounded-xl focus:border-black outline-none transition-all ${
                errors.recipient_first_name
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200"
              }`}
            />
            {errors.recipient_first_name && (
              <span className="text-red-500 text-xs ml-1">
                <br />
                {errors.recipient_first_name}
              </span>
            )}
          </div>

          <div className="flex justify-between items-end mb-1">
            {/* ตัวนับอักขระ นามสกุล*/}
            <span
              className={`text-[10px] ml-auto  mr-10 ${
                (formData.recipient_last_name?.length || 0) >= 45
                  ? "text-red-500 font-bold"
                  : "text-gray-400"
              }`}
            >
              {formData.recipient_last_name?.length || 0}/50
            </span>
          </div>

          <div className="col-span-2 ">
            <input
              name="recipient_last_name"
              placeholder="นามสกุลผู้รับ *"
              value={formData.recipient_last_name}
              onChange={handleChange}
              className={`p-3 border-2 text-black border-gray-200 rounded-xl focus:border-black outline-none transition-all ${
                errors.recipient_last_name
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200"
              }`}
            />

            {errors.recipient_last_name && (
              <span className="text-red-500 text-xs ml-1">
                <br />
                {errors.recipient_last_name}
              </span>
            )}
          </div>
        </div>

        {/* เบอร์โทร */}

        <div className="flex justify-between items-end mb-1">
          {/* ตัวนับอักขระ เบอร์โทร*/}
          <span className={`text-[10px] ml-auto  mr-10 text-gray-400 `}>
            {formData.recipient_phone?.length || 0}/10
          </span>
        </div>
        <div>
          <PatternFormat
            format="###-###-####"
            mask="#"
            name="recipient_phone"
            placeholder="เบอร์โทรศัพท์มือถือ เช่น 0123456789 *"
            value={formData.recipient_phone}
            onValueChange={(values) => {
              setFormData((prev) => ({
                ...prev,
                recipient_phone: values.value,
                
              }));
              
            }}
            className={`w-full p-3 border-2 text-black border-gray-200 rounded-xl focus:border-black outline-none transition-all ${
              errors.recipient_phone
                ? "border-red-500 bg-red-50"
                : "border-gray-200"
            }`}
          />
          {errors.recipient_phone && (
            <span className="text-red-500 text-xs ml-1">
              {errors.recipient_phone}
            </span>
          )}
        </div>

        {/* ที่อยู่ */}

        <div className="flex justify-between items-end mb-1">
          {/* ตัวนับอักขระ นามสกุล*/}
          <span
            className={`text-[10px] ml-auto  mr-10 ${
              (formData.delivery_address?.length || 0) >= 70
                ? "text-red-500 font-bold"
                : "text-gray-400"
            }`}
          >
            {formData.delivery_address?.length || 0}/100
          </span>
        </div>
        <div>
          <input
            name="delivery_address"
            placeholder="บ้านเลขที่, ถนน, ซอย *"
            value={formData.delivery_address}
            onChange={handleChange}
            className={`w-full p-3 border-2 text-black border-gray-200 rounded-xl focus:border-black outline-none transition-all ${
              errors.delivery_address
                ? "border-red-500 bg-red-50"
                : "border-gray-200"
            }`}
          />
          {errors.delivery_address && (
            <span className="text-red-500 text-xs ml-1">
              {errors.delivery_address}
            </span>
          )}
        </div>
        {/* ประเภทที่อยู่ */}
        <div className="flex gap-4 items-center pt-2">
          <span className="text-sm text-black font-bold">ประเภทที่อยู่:</span>
          {["บ้าน", "ที่ทำงาน", "คอนโด", "อื่นๆ"].map((label) => (
            <button
              key={label}
              onClick={() => setFormData({ ...formData, address_label: label })}
              className={`px-4 py-2 rounded-xl border-2 transition-all ${
                formData.address_label === label
                  ? "border-black bg-black text-white"
                  : "border-gray-200 text-black"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ปุ่มบันทึก/ยกเลิก */}
        <div className="flex gap-3 pt-6">
          <button
            onClick={handleSubmit}
            className="flex-1 bg-cprojectpink p-4 rounded-2xl font-bold text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none"
          >
            บันทึก
          </button>
          <button
            onClick={onCancel}
            className="flex-1 font-bold text-black  underline"
          >
            ยกเลิก
          </button>
        </div>
      </div>
    </div>
  );
}
