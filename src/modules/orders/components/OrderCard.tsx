"use client";

import { useRouter } from "next/navigation";
import { Order } from "../type";
import { useReceiptPDF } from "../hooks/useReceiptPDF";
import { ReceiptTemplate } from "./ReceiptTemplate";
import Image from "next/image";
import {
  Truck,
  AlertCircle,
  Copy,
  PackageCheck,
  Panda,
  Download,
} from "lucide-react";
import { toast } from "react-hot-toast";

interface OrderCardProps {
  order: Order;
}

export const OrderCard = ({ order }: OrderCardProps) => {
  const router = useRouter();
  const getStatusDisplay = (status: Order["order_status"]) => {
    switch (status) {
      case "PD":
        return {
          label: "รอตรวจสอบชำระเงิน",
          color: "text-purple-600",
          bg: "bg-purple-50",
          border: "border-purple-600",
        };
      case "RJ":
        return {
          label: "การชำระเงินถูกปฏิเสธ",
          color: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-600",
        };
      case "TS":
        return {
          label: "ที่ต้องจัดส่ง",
          color: "text-blue-600",
          bg: "bg-blue-50",
          border: "border-blue-600",
        };
      case "TR":
        return {
          label: "ที่ต้องได้รับ",
          color: "text-amber-600",
          bg: "text-amber-50",
          border: "border-amber-600",
        };
      case "CM":
        return {
          label: "สำเร็จแล้ว",
          color: "text-green-600",
          bg: "bg-green-50",
          border: "border-green-600",
        };
      default:
        return { label: status, color: "text-gray-600", bg: "bg-gray-50" };
    }
  };
const handlepaymentagain = () => {
  router.push(`/shoppingcart/checkoutcart/paymentcart?orderId=${order.order_no}&mode=repay`);
};
  const { receiptRef, downloadPDF } = useReceiptPDF(order);
  const statusInfo = getStatusDisplay(order.order_status);

  return (
    <div className="bg-white border-2 border-black rounded-[2rem] overflow-hidden  mb-8 transition-all hover:translate-y-[-2px]">
      <ReceiptTemplate ref={receiptRef} order={order} />

      {/*Order Number & Status */}
      <div className="bg-cprojectone p-5 border-b-2 border- flex justify-between items-center ">
        <span className="font-black text-lg">Order #{order.order_no}</span>
        <div
          className={`px-4 py-1 rounded-full border-2  font-bold text-sm ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}
        >
          {statusInfo.label}
        </div>
      </div>

      {/*Product Items */}
      <div className="p-5 space-y-4">
        {order.items?.map((item) => (
          <div key={item.order_item_id} className="flex gap-4 items-center">
            <div className="relative w-20 h-20 border-2 border-black rounded-xl overflow-hidden shrink-0">
              <Image
                src={item.product_img_path || "/placeholder-image.svg"}
                alt={item.product_name_at_purchase}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-grow">
              <h4 className="font-bold text-base line-clamp-1">
                {item.product_name_at_purchase}
              </h4>
              <p className="text-gray-500 font-bold text-sm">
                จำนวน: {item.quantity}
              </p>
              <p className="font-black text-lg">
                ฿{item.price_at_purchase.toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Info Section (Tracking / Rejection / Shipping Info) */}
      <div className="px-5 pb-2 space-y-3">
        {/* กรณี RJ: แสดงหมายเหตุตัวโตๆ */}
        {order.order_status === "RJ" && (
          <div className="p-4 bg-red-100 border-2 border-red-500 rounded-2xl flex items-start gap-3">
            <AlertCircle className="text-red-600 shrink-0" />
            <div className="text-sm">
              <p className="font-black text-red-700">ชำระเงินไม่สำเร็จ:</p>
              <p className="text-red-600 font-bold">
                {order.rejection_reason || "สลิปไม่ถูกต้อง"}
              </p>
            </div>
          </div>
        )}

        {/* กรณี TS/TR: แสดงเลขพัสดุถ้ามี */}
        {(order.order_status === "TS" || order.order_status === "TR") &&
          order.tracking_number && (
            <div className="p-4 bg-blue-50 border-2 border-black rounded-2xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Truck className="text-blue-600" size={20} />
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase leading-none">
                    {order.carrier || "พัสดุ"}
                  </p>
                  <p className="font-black text-sm">{order.tracking_number}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(order.tracking_number!);
                  toast.success("คัดลอกเลขพัสดุแล้ว");
                }}
                className="p-2 hover:bg-blue-200 rounded-full transition-colors border-2 border-transparent active:border-black"
              >
                <Copy size={16} />
              </button>
            </div>
          )}

        {/* สำหรับ TS ที่ยังไม่มีเลขพัสดุ */}
        {order.order_status === "TS" && !order.tracking_number && (
          <div className="flex items-center gap-2 text-blue-600 font-bold text-sm px-2">
            <PackageCheck size={18} />
            <span>กำลังเตรียมจัดส่งพัสดุของคุณ...</span>
          </div>
        )}

        {order.order_status === "CM" && (
          <div className="p-4 bg-green-50 border-2 border-black rounded-2xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white border-2 border-black rounded-lg text-green-600">
                <Panda size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-gray-500 uppercase leading-none">
                  ดาวน์โหลด PDF ใบเสร็จ Order
                </p>
                <p className="font-black text-sm tracking-tight">
                  {order.order_no}
                </p>
              </div>
            </div>
            <button
              onClick={downloadPDF}
              className="p-3 bg-white border-2 border-black rounded-xl hover:bg-green-100 transition-all active:translate-y-1 active:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            >
              <Download size={20} className="text-black" />
            </button>
          </div>
        )}
      </div>

      {/* Total & Actions */}
      <div className="p-5 bg-white border-t-2 border-dashed border-gray-200">
        <div className="flex justify-between items-start mb-4">
          <span className="text-gray-500 font-bold text-sm">
            {new Date(order.order_created_date).toLocaleDateString("th-TH")}
          </span>
          <div className="flex flex-1 flex-col text-right">
            <div className="flex max-[340px]:flex-col justify-end gap-2">
              <span className="text-sm font-bold text-gray-500">
                ค่าจัดส่งที่ชำระแล้ว:{" "}
              </span>
              <span className="text-sm font-black text-red-600">
                ฿{(order.shipping_fee || 0).toLocaleString()}
              </span>
            </div>
            <br />
            <div className="flex max-[340px]:flex-col justify-end gap-2">
              <span className="text-sm font-bold text-gray-500">
                ยอดสุทธิที่ชำระแล้ว:{" "}
              </span>
              <span className="text-sm font-black text-red-600">
                ฿{order.net_amount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          {/* <button className="flex-1 py-3 border-4 border-black rounded-full font-black hover:bg-gray-100 transition-all active:translate-y-1">
            รายละเอียด
          </button> */}

          {order.order_status === "RJ" && (
            <button 
            onClick={handlepaymentagain}
            className="flex-1 py-3 bg-red-600 text-white border-4 border-black rounded-full font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-700 transition-all active:translate-y-1 active:shadow-none">
              ชำระเงินใหม่ 
            
            </button>
          )}

          {order.order_status === "TR" && (
            // ต้องทำตัว hadle api update status ว่า Complete ไป  backend
            <button className="flex-1 py-3 bg-cprojectfour text-black border-4 border-black rounded-full font-black shadow-[4px_4px_0px_0px_rgba(210,243,222,1)] hover:bg-cprojectthree hover:text-white transition-all active:translate-y-1 active:shadow-none">
              ได้รับสินค้าแล้ว
            </button>
          )}

          {/* {order.order_status === "CM" && (
             <button className="flex-1 py-3 bg-green-500 text-white border-4 border-black rounded-full font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-green-600 transition-all active:translate-y-1 active:shadow-none">
                รีวิวสินค้า
             </button>
          )} */}

          {order.order_status === "PD" && (
            <button
              disabled
              style={{
                animation: "pulse-green-simple 2s infinite",
              }}
              className="flex-1 py-3 border-4 rounded-full font-black cursor-not-allowed"
            >
              <style>{`
                        @keyframes pulse-green-simple {
                            0%, 100% { background-color: #f3f4f6; border-color: #e5e7eb; color: #9ca3af; }
                            50% { background-color: #f0fdf4; border-color: #22c55e; color: #16a34a; }
                        }
            `}</style>
              ร้านค้ากำลังทำการตรวจสอบ
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
