"use client";
import { useAddressForm } from "../hooks/useAddressForm";
import { PatternFormat } from "react-number-format";
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
import { Addresses } from "../addresses";
import { ADDRESS_LABEL } from "@/constants/addressTypeLabel";
import { GenericResponse } from "@/types/response.type";

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
    handleInternalSubmit,
  } = useAddressForm(initialData);

  const [openConfirm, setOpenConfirm] = useState(false);

  const handleCheckValid = () => {
    if (validateForm()) {
      setOpenConfirm(true);
    } else {
      toast.error(
        <div className="flex flex-col justify-center py-1">
          <span className="leading-tight">กรุณาระบุข้อมูลให้ครบถ้วน</span>
        </div>,
      );
    }
  };
  const handleConfirmAddToAccount = async () => {
    try {
      await handleInternalSubmit(onSubmit);
      toast.success(
        <div className="flex flex-col justify-center py-1">
          <span className="leading-tight">
            {" "}
            {initialData ? "แก้ไขที่อยู่จัดส่ง" : "เพิ่มที่อยู่จัดส่ง"}{" "}
            เรียบร้อยแล้ว!
          </span>
        </div>,
      );
      setOpenConfirm(false);
    } catch (error) {
      const err = error as GenericResponse<{ id: string }>;
      toast.error(
        err?.status?.message ??
          `เกิดข้อผิดพลาดในการ ${initialData ? "แก้ไขที่อยู่จัดส่ง" : "เพิ่มที่อยู่จัดส่ง"} กรุณาลองใหม่อีกครั้ง`,
      );
    }
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
                className={`text-[10px] ${formData.recipientFirstName?.length === 50 ? "text-red-500" : "text-gray-400"}`}
              >
                {formData.recipientFirstName?.length || 0}/50
              </span>
            </div>
            <input
              name="recipientFirstName"
              maxLength={50}
              value={formData.recipientFirstName}
              onChange={handleChange}
              placeholder="กรุณากรอกชื่อ"
              className={`w-full p-3 border-2 rounded-xl text-black hover:border-black focus:border-black outline-none transition-all ${
                errors.recipientFirstName
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200"
              }`}
            />
            {errors.recipientFirstName && (
              <span className="text-red-500 text-xs">
                {errors.recipientFirstName}
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
                className={`text-[10px] ${formData.recipientLastName?.length === 50 ? "text-red-500" : "text-gray-400"}`}
              >
                {formData.recipientLastName?.length || 0}/50
              </span>
            </div>
            <input
              name="recipientLastName"
              maxLength={50}
              value={formData.recipientLastName}
              onChange={handleChange}
              placeholder="กรุณากรอกนามสกุล"
              className={`w-full p-3 border-2 rounded-xl text-black hover:border-black focus:border-black outline-none transition-all ${
                errors.recipientLastName
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200"
              }`}
            />
            {errors.recipientLastName && (
              <span className="text-red-500 text-xs">
                {errors.recipientLastName}
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
            value={formData.recipientPhone}
            onValueChange={(v) =>
              setFormData((prev) => ({ ...prev, recipientPhone: v.value }))
            }
            placeholder="เช่น 081-234-5678"
            className={`w-full p-3 border-2 rounded-xl text-black focus:border-black outline-none transition-all ${
              errors.recipientPhone
                ? "border-red-500 bg-red-50"
                : "border-gray-200"
            }`}
          />
          {errors.recipientPhone && (
            <span className="text-red-500 text-xs">
              {errors.recipientPhone}
            </span>
          )}
        </div>

        {/* ข้อมูลที่อยู่ */}
        <div className="space-y-4 pt-2 border-t border-gray-100">
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span
                className={`text-[10px] ${formData.deliveryAddress?.length === 100 ? "text-red-500" : "text-gray-400"}`}
              >
                <label className="text-sm font-bold text-black">
                  ที่อยู่ *
                </label>
                {formData.deliveryAddress?.length || 0}/100
              </span>
            </div>
            <textarea
              name="deliveryAddress"
              maxLength={100}
              rows={2}
              value={formData.deliveryAddress}
              placeholder="บ้านเลขที่, ถนน, ซอย *"
              onChange={handleChange}
              className={`w-full p-3 border-2 rounded-xl text-black hover:border-black focus:border-black outline-none resize-none transition-all ${
                errors.deliveryAddress
                  ? "border-red-500 bg-red-50"
                  : "border-gray-200"
              }`}
            />
            {errors.deliveryAddress && (
              <span className="text-red-500 text-xs ml-1">
                {errors.deliveryAddress}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* จังหวัด */}
            <div>
              <label className="text-sm font-bold text-black">จังหวัด *</label>
              <Autocomplete
                options={provinces}
                value={formData.province || null}
                onChange={(_, val) => {
                  setFormData((p) => ({
                    ...p,
                    province: val || "",
                    district: "",
                    subDistrict: "",
                    postcode: "",
                  }));
                  setErrors((p) => ({ ...p, province: "" }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="เลือกจังหวัด *"
                    error={!!errors.province}
                    className={
                      errors.province
                        ? "bg-red-50 rounded-xl "
                        : "bg-white rounded-xl"
                    }
                    variant="outlined"
                    size="small"
                  />
                )}
                className="bg-white rounded-xl"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    height: "48px",
                    "& fieldset": {
                      borderWidth: "2px",
                      borderColor: errors.province ? "#ef4444" : "#e5e7eb",
                    },

                    "&.Mui-focused fieldset": {
                      borderWidth: "2px",
                      borderColor: "black",
                    },
                  },
                }}
              />
              {errors.province && (
                <span className="text-red-500 text-[12px] ml-1">
                  {errors.province}
                </span>
              )}
            </div>

            {/* อำเภอ */}
            <div>
              <label className="text-sm font-bold text-black">อำเภอ *</label>
              <Autocomplete
                disabled={!formData.province}
                options={currentProvinceData.map((a) => a[0])}
                value={formData.district || null}
                onChange={(_, val) => {
                  setFormData((p) => ({
                    ...p,
                    district: val || "",
                    subDistrict: "",
                    postcode: "",
                  }));
                  setErrors((p) => ({ ...p, district: "" }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="เลือกอำเภอ *"
                    error={!!errors.district}
                    className={
                      errors.district
                        ? "bg-red-50 rounded-xl "
                        : "bg-white rounded-xl"
                    }
                    size="small"
                  />
                )}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    height: "48px",
                    "& fieldset": {
                      borderWidth: "2px",
                      borderColor: errors.province ? "#ef4444" : "#e5e7eb",
                    },

                    "&.Mui-focused fieldset": {
                      borderWidth: "2px",
                      borderColor: "black",
                    },
                  },
                }}
              />
              {errors.district && (
                <span className="text-red-500 text-[12px] ml-1">
                  {errors.district}
                </span>
              )}
            </div>

            {/* ตำบล */}
            <div>
              <label className="text-sm font-bold text-black">ตำบล *</label>
              <Autocomplete
                disabled={!formData.district}
                options={currentAmphoeData.map((t) => t[0])}
                value={formData.subDistrict || null}
                onChange={(_, val) => {
                  const zip =
                    currentAmphoeData.find((t) => t[0] === val)?.[1][0] || "";
                  setFormData((p) => ({
                    ...p,
                    subDistrict: val || "",
                    postcode: zip.toString(),
                  }));
                  setErrors((p) => ({ ...p, subDistrict: "" }));
                  setErrors((p) => ({ ...p, subDistrict: "" }));
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="เลือกตำบล *"
                    error={!!errors.subDistrict}
                    size="small"
                    className={
                      errors.subDistrict
                        ? "bg-red-50 rounded-xl "
                        : "bg-white rounded-xl"
                    }
                  />
                )}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                    height: "48px",
                    "& fieldset": {
                      borderWidth: "2px",
                      borderColor: errors.province ? "#ef4444" : "#e5e7eb",
                    },

                    "&.Mui-focused fieldset": {
                      borderWidth: "2px",
                      borderColor: "black",
                    },
                  },
                }}
              />
              {errors.subDistrict && (
                <span className="text-red-500 text-[10px] ml-1">
                  {errors.subDistrict}
                </span>
              )}
            </div>

            {/* รหัสไปรษณีย์ */}
            <div>
              <label className="text-sm font-bold text-black">
                รหัสไปรษณีย์ *
              </label>
              <input
                readOnly
                value={formData.postcode ?? ""}
                onChange={handleChange}
                placeholder="รหัสไปรษณีย์"
                className="w-full h-12 p-3 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-500 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* ประเภทที่อยู่ */}
        <div className="pt-4 spac-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold text-black">ประเภท:</span>
            {Object.values(ADDRESS_LABEL).map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setFormData((prev) => ({ ...prev, addressLabel: label }));
                  setErrors((prev) => ({ ...prev, addressLabel: "" }));
                }}
                className={`px-4 py-2 rounded-xl border-2 font-medium transition-all ${
                  formData.addressLabel === label
                    ? "bg-black text-white border-black"
                    : "bg-white text-black border-gray-200 hover:border-black"
                }`}
              >
                {errors.addressLabel && (
                  <span className="text-red-500 text-[10px] ml-1">
                    {errors.addressLabel}
                  </span>
                )}
                {label}
              </button>
            ))}
          </div>
          {errors.addressLabel && (
            <span className="text-red-500 text-[12px] ml-1">
              {errors.addressLabel}
            </span>
          )}

          <div className="flex item-center gap-3 pt-2 ">
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isDefault: e.target.checked,
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
