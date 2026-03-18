"use client";

import { Edit2, Trash2 } from "lucide-react";
import { Addresses } from "../addresses";

interface AddressCardProps {
  address: Addresses;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}
const formatPhone = (phone: string) => {
  if (!phone) return "";

  const cleaned = phone.replace(/\D/g, "");

  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return phone; 
};

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  showActions = false,
}: AddressCardProps) {

  return (
    <div
      className={`p-5 border-2 rounded-2xl transition-all ${
        address.isDefault
          ? "border-black bg-white shadow-md"
          : "border-gray-500 bg-gray-100/50 opacity-80"
      }`}
    >
      <div className="flex justify-between items-start mb-3 ">
        <div className="flex items-center gap-2 min-w-0">
          {/* ใช้ address_label :'บ้าน' หรือ 'ที่ทำงาน' หรือ คอนโด หรือ อื่นๆ */}
          <span
            className={`font-bold text-lg text-black truncate ${address.isDefault ? "text-black" : "text-gray-500"}`}
          >
            {address.addressLabel || "ที่อยู่ของฉัน"}
          </span>
        </div>
      </div>

      <div
        className={`space-y-1 text-sm text-gray-700 font-sans ${address.isDefault ? "text-gray-700" : "text-gray-500"}`}
      >
        {/* ชื่อผู้รับ */}
        <div className="flex max-[400px]:flex-col justify-between">
          <p
            className={`text-xl font-bold truncate  ${address.isDefault ? "text-black" : "text-gray-500"}`}
          >
            {address.recipientFirstName} {address.recipientLastName}
          </p>
          {/* เบอร์โทรศัพท์ */}
          <p className="text-[16px] truncate flex-shrink-1">{formatPhone(address.recipientPhone)}</p>
        </div>
        {/* รายละเอียดที่อยู่แบบรวมร่าง */}
        <p className="leading-relaxed  max-[320px]:truncate ">
          {address.deliveryAddress} {address.subDistrict} {address.district}{address.province} {address.postcode}
          
        </p>
      </div>

      <div className="flex items-center mt-2 ">
        {address.isDefault && (
          <span className="text-[14px] bg-green-500 text-white px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
            ค่าเริ่มต้น
          </span>
        )}
        
        {showActions && (
          <div className="flex gap-1 ml-auto">
            <button
              onClick={() => onEdit?.(address.addressId)}
              className="bg-cprojectfive p-2 hover:bg-yellow-200 rounded-[10px] border-2 border-black text-black hover:translate-y-1 transition-all duration-400 cursor-pointer"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={() => onDelete?.(address.addressId)}
              className="bg-red-100 p-2 hover:bg-red-400 rounded-[10px] border-2 border-black text-black hover:translate-y-1 transition-all duration-400 cursor-pointer "
            >
              <Trash2 size={16} className="group-hover:text-red-500" />
            </button>
          </div>
        )}
        </div>
       </div>
  );
}
