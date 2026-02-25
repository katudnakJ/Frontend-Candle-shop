"use client";
import { useAddressForm } from "../hooks/useAddressForm";
import { PatternFormat } from "react-number-format";
import { Addresses } from "@/modules/account/addresses";
import { toast } from "react-hot-toast";
import ConfirmDialog from "@/components/commonui/ConfirmDialog";
import { useState } from "react";
import {
  TextField,
  Autocomplete,
  Switch,
  FormControlLabel,
  Typography,
} from "@mui/material";

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
          <span className="leading-tight">กรุณาระบุข้อมูลให้ครบถ้วน</span>
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
        <span className="leading-tight">
          {" "}
          {initialData ? "แก้ไขที่อยู่จัดส่ง" : "เพิ่มที่อยู่จัดส่ง"}{" "}
          เรียบร้อยแล้ว!
        </span>
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
              <Autocomplete
                options={provinces}
                value={formData.province || null}
                onChange={(_, val) => {
                  setFormData((p) => ({
                    ...p,
                    province: val || "",
                    district: "",
                    sub_district: "",
                    postcode: "",
                  }));
                  setErrors((p) => ({ ...p, province: "" }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="เลือกจังหวัด *"
                    error={!!errors.province}
                    variant="outlined"
                    size="small"
                  />
                )}
                // ใช้ className ของ Tailwind ช่วยจัดการ h-12 และ rounded
                className="bg-white rounded-xl"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    height: "48px",
                  },
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
              <Autocomplete
                disabled={!formData.province}
                options={currentProvinceData.map((a) => a[0])}
                value={formData.district || null}
                onChange={(_, val) => {
                  setFormData((p) => ({
                    ...p,
                    district: val || "",
                    sub_district: "",
                    postcode: "",
                  }));
                  setErrors((p) => ({ ...p, district: "" }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="เลือกอำเภอ *"
                    error={!!errors.district}
                    size="small"
                  />
                )}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    height: "48px",
                  },
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
              <Autocomplete
                disabled={!formData.district}
                options={currentAmphoeData.map((t) => t[0])}
                value={formData.sub_district || null}
                onChange={(_, val) => {
                  const zip =
                    currentAmphoeData.find((t) => t[0] === val)?.[1][0] || "";
                  setFormData((p) => ({
                    ...p,
                    sub_district: val || "",
                    postcode: zip.toString(),
                  }));
                  setErrors((p) => ({ ...p, sub_district: "" }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="เลือกตำบล *"
                    error={!!errors.sub_district}
                    size="small"
                  />
                )}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    height: "48px",
                  },
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
            <FormControlLabel
              control={
                <Switch
                  checked={formData.is_default}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      is_default: e.target.checked,
                    }))
                  }
                  color="success"
                />
              }
              label={
                <Typography className="font-bold text-sm">
                  ตั้งเป็นที่อยู่เริ่มต้น
                </Typography>
              }
            />
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
