"use client";
import { useAddressForm } from "../hooks/useAddressForm";
import { PatternFormat } from "react-number-format";
import { Select } from "antd";
import { Addresses } from "@/modules/account/addresses";
import { toast } from "react-hot-toast";
import ConfirmDialog from "@/components/commonui/ConfirmDialog";
import { useState } from "react";

interface AddressFormProps {
  initialData?: Addresses;
  onSubmit: (data: Addresses | Partial<Addresses>) => void;
  onCancel: () => void;
}

export default function AddressForm({
  initialData,
  onSubmit,
  onCancel,
}: AddressFormProps) {
    
  // Logic ทั้งหมดมาจาก Hook useAddressForm
  const {
    formData,
    setFormData,
    errors,
    setErrors,
    handleChange,
    validateForm,
    currentProvinceData,
    currentAmphoeData,
    provinces,
  } = useAddressForm(initialData);

  const [openConfirm, setOpenConfirm] = useState(false);

  const handleInternalSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
    }
  };
  const handleCheckValid = () => {
    if (validateForm()) {
      setOpenConfirm(true);
    } else {
      toast.error(
        <div className="flex flex-col justify-center py-1">
          <span className="leading-tight">
            กรุณาระบุข้อมูลให้ครบถ้วน
          </span>
        </div>,
        {
          className:
            " bg-white border-2 border-cprojectone rounded-xl font-bold shadow-2xl text-black mx-auto sm:ml-auto sm:mr-6 h-20",
          duration: 3000,
        },
      );
    }
  };
  const handleConfirmAddToAccount = () => {
    toast.success(
      <div className="flex flex-col justify-center py-1">
        <span className="leading-tight"> {initialData ? "แก้ไขที่อยู่จัดส่ง" : "เพิ่มที่อยู่จัดส่ง"} เรียบร้อยแล้ว!</span>
      </div>,
      {
        className:
          " bg-white border-2 border-cprojectone rounded-xl font-bold shadow-2xl text-black mx-auto sm:ml-auto sm:mr-6 h-20",
        duration: 3000,
      },
    );
    setOpenConfirm(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border-2 border-black  ">
      <h2 className="text-xl font-bold mb-6 text-black">
        {initialData ? "แก้ไขที่อยู่จัดส่ง" : "เพิ่มที่อยู่จัดส่ง"}
      </h2>

      <div className="space-y-6">
        {/* ข้อมูลผู้รับ ชื่อ-นามสกุล*/}
        <div className="grid grid-cols-1 max-w-[400px] gap-4">
          {/* ชื่อผู้รับ */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-black">
                ชื่อผู้รับ *
              </label>
              <span
                className={`text-[10px] ${formData.recipient_first_name?.length === 50 ? "text-red-500" : "text-gray-400"}`}
              >
                {formData.recipient_first_name?.length || 0}/50
              </span>
            </div>
            <input
              name="recipient_first_name"
              maxLength={50}
              value={formData.recipient_first_name}
              onChange={handleChange}
              placeholder="กรุณากรอกชื่อ"
              className={`w-full p-3 border-2 rounded-xl text-black focus:border-black outline-none transition-all ${
                errors.recipient_first_name
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200"
              }`}
            />
            {errors.recipient_first_name && (
              <span className="text-red-500 text-xs">
                {errors.recipient_first_name}
              </span>
            )}
          </div>

          {/* นามสกุลผู้รับ */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-black">
                นามสกุลผู้รับ *
              </label>
              <span
                className={`text-[10px] ${formData.recipient_last_name?.length === 50 ? "text-red-500" : "text-gray-400"}`}
              >
                {formData.recipient_last_name?.length || 0}/50
              </span>
            </div>
            <input
              name="recipient_last_name"
              maxLength={50}
              value={formData.recipient_last_name}
              onChange={handleChange}
              placeholder="กรุณากรอกนามสกุล"
              className={`w-full p-3 border-2 rounded-xl text-black focus:border-black outline-none transition-all ${
                errors.recipient_last_name
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200"
              }`}
            />
            {errors.recipient_last_name && (
              <span className="text-red-500 text-xs">
                {errors.recipient_last_name}
              </span>
            )}
          </div>
        </div>

        {/* ช่องทางการติดต่อ  */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-bold text-black">
            เบอร์โทรศัพท์มือถือ *
          </label>
          <PatternFormat
            format="###-###-####"
            mask="#"
            value={formData.recipient_phone}
            onValueChange={(v) =>
              setFormData((prev) => ({ ...prev, recipient_phone: v.value }))
            }
            placeholder="เช่น 081-234-5678"
            className={`w-full p-3 border-2 rounded-xl text-black focus:border-black outline-none transition-all ${
              errors.recipient_phone
                ? "border-red-500 bg-red-50"
                : "border-gray-200"
            }`}
          />
          {errors.recipient_phone && (
            <span className="text-red-500 text-xs">
              {errors.recipient_phone}
            </span>
          )}
        </div>

        {/* ข้อมูลที่อยู่ */}
        <div className="space-y-4 pt-2 border-t border-gray-100">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-black">ที่อยู่ *</label>
              <span
                className={`text-[10px] ${formData.delivery_address?.length === 100 ? "text-red-500" : "text-gray-400"}`}
              >
                {formData.delivery_address?.length || 0}/100
              </span>
            </div>
            <textarea
              name="delivery_address"
              maxLength={100}
              rows={2}
              value={formData.delivery_address}
              placeholder="บ้านเลขที่, ถนน, ซอย *"
              onChange={handleChange}
              className={`w-full p-3 border-2 rounded-xl text-black focus:border-black outline-none resize-none transition-all ${
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

          <div className="grid grid-cols-2 gap-4">
            {/* จังหวัด */}
            <div>
              <Select
                showSearch
                className="w-full h-12"
                placeholder="เลือกจังหวัด *"
                status={errors.province ? "error" : ""}
                value={formData.province || undefined}
                options={provinces.map((p) => ({ label: p, value: p }))}
                onSelect={(val) => {
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

            {/* อำเภอ */}
            <div>
              <Select
                showSearch
                disabled={!formData.province}
                className="w-full h-12"
                placeholder="เลือกอำเภอ *"
                status={errors.district ? "error" : ""}
                value={formData.district || undefined}
                options={currentProvinceData.map((a) => ({
                  label: a[0],
                  value: a[0],
                }))}
                onSelect={(val) => {
                  setFormData((prev) => ({
                    ...prev,
                    district: val,
                    sub_district: "",
                    postcode: "",
                  }));
                  setErrors((prev) => ({ ...prev, district: "" }));
                }}
              />
              {errors.district && (
                <span className="text-red-500 text-[10px] ml-1">
                  {errors.district}
                </span>
              )}
            </div>

            {/* ตำบล */}
            <div>
              <Select
                showSearch
                disabled={!formData.district}
                className="w-full h-12"
                placeholder="เลือกตำบล *"
                status={errors.sub_district ? "error" : ""}
                value={formData.sub_district || undefined}
                options={currentAmphoeData.map((t) => ({
                  label: t[0],
                  value: t[0],
                }))}
                onSelect={(val) => {
                  const zip =
                    currentAmphoeData.find((t) => t[0] === val)?.[1][0] || "";
                  setFormData((prev) => ({
                    ...prev,
                    sub_district: val,
                    postcode: zip.toString(),
                  }));
                  setErrors((prev) => ({ ...prev, sub_district: "" }));
                }}
              />
              {errors.sub_district && (
                <span className="text-red-500 text-[10px] ml-1">
                  {errors.sub_district}
                </span>
              )}
            </div>

            {/* รหัสไปรษณีย์ */}
            <input
              readOnly
              value={formData.postcode}
              placeholder="รหัสไปรษณีย์"
              className="w-full h-12 p-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-500 cursor-not-allowed"
            />
          </div>
        </div>

        {/* ประเภทที่อยู่ */}
        <div className="pt-4 spac-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold text-black">ประเภท:</span>
            {["บ้าน", "ที่ทำงาน", "คอนโด", "อื่นๆ"].map((label) => (
              <button
                key={label}
                type="button"
                onClick={() =>
                  setFormData((prev) => ({ ...prev, address_label: label }))
                }
                className={`px-4 py-2 rounded-xl border-2 font-medium transition-all ${
                  formData.address_label === label
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-200 hover:border-black"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

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
            <span
              className={`text-sm font-bold text-black content-center ${formData.is_default ? "text-black " : "text-gray-500"}`}
            >
              ตั้งเป็นที่อยู่เริ่มต้น
            </span>
          </div>

          {/* ปุ่มบันทึก */}
          <div className="flex gap-4 pt-4 border-t border-gray-100">
            <button
              onClick={handleCheckValid}
              className="flex-1 bg-cprojectpink p-4 rounded-2xl font-bold text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:shadow-none transition-all"
            >
              บันทึกข้อมูล
            </button>
            <ConfirmDialog
              open={openConfirm}
              onClose={() => setOpenConfirm(false)}
              onConfirm={async () => {
                await handleInternalSubmit();
                handleConfirmAddToAccount();
              }}
              title={initialData ? "แก้ไขที่อยู่จัดส่ง" : "เพิ่มที่อยู่จัดส่ง"}
              content={
                <div className="text-center space-y-2">
                  <span>
                    {" "}
                    คุณต้องการ
                    {initialData ? "แก้ไขที่อยู่จัดส่ง" : "เพิ่มที่อยู่จัดส่ง"}
                    ใช่หรือไม่?
                  </span>
                  <br />
                  <span className="text-xl font-bold text-black"></span>
                </div>
              }
            />

            <button
              onClick={onCancel}
              className="flex-1 font-bold text-gray-500 underline hover:text-black"
            >
              ยกเลิก
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
