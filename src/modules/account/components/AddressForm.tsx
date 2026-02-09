"use client";
import { useState, useMemo } from "react";
import { Addresses } from "@/modules/account/addresses";
import { PatternFormat } from "react-number-format";
import { Select } from "antd";
import type { DefaultOptionType } from "antd/es/select";
import addressdata from "@/modules/account/addressdata.json";


type ZipCode = number[];
type Tambon = [string, ZipCode];
type Amphoe = [string, Tambon[]];
type Province = [string, Amphoe[]];

const MockAddress = addressdata as unknown as Province[];

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

    if (!formData.province) {
      newErrors.province = "กรุณาเลือกจังหวัด";
    }
    if (!formData.district) {
      newErrors.district = "กรุณาเลือกอำเภอ/เขต";
    }
    if (!formData.sub_district) {
      newErrors.sub_district = "กรุณาเลือกตำบล/แขวง";
    }
    if (!formData.postcode) {
      newErrors.postcode = "กรุณากรอกรหัสไปรษณีย์";
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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const currentProvince = useMemo(() => MockAddress.find((p) => p[0] === formData.province),[formData.province]);
  const currentAmphoe = useMemo(() =>currentProvince?.[1].find(
    (a) => a[0] === formData.district),[currentProvince, formData.district]
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-black">
      <h2 className="text-xl font-bold mb-6 text-black">
        {initialData ? "แก้ไขที่อยู่จัดส่ง" : "เพิ่มที่อยู่จัดส่ง"}
      </h2>

      <div className="space-y-4">
        {/* ชื่อ-นามสกุล */}
        <div className="grid grid-cols-1 max-w-[400px] gap-y-0 ">
          <div className=" flex flex-col w-full">
            <div className="flex justify-end  mb-1">
              {/* ตัวนับอักขระ ชื่อ*/}

              <span
                className={`text-[10px] mr-10 ${
                  (formData.recipient_first_name?.length || 0) >= 45
                    ? "text-red-500 font-bold"
                    : "text-gray-400"
                }`}
              >
                {formData.recipient_first_name?.length || 0}/50
              </span>
            </div>
            <input
              name="recipient_first_name"
              placeholder="ชื่อผู้รับ *"
              maxLength={50}
              value={formData.recipient_first_name}
              onChange={handleChange}
              className={`w-full p-3 border-1 text-black  border-gray-200 rounded-xl focus:border-black outline-none transition-all ${
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

          <div className="flex flex-col w-full">
            <div className="flex justify-end mb-1">
              {/* ตัวนับอักขระ นามสกุล*/}
              <span
                className={`text-[10px] mr-10 ${
                  (formData.recipient_last_name?.length || 0) >= 45
                    ? "text-red-500 font-bold"
                    : "text-gray-400"
                }`}
              >
                {formData.recipient_last_name?.length || 0}/50
              </span>
            </div>

            <input
              name="recipient_last_name"
              placeholder="นามสกุลผู้รับ *"
              maxLength={50}
              value={formData.recipient_last_name}
              onChange={handleChange}
              className={`max-[340px]:w-full p-3 border-1 text-black border-gray-200 rounded-xl focus:border-black outline-none transition-all ${
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
            className={`w-full p-3 border-1 text-black border-gray-200 rounded-xl focus:border-black outline-none transition-all ${
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
            maxLength={100}
            value={formData.delivery_address}
            onChange={handleChange}
            className={`w-full p-3 border-1 text-black border-gray-200 rounded-xl focus:border-black outline-none transition-all ${
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

        <div>
          <div className="grid grid-cols-2 gap-4 pt-2 text-black">
            <div>
              {/* จังหวัด */}

              <Select
                showSearch
                status={errors.province ? "error" : ""}
                placeholder="จังหวัด *"
                value={formData.province || undefined}
                className="h-12 w-full custom-select rounded-xl "
                options={MockAddress.map((p) => ({
                  label: p[0],
                  value: p[0],
                }))}
                onSelect={(val: string) => {
                  setFormData((prev) => ({
                    ...prev,
                    province: val,
                    district: "",
                    sub_district: "",
                    postcode: "",
                  }));
                  setErrors((prev) => ({ ...prev, province: "" }));
                }}
              />
              {errors.province && (
                <span className="text-red-500 text-[10px] ml-1">
                  {errors.province}
                </span>
              )}
            </div>

            <div>
              {/* อำเภอ */}
              <Select
                showSearch
                disabled={!formData.province}
                status={errors.district ? "error" : ""}
                placeholder="อำเภอ/เขต *"
                value={formData.district || undefined}
                className="h-12 w-full"
                options={currentProvince?.[1].map((a, index) => ({
                  label: a[0],
                  value: a[0],
                  key: index,
                }))}
                onSelect={(val: string, option: DefaultOptionType) => {
                  const aIdx = Number(option.key);
                  // ดึงตำบลแรกของอำเภอนั้นมาใส่ให้เลยเพื่อความสะดวก
                  const firstTambon = currentProvince?.[1][aIdx][1][0][0] || "";
                  setFormData((prev) => ({
                    ...prev,
                    district: val,
                    sub_district: firstTambon,
                    postcode: "",
                  }));
                }}
              />
              {errors.district && (
                <span className="text-red-500 text-[10px] ml-1">
                  {errors.district}
                </span>
              )}
            </div>

            <div>
              {/* ตำบล */}
              <Select
                showSearch
                disabled={!formData.district}
                status={errors.sub_district ? "error" : ""}
                placeholder="ตำบล/แขวง *"
                value={formData.sub_district || undefined}
                className="h-12 w-full"
                options={currentAmphoe?.[1].map((t, index) => ({
                  label: t[0],
                  value: t[0],
                  key: index,
                }))}
                onSelect={(val: string, option: DefaultOptionType) => {
                  const tIdx = Number(option.key);

                  // ดึงรหัสไปรษณีย์ (Zipcode อยู่ที่ t[1][0])
                  const zip = currentAmphoe?.[1][tIdx][1][0] || "";
                  setFormData((prev) => ({
                    ...prev,
                    sub_district: val,
                    postcode: zip.toString(),
                  }));
                }}
              />
              {errors.sub_district && (
                <span className="text-red-500 text-[10px] ml-1">
                  {errors.sub_district}
                </span>
              )}
            </div>
            <div>
              {/* รหัสไปรษณีย์  */}
              <input
                readOnly
                placeholder="รหัสไปรษณีย์ *"
                value={formData.postcode}
                className="p-3 border-2 border-gray-100 bg-gray-50 text-gray-500 rounded-xl outline-none w-full cursor-not-allowed"
              />
            </div>
          </div>

          {/* ประเภทที่อยู่ */}
          <div className="inline-block space-x-2 md:space-x-3  items-center pt-2 mb-4">
            <span className="text-sm text-black font-bold">ประเภทที่อยู่:</span>
            {["บ้าน", "ที่ทำงาน", "คอนโด", "อื่นๆ"].map((label) => (
              <button
                key={label}
                onClick={() =>
                  setFormData({ ...formData, address_label: label })
                }
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

          {/* ปุ่มปรับ default */}
          <div className="flex item-center gap-3 pt-2 ">
            <button
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  is_default: !prev.is_default,
                }))
              }
              className={`relative inline-flex h-8 w-20 items-center rounded-full transition-colors focus:outline-none border-2 border-black ${
                formData.is_default ? "bg-green-500" : "bg-gray-200"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                  formData.is_default ? "translate-x-14" : "translate-x-1"
                }`}
              />
            </button>
            <span className={`text-sm font-bold text-black content-center ${ formData.is_default ? "text-black " : "text-gray-500"}`}>
              ตั้งเป็นที่อยู่เริ่มต้น
            </span>
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
    </div>
  );
}
