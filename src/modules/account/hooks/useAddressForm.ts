import { useState, useMemo } from "react";
import { Addresses } from "@/modules/account/addresses";
import { addressService } from "../services/addressService";

export const useAddressForm = (initialData?: Addresses) => {
  const [formData, setFormData] = useState<Partial<Addresses>>(
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

  const [errors, setErrors] = useState<Record<string, string>>({});

  
  const currentProvinceData = useMemo(() => 
    addressService.getDistricts(formData.province || ""), 
    [formData.province]
  );

  const currentAmphoeData = useMemo(() => 
    addressService.getSubDistricts(currentProvinceData, formData.district || ""),
    [currentProvinceData, formData.district]
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    handleChange,
    validateForm,
    currentProvinceData,
    currentAmphoeData,
    provinces: addressService.getProvinces()
  };
};