"use client";

import { useState } from "react";
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
  ChevronDown,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { VerificationSlip } from "@/modules/payments/components/VerificationSlip";
import ConfirmDialog from "@/components/commonui/ConfirmDialog";

interface OrderCardProps {
  order: Order;
  mode?: "Customer" | "Seller";
}

export const OrderCard = ({ order, mode = "Customer" }: OrderCardProps) => {
  const trackingList = order.tracking_number?.split(/[,\s]+/).filter(Boolean);
  const [showTrackkingnoInput, setShowTrackkingnoInput] = useState(false);
  const [isConfirmTrackingNoopen, setisConfirmTrackingNoopen] = useState(false);
  const [trackkingno, settrackkingno] = useState("");
  const [cleanTrackingList, setCleanTrackingList] = useState<string[]>([]);
  const [expandedItem, setExpandedItem] = useState<string[]>([]);
  const toggleAccordion = (id: string) => {
    setExpandedItem(
      (prev) =>
        prev.includes(id)
          ? prev.filter((itemId) => itemId !== id) // ถ้ามีอยู่แล้ว ให้เอาออก (ปิด)
          : [...prev, id], // ถ้าไม่มี ให้เพิ่มเข้าไป (เปิดค้างไว้)
    );
  };

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
      case "CP":
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
    router.push(
      `/shoppingcart/checkoutcart/paymentcart?orderId=${order.order_no}&mode=repay`,
    );
  };
  const { receiptRef, downloadPDF } = useReceiptPDF(order);
  const statusInfo = getStatusDisplay(order.order_status);

  const [isVerifyOpen, setIsVerifyOpen] = useState(false);

  const handleConfirmPayment = async () => {
    toast.success(
      <div className="flex flex-col justify-center py-1">
        <span className="leading-tight"> ยืนยันการชำระเงินสำเร็จ!</span>
      </div>,
      {
        className:
          " bg-white border-2 border-cprojectone rounded-xl font-bold shadow-2xl text-black mx-auto sm:ml-auto sm:mr-6 h-20",
        duration: 3000,
      },
    );

    setIsVerifyOpen(false);
  };

  const handleRejectPayment = async (reason: string) => {
    toast.success(
      <div className="flex flex-col justify-center py-1">
        <span className="leading-tight"> ยืนยันการปฏิเสธสำเร็จแล้ว!</span>
      </div>,
      {
        className:
          " bg-white border-2 border-cprojectone rounded-xl font-bold shadow-2xl text-black mx-auto sm:ml-auto sm:mr-6 h-20",
        duration: 3000,
      },
    );
    setIsVerifyOpen(false);
  };

  const handleConfirmTracking = (finalList: string[]) => {
    const finalPayload = finalList.join(",");
    console.log("ส่งไป Backend:", finalPayload);
    // ต้องมาทำตัว finalPayload ส่งไปให้ API
  };

  const pulseStyle = `
  @keyframes pulse-green-simple {
    0%, 100% { background-color: #f3f4f6; border-color: #e5e7eb; color: #9ca3af; }
    50% { background-color: #f0fdf4; border-color: #22c55e; color: #16a34a; }
  }
`;

  return (
    <div className="bg-white border-3 border-black rounded-[2rem] overflow-hidden  mb-8 transition-all hover:translate-y-[-2px]">
      <style>{pulseStyle}</style>
      <ReceiptTemplate ref={receiptRef} order={order} />

      {/*Order Number & Status max-[400px]:*/}
      <div className=" bg-cprojectone pt-5 pr-5 pl-5 border-b-3 border-0 flex flex-col items-end ">
        <div
          className={` self-end  px-4 py-1 rounded-full border-2 font-bold text-sm mb-2 whitespace-nowrap ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}
        >
          {statusInfo.label}
        </div>
        <span className="w-full font-black text-lg text-center border-3 border-black border-b-white px-4 py-5 rounded-full bg-white translate-y-[17%] ">
          Order #{order.order_no}
        </span>
      </div>
      <div className="h-10"></div>

      {/*Product Items */}
      <div className="p-5 space-y-3">
        {order.items?.map((item) => {
          const isExpanded = expandedItem.includes(item.order_item_id);

          return (
            <div
              key={item.order_item_id}
              className="border-2 border-black rounded-2xl overflow-hidden bg-white transition-all"
            >
              <button
                onClick={() => toggleAccordion(item.order_item_id)}
                className="w-full flex gap-4 items-center p-3 hover:bg-gray-50 transition-colors text-left"
              >
                <div className="relative w-14 h-14 border-2 border-black rounded-lg overflow-hidden shrink-0">
                  <Image
                    src={item.product_img_path || "/placeholder-image.svg"}
                    alt={item.product_name_at_purchase}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex-grow">
                  <h4 className="font-bold text-sm line-clamp-1">
                    {item.product_name_at_purchase}
                  </h4>
                </div>

                <div className="flex flex-col items-end gap-1">
                  <ChevronDown
                    size={18}
                    className={`transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                  />
                </div>
              </button>

              <div
                className={`grid transition-all duration-300 ease-in-out ${
                  isExpanded
                    ? "grid-rows-[1fr] opacity-100 p-4 border-t-2 border-dashed border-black bg-gray-50"
                    : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-bold">รหัสสินค้า:</span>
                    <span className="font-mono font-bold">
                      {item.product_id || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-bold">
                      ราคาสินค้า/ชิ้น:
                    </span>
                    <span className="font-black text-base">
                      {item.price_at_purchase.toLocaleString()} บาท
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-bold">จำนวน:</span>
                    <span className="font-black text-base">
                      {item.quantity} ชิ้น
                    </span>
                  </div>
                  <div className="pt-2">
                    <p className="text-xs text-gray-500 font-bold leading-relaxed">
                      รายละเอียดเพิ่มเติมเกี่ยวกับรายการสินค้านี้
                      สามารถติดต่อผู้ขายโดยตรง
                    </p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. Info Section (Tracking / Rejection / Shipping Info) */}
      <div className="px-5 pb-2 space-y-3">
        {/* กรณี RJ*/}
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

        {/* กรณี TS/TR*/}
        {(order.order_status === "TS" ||
          order.order_status === "TR" ||
          order.order_status === "CP") &&
          order.tracking_number && (
            <div className="p-4 bg-blue-50 border-2 border-black rounded-2xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Truck className="text-blue-600" size={20} />
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase leading-none mb-3">
                    {order.carrier || "พัสดุ"}
                  </p>

                  <div className="flex flex-col gap-2">
                    {trackingList?.map((no, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between bg-blue-50 p-3 rounded-xl border border-blue-200 w-full"
                      >
                        <div className="flex flex-col">
                          <span className="text-[10px] text-blue-500 font-bold">
                            เลขพัสดุที่ {index + 1}
                          </span>
                          <span className="font-bold text-sm break-all">
                            {no}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(no!);
                            toast.success("คัดลอกเลขพัสดุแล้ว");
                          }}
                          className="p-2 hover:bg-blue-200 rounded-full transition-colors border-2 border-transparent active:border-black cursor-pointer"
                        >
                          <Copy size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              {/* <button
                disabled
                onClick={() => {
                  navigator.clipboard.writeText(order.tracking_number!);
                  toast.success("คัดลอกเลขพัสดุแล้ว");
                }}
                className="p-2 hover:bg-blue-200 rounded-full transition-colors border-2 border-transparent active:border-black cursor-pointer hidden"
              >
                <Copy size={16} />
              </button> */}
            </div>
          )}

        {/* สำหรับ TS ที่ยังไม่มีเลขพัสดุ */}
        {order.order_status === "TS" && !order.tracking_number && (
          <>
            {mode === "Seller" ? (
              <div className="flex flex-col gap-3 p-4 bg-blue-50 border-2 border-black rounded-[2rem]">
                <div className="flex items-center gap-2 text-blue-700 font-black text-xs px-2 uppercase">
                  <Truck size={16} />
                  <span>ระบุหมายเลขพัสดุ (Tracking Number)</span>
                </div>

                <div className="relative">
                  <textarea
                    placeholder="ระบุเลขพัสดุ (หากมีหลายกล่อง ให้คั่นด้วยเครื่องหมาย , หรือขึ้นบรรทัดใหม่)"
                    className="w-full p-4 border-2 border-black rounded-2xl font-bold text-[11px] focus:outline-none focus:ring-2 ring-blue-500 min-h-[100px] resize-none"
                    // maxLength={}
                    value={trackkingno}
                    onChange={(e) => {
                      const value = e.target.value;
                      const cleanValue = value.replace(
                        /[^a-zA-Z0-9ก-๙,\s]/g,
                        "",
                      );
                      settrackkingno(cleanValue);
                    }}
                  />
                </div>
                <div className="flex flex-row items-center justify-end gap-4 px-2">
                  <button
                    onClick={() => {
                      const cleaned = trackkingno
                        .split(/[,\n\s]+/)
                        .map((item) => item.trim())
                        .filter(Boolean);
                      if (cleaned.length === 0) {
                        toast.error("กรุณาระบุเลขพัสดุอย่างน้อย 1 รายการ");
                        return;
                      }
                      setCleanTrackingList(cleaned);
                      setisConfirmTrackingNoopen(true);
                    }}
                    disabled={!trackkingno.trim()}
                    className="px-2 py-1 bg-blue-600 text-[12px] text-white border-2 border-black rounded-full font-black disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer transition-all"
                  >
                    ยืนยันเลข Tracking No.
                  </button>
                  <button
                    onClick={() => {
                      setShowTrackkingnoInput(false);
                      settrackkingno("");
                    }}
                    className="flex font-bold text-[12px] underline cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-blue-600 font-bold text-sm px-2">
                <PackageCheck size={18} />
                <span>กำลังเตรียมจัดส่งพัสดุของคุณ...</span>
              </div>
            )}
          </>
        )}

        {order.order_status === "CP" && (
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
              //เดี๋ยวเปลี่ยนเป็นรับ มาจาก backend แทน
              onClick={downloadPDF}
              className="p-3 bg-white border-2 border-black rounded-xl hover:bg-green-100 transition-all active:translate-y-1 active:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
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
              className="flex-1 py-3 bg-red-600 text-white border-4 border-black rounded-full font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-700 transition-all active:translate-y-1 active:shadow-none cursor-pointer"
            >
              ชำระเงินใหม่
            </button>
          )}

          {order.order_status === "TR" && (
            // ต้องทำตัว hadle api update status ว่า Complete ไป  backend
            <button className="flex-1 py-3 bg-cprojectfour text-black border-4 border-black rounded-full font-black shadow-[4px_4px_0px_0px_rgba(210,243,222,1)] hover:bg-cprojectthree hover:text-white transition-all active:translate-y-1 active:shadow-none cursor-pointer">
              ได้รับสินค้าแล้ว
            </button>
          )}

          {/* {order.order_status === "CP" && (
             <button className="flex-1 py-3 bg-green-500 text-white border-4 border-black rounded-full font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-green-600 transition-all active:translate-y-1 active:shadow-none">
                รีวิวสินค้า
             </button>
          )} */}

          {order.order_status === "PD" && (
            <>
              {mode === "Seller" ? (
                <button
                  onClick={() => setIsVerifyOpen(true)}
                  className="flex-1 py-3 border-4 rounded-full font-black cursor-pointer transition-all shadow-[0_4px_0_0_rgba(0,0,0,0.1)] active:translate-y-[4px] active:shadow-none"
                  style={{ animation: "pulse-green-simple 2s infinite" }}
                >
                  ทำการตรวจสอบ
                </button>
              ) : (
                <button
                  disabled
                  className="flex-1 py-3 border-4 rounded-full font-black cursor-not-allowed"
                  style={{ animation: "pulse-green-simple 2s infinite" }}
                >
                  ร้านค้ากำลังทำการตรวจสอบ
                </button>
              )}
            </>
          )}
        </div>
      </div>
      {isVerifyOpen && (
        <VerificationSlip
          order={order}
          onClose={() => setIsVerifyOpen(false)}
          onConfirm={handleConfirmPayment}
          onReject={handleRejectPayment}
        />
      )}
      <ConfirmDialog
        open={isConfirmTrackingNoopen}
        onClose={() => setisConfirmTrackingNoopen(false)}
        onConfirm={() => {
          setisConfirmTrackingNoopen(false);
          handleConfirmTracking(cleanTrackingList);
        }}
        title="ยืนยันหมายเลข Tracking No."
        content={
          <div className="flex flex-col gap-2">
            <p>หมายเลขพัสดุที่คุณระบุคือ:</p>
            <div className="bg-gray-100 p-2 rounded-lg border border-dashed border-black">
              <div className="font-mono font-bold text-blue-600 break-all">
                {cleanTrackingList.map((no, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-white p-1 px-2 rounded border border-gray-200 text-xs"
                  >
                    <span className="text-gray-400">#{index + 1}</span>
                    <span className="font-mono font-bold text-blue-600">
                      {no}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-500">
              ข้อมูลนี้จะถูกส่งไปยังระบบและแจ้งลูกค้าทันที
              หมายเลขถูกต้องใช่หรือไม่?
            </p>
          </div>
        }
        variant="primary"
      />
    </div>
  );
};
