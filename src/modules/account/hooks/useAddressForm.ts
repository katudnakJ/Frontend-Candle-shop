import { useState, useMemo } from "react";
import { addressService } from "../services/addressService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/utils/api";
import { Status } from "@/types/response.type";
import { Addresses } from "../addresses";

export const useAddressForm = (initialData?: Addresses) => {
  const [formData, setFormData] = useState<Partial<Addresses>>(
    initialData || {
      recipientFirstName: "",
      recipientLastName: "",
      recipientPhone: "",
      deliveryAddress: "",
      subDistrict: "",
      district: "",
      province: "",
      postcode: "",
      addressLabel: "ที่อยู่ของฉัน",
      isDefault: false,
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();
  const isEditMode = initialData;
  const isCreateMode = !initialData;
  
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

    if (!formData.addressLabel?.trim()) {
      newErrors.addressLabel = "กรุณากรอกชื่อที่อยู่";
    } else if (formData.addressLabel.length < 3) {
      newErrors.addressLabel = "กรุณากรอกชื่อที่อยู่ให้ชัดเจนกว่านี้";
    } else if (!addressRegex.test(formData.addressLabel)) {
      newErrors.addressLabel = "ชื่อห้ามมีอักขระพิเศษ";
    }

    if (!formData.recipientFirstName?.trim()) {
      newErrors.recipientFirstName = "กรุณากรอกชื่อ";
    } else if (!nameRegex.test(formData.recipientFirstName)) {
      newErrors.recipientFirstName = "ชื่อห้ามมีอักขระพิเศษหรือตัวเลข";
    }

    if (!formData.recipientLastName?.trim()) {
      newErrors.recipientLastName = "กรุณากรอกนามสกุล";
    } else if (!nameRegex.test(formData.recipientLastName)) {
      newErrors.recipientLastName = "นามสกุลห้ามมีอักขระพิเศษหรือตัวเลข";
    }

    if (!formData.recipientPhone?.trim()) {
      newErrors.recipientPhone = "กรุณากรอกเบอร์โทรศัพท์";
    } else if (!phoneRegex.test(formData.recipientPhone)) {
      newErrors.recipientPhone =
        "เบอร์โทรต้องเป็นตัวเลข 10 หลัก และขึ้นต้นด้วย 0";
    }

    if (!formData.deliveryAddress?.trim()) {
      newErrors.delivery_address = "กรุณากรอกที่อยู่";
    } else if (formData.deliveryAddress.length < 5) {
      newErrors.delivery_address = "กรุณากรอกรายละเอียดที่อยู่ให้ชัดเจนกว่านี้";
    } else if (!addressRegex.test(formData.deliveryAddress)) {
      newErrors.delivery_address = "ที่อยู่ห้ามมีอักขระพิเศษหรือตัวเลข";
    }

    if (!formData.province) {
      newErrors.province = "กรุณาเลือกจังหวัด";
    }
    if (!formData.district) {
      newErrors.district = "กรุณาเลือกอำเภอ/เขต";
    }
    if (!formData.subDistrict) {
      newErrors.sub_district = "กรุณาเลือกตำบล/แขวง";
    }
    if (!formData.postcode) {
      newErrors.postcode = "กรุณากรอกรหัสไปรษณีย์";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createAddress = useMutation({
        mutationKey: ["addNewAddress", formData.addressId],
        mutationFn: async(formData: Addresses) => {
           await apiClient.post("/v1/account/address", { ...formData });
        },
        onSuccess: async () => {
          await queryClient.invalidateQueries({ queryKey: ["getAddressList"] });
          await queryClient.invalidateQueries({ queryKey: ["getAddressDetail", formData.addressId] });
          setErrors({});
        },
        onError: (error : Status) => {
          setErrors({ apiError: error.message ?? "เกิดข้อผิดพลาดในการเพิ่มที่อยู่ กรุณาลองใหม่อีกครั้ง" });
        }
      })

  const editAddress = useMutation({
    mutationKey: ["editAddress", formData.addressId],
    mutationFn: async(formData: Addresses) => {
      await apiClient.put(`/v1/account/address/${formData.addressId}`, { ...formData });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getAddressList"] });
      await queryClient.invalidateQueries({ queryKey: ["getAddressDetail", formData.addressId] });
      setErrors({});
    },
    onError: (error : Status) => {
      setErrors({ apiError: error.message ?? "เกิดข้อผิดพลาดในการแก้ไขที่อยู่ กรุณาลองใหม่อีกครั้ง" });
    }
})

  const deleteAddress = useMutation({
    mutationKey: ["deleteAddress", formData.addressId],
    mutationFn: async( addressId: string ) => {
      await apiClient.delete(`/v1/account/address/${addressId}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["getAddressList"] });
      await queryClient.invalidateQueries({ queryKey: ["getAddressDetail", formData.addressId] });
      setErrors({});
    },
    onError: (error : Status) => {
      const err = error.message ?? "เกิดข้อผิดพลาดในการลบที่อยู่ กรุณาลองใหม่อีกครั้ง";      
      setErrors({ apiError: err});
    }
    })

    const handleInternalSubmit = ( onSubmit: (data: Addresses | Partial<Addresses>) => void) => {
      if (!validateForm()) return;
      onSubmit(formData);

      if (isCreateMode) {
        createAddress.mutate(formData as Addresses);
      }else if (isEditMode) {
        editAddress.mutate(formData as Addresses);
      }
    }

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    handleChange,
    validateForm,
    currentProvinceData,
    currentAmphoeData,
    provinces: addressService.getProvinces(),
    handleInternalSubmit,
    deleteAddress,
  };
};