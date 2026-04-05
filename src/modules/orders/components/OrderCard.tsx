"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { OrdersResponse } from "../type";
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
import { CurrencyDisplay } from "@/utils/CurrencyDisplay";
import { USER_ROLE } from "@/constants/userRole";
import { ORDER_STATUS, PAYMENT_STATUS } from "@/constants/status";
import { useOrderCard } from "../hooks/index";

interface OrderCardProps {
  order: OrdersResponse;
  role?: USER_ROLE | USER_ROLE.CUSTOMER;
  defaultExpanded? : boolean;
}

export const OrderCard = (
  { 
    order, 
    role, 
    defaultExpanded 
  }: OrderCardProps) => {
  const trackingList = order?.trackingNo?.join(", ").split(/[,\s]+/).filter(Boolean);
  const [isConfirmTrackingNoopen, setisConfirmTrackingNoopen] = useState(false);
  const [trackkingno, settrackkingno] = useState("");
  const [cleanTrackingList, setCleanTrackingList] = useState<string[]>([]);
  const [isCardExpanded, setIsCardExpanded] = useState(defaultExpanded ?? false);
  const [expandedItem, setExpandedItem] = useState<string[]>([]);
  const toggleAccordion = (id: string) => {
    setExpandedItem((prev) =>
      prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id],
    );
  };
  const [isVerifyOpen, setIsVerifyOpen] = useState(false);
  const [isConfirmReceived, setIsConfirmReceived] = useState(false);

  const { 
    handlePaymentAgain,
    handleAddTrackingNumber,
    handleConfirmReceived,
    getStatusDisplay,
    handleDowloadPDF,
    isPDFCreating,
  } = useOrderCard(setIsVerifyOpen);


  const statusInfo = getStatusDisplay(
    order.paymentStatus?.toUpperCase() === PAYMENT_STATUS.REJECTED ? 
    order.paymentStatus : order.orderStatus
  );

  const isSeller = role?.toUpperCase() === USER_ROLE.SELLER;
  const isCustomer = role?.toUpperCase() === USER_ROLE.CUSTOMER;
  const isPaymentRejected = order?.paymentStatus?.toUpperCase() === PAYMENT_STATUS.REJECTED;
  const isOrderCompleted = order?.orderStatus.toUpperCase() === ORDER_STATUS.COMPLETED;
  const isOrderToReceive = order?.orderStatus.toUpperCase() === ORDER_STATUS.TO_RECEIVE;
  const isOrderToShip = order?.orderStatus.toUpperCase() === ORDER_STATUS.TO_SHIP;
  const isOrderPending = order?.orderStatus.toUpperCase() === ORDER_STATUS.PENDING;
  const isOrderExisting = order?.trackingNo && order?.trackingNo.length > 0;

  const pulseStyle = `
  @keyframes pulse-green-simple {
    0%, 100% { background-color: #f3f4f6; border-color: #e5e7eb; color: #9ca3af; }
    50% { background-color: #f0fdf4; border-color: #22c55e; color: #16a34a; }
  }
`;

  return (
    <div className="bg-white border-3 border-black rounded-4xl overflow-hidden mb-8 transition-all">
      <style>{pulseStyle}</style>
      {/* <ReceiptTemplate ref={receiptRef} order={order} /> */}

      {/* Header & Main Accordion */}
      <div className="bg-cprojectone pt-5 pr-5 pl-5 border-b-3 border-black flex flex-col items-end">
        <div
          className={`self-end px-4 py-1 rounded-full border-2 font-bold text-sm mb-2 whitespace-nowrap ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}
        >
          {statusInfo.label}
        </div>

        <button
          onClick={() => setIsCardExpanded(!isCardExpanded)}
          className="w-full flex justify-between items-center font-black text-lg border-3 border-black border-b-0 px-6 py-5 rounded-t-[2rem] bg-white translate-y-[3px] hover:bg-gray-50 transition-colors"
        >
          <span>Order #{order?.orderNo}</span>
          <ChevronDown
            className={`transition-transform duration-500 ${isCardExpanded ? "rotate-180" : ""}`}
            size={24}
          />
        </button>
      </div>

      <div className="p-5 space-y-3">
        <div className="space-y-3">
          {order?.orderItems?.map((item) => {
            const isItemExpanded = expandedItem.includes(item.orderItemId);
            return (
              <div
                key={item.orderItemId}
                className="border-2 border-black rounded-2xl overflow-hidden bg-white"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleAccordion(item.orderItemId);
                  }}
                  className="w-full flex gap-4 items-center p-3 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="relative w-12 h-12 border-2 border-black rounded-lg overflow-hidden shrink-0">
                    <Image
                      src={item.productImagePath || "/placeholder-image.svg"}
                      alt={item.pricePerUnit.toString()}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-bold text-sm line-clamp-1">
                      {item.productName}
                    </h4>
                    {!isCardExpanded && (
                      <p className="text-[10px] font-bold text-gray-500">
                        จำนวน: {item.quantity} ชิ้น
                      </p>
                    )}
                  </div>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${isItemExpanded ? "rotate-180" : ""}`}
                  />
                </button>

                {/* รายละเอียดสินค้ารายชิ้น */}
                <div
                  className={`grid transition-all duration-300 ${isItemExpanded ? "grid-rows-[1fr] p-4 border-t-2 border-dashed border-black bg-gray-50" : "grid-rows-[0fr]"}`}
                >
                  <div className="overflow-hidden space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-bold">
                        รหัสสินค้า:
                      </span>{" "}
                      <span className="font-mono">{item.orderItemId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500 font-bold">
                        ราคาสินค้า/ชิ้น:
                      </span>{" "}
                      <span className="font-black">
                        <CurrencyDisplay amount={item.pricePerUnit} /> ฿
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

        <div
          className={`grid transition-all duration-500 ease-in-out ${isCardExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
        >
          <div className="overflow-hidden">
            <div className="pt-4 space-y-4">
              {/* Info Section (Tracking / RJ / CP) */}
              <div className="px-1 pb-2 space-y-3">
                {isPaymentRejected && isCustomer &&(
                  <div className="p-4 bg-red-100 border-2 border-red-500 rounded-2xl flex items-start gap-3">
                    <AlertCircle className="text-red-600 shrink-0" />
                    <div className="text-sm">
                      <p className="font-black text-red-700">
                        ชำระเงินไม่สำเร็จเนื่องจาก
                      </p>
                      <p className="text-red-600 font-bold">
                        : {order?.rejectionReason || "สลิปไม่ถูกต้อง"}
                      </p>
                    </div>
                  </div>
                )}

                {(isOrderToShip || isOrderCompleted || isOrderToReceive ) && 
                (
                  <div className="p-4 bg-green-50 border-2 border-black rounded-2xl flex max-[390px]:flex-col justify-between items-center">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white border-2 border-black rounded-lg text-green-600">
                        <Panda size={24} />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-500 uppercase leading-none">
                          ดาวน์โหลด PDF ใบเสร็จ Order
                        </p>
                        <p className="max-[350px]:text-[10px] font-black text-sm tracking-tight">
                          {order.orderNo}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDowloadPDF(order.orderId)}
                      className="p-3 bg-white border-2 border-black rounded-xl hover:bg-green-100 transition-all active:translate-y-1 active:shadow-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer"
                    >
                      <Download size={20} className="text-black" />
                    </button>
                  {isPDFCreating && (
                    <div className="flex flex-col items-center py-20">
                      <Loader2 className="animate-spin text-black mb-2" size={40} />
                      <p className="font-bold text-gray-500">กำลังโหลดข้อมูล...</p>
                    </div>
                  )}
                  </div>
                )}

                {( isOrderToReceive || isOrderCompleted) &&
                  isOrderExisting && (
                    <div className="flex flex-col p-4 bg-blue-50 border-2 border-black rounded-2xl gap-3  ">
                      <div className="flex items-center gap-2">
                        <Truck className="text-blue-600" size={20} />
                        <p className="left-0 text-[10px] font-black text-gray-500 uppercase leading-none">
                          {order.deliveryMethod || "พัสดุ"}
                        </p>
                      </div>

                      <div className="flex flex-col gap-2 w-full">
                        {trackingList?.map((no, index) => (
                          <div
                            key={index}
                            className="flex items-start justify-between bg-blue-50 p-3 rounded-xl border border-blue-200 w-full"
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
                      <p className="w-full text-center mt-2 py-2 max-[500px]:text-[10px] text-[12px] font-black text-red-500  leading-tight">
                        *กรณีหมายเลข Tracking No.
                        <br className="hidden max-[440px]:block" />{" "}
                        ผิดพลาดโปรดติดต่อร้านค้า
                      </p>
                    </div>
                  )}

                {isOrderToShip && !isOrderExisting && (
                  <>
                    { isSeller ? (
                      <div className="flex flex-col gap-3 p-4 bg-blue-50 border-2 border-black rounded-[2rem]">
                        <div className="flex items-center gap-2 text-blue-700 font-black text-xs px-2 uppercase">
                          <Truck size={16} />
                          <span>ระบุหมายเลขพัสดุ (Tracking Number)</span>
                        </div>

                        <div className="relative">
                          <textarea
                            placeholder={
                              "ระบุเลขพัสดุ\n(หากมีหลายกล่อง ให้คั่นด้วยเครื่องหมาย , หรือขึ้นบรรทัดใหม่)"
                            }
                            className="w-full p-4 border-2 border-black rounded-2xl font-bold text-[11px] focus:outline-none focus:ring-2 ring-blue-500 min-h-[100px] resize-none"
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
                                toast.error(
                                  "กรุณาระบุเลขพัสดุอย่างน้อย 1 รายการ",
                                );
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
              </div>

              {/* Total & Actions Section */}

              <div className="p-5 bg-white border-t-2 border-dashed border-gray-200">
                <div className="pb-5">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <span className="text-gray-500 font-bold text-sm whitespace-nowrap">
                      สั่งสินค้าเมื่อ:{" "}
                      {new Date(order?.orderCreatedAt).toLocaleDateString(
                        "th-TH",
                      )}
                    </span>
                    <div className="flex flex-col w-full sm:w-auto space-y-2">
                      <div className="flex justify-between sm:justify-end gap-4 max-[380px]:gap-0 max-[350px]:gap-2">
                        <span className="text-sm font-bold text-gray-500 whitespace-nowrap">
                          จำนวนสินค้าทั้งหมด:
                        </span>
                        <span className="text-sm font-black text-red-600 min-w-[80px] text-right max-[350px]:text-left">
                          {(order?.totalQuantity || 0).toLocaleString()} ชิ้น
                        </span>
                      </div>

                      <div className="flex justify-between sm:justify-end gap-4">
                        <span className="text-sm font-bold text-gray-500 whitespace-nowrap">
                          ค่าจัดส่ง:
                        </span>
                        <span className="text-sm font-black text-red-600 min-w-[80px] text-right">
                          ฿<CurrencyDisplay amount={order?.netAmount - order?.totalAmount || 0} /> 
                        </span>
                      </div>

                      <div className="flex justify-between sm:justify-end gap-4 pt-1 border-t border-gray-50 sm:border-none">
                        <span className="text-sm font-bold text-gray-500 whitespace-nowrap">
                          ยอดสุทธิ:
                        </span>
                        <span className="text-sm font-black text-red-600 min-w-[80px] text-right">
                          ฿<CurrencyDisplay amount={order.netAmount} /> 
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  {isPaymentRejected && isCustomer && (
                    <button
                      onClick={() => handlePaymentAgain(order.orderId)}
                      className="w-full sm:flex-1 max-[340px]:text-sm py-3 bg-red-600 text-white border-4 border-black rounded-full font-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-red-700 transition-all active:translate-y-1 active:shadow-none cursor-pointer"
                    >
                        ชำระเงินใหม่
                      </button>
                    )}

                  {role === USER_ROLE.CUSTOMER &&
                    isOrderToReceive && (
                      <button 
                        onClick={() => setIsConfirmReceived(true)}
                        className="w-full sm:flex-1 max-[340px]:text-sm py-3 bg-cprojectfour text-black border-4 border-black rounded-full font-black shadow-[4px_4px_0px_0px_rgba(210,243,222,1)] hover:bg-cprojectthree hover:text-white transition-all active:translate-y-1 active:shadow-none cursor-pointer">
                        ได้รับสินค้าแล้ว
                      </button>
                    )}

                    {isConfirmReceived && (
                        <>
                          <ConfirmDialog
                        open={isConfirmReceived}
                        onClose={() => setIsConfirmReceived(false)}
                        onConfirm={async () => {
                          await handleConfirmReceived(order.orderId);
                          setIsConfirmReceived(false);
                        } }
                        title="ยืนยันการรับสินค้า" content={
                          <div className="flex flex-col gap-1">
                            <p>คุณต้องการยืนยันการรับสินค้า</p>
                            <p>หมายเลข {order.orderNo} หรือไม่?</p>
                          </div>
                        }        
                        />                    
                        </>
                      )
                    }

                  {isOrderPending && (
                    <>
                      {isSeller ? (
                        <button
                          onClick={() => setIsVerifyOpen(true)}
                          className="w-full sm:flex-1 py-3 max-[340px]:text-sm border-4 rounded-full font-black cursor-pointer transition-all shadow-[0_4px_0_0_rgba(0,0,0,0.1)] active:translate-y-[4px] active:shadow-none"
                          style={{
                            animation: "pulse-green-simple 2s infinite",
                          }}
                        >
                          ทำการตรวจสอบ
                        </button>
                      ) : !isPaymentRejected && (
                        <button
                          disabled
                          className="w-full sm:flex-1 max-[340px]:text-[12px] py-3 border-4 rounded-full font-black cursor-not-allowed"
                          style={{
                            animation: "pulse-green-simple 2s infinite",
                          }}
                        >
                          ร้านค้ากำลังทำการตรวจสอบ
                        </button>
                      )}
                    </>
                  )}
</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isVerifyOpen && (
        <VerificationSlip
          order={order as OrdersResponse}
          onClose={() => setIsVerifyOpen(false)}
        />
      )}
      <ConfirmDialog
        open={isConfirmTrackingNoopen}  
        onClose={() => setisConfirmTrackingNoopen(false)}
        onConfirm={async () => {
          await handleAddTrackingNumber(order?.orderId, cleanTrackingList);
          setisConfirmTrackingNoopen(false);
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
