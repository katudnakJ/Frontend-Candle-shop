"use client";
import { useState, useEffect } from "react"; // 1. เพิ่ม useEffect
import { createPortal } from "react-dom";
import Image from "next/image";
import { X } from "lucide-react";
import { Order } from "@/modules/orders/type";
import ConfirmDialog from "@/components/commonui/ConfirmDialog";

interface VerificationModalProps {
  order: Order;
  onClose: () => void;
  onConfirm: () => void;
  onReject: (reason: string) => void;
}

export const VerificationSlip = ({
  order,
  onClose,
  onConfirm,
  onReject,
}: VerificationModalProps) => {
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [reason, setReason] = useState("");
  const [mounted, setMounted] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(frame);
  }, []);

  if (!mounted || typeof document === "undefined") return null;

  return (
    <>
      {createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-[2.5rem] border-4 border-black overflow-hidden flex flex-col max-h-[90vh] shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="p-6 border-b-4 border-black flex justify-between items-center bg-cprojectone">
              <h3 className="font-black text-xl">ตรวจสอบการชำระเงิน</h3>
              <button
                onClick={onClose}
                className="p-2 border-2 border-black rounded-full bg-white hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            {/* Slip Image Section */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              <div className="relative min-h-[300px] max-h-[500px] w-full border-4 border-black rounded-3xl overflow-hidden bg-gray-100 shadow-[inner_0_2px_4px_rgba(0,0,0,0.1)]">
                <Image
                  src={order.slipURL || "/placeholder-image.svg"}
                  alt="Payment Slip"
                  fill
                  className="object-contain p-2"
                />
              </div>
              <div className="bg-gray-50 p-4 rounded-2xl border-2 border-dashed border-black">
                <p className="font-bold text-sm text-gray-500 text-center">
                  ยอดที่ต้องชำระ:{" "}
                  <span className="text-red-600 text-lg">
                    ฿{order.net_amount.toLocaleString()}
                  </span>
                </p>
              </div>
            </div>

            {/* Footer Actions*/}
            <div className="p-6 bg-white border-t-4 border-black space-y-3">
              {!showRejectInput ? (
                <div className="flex flex-row-reverse gap-3">
                  <button
                    onClick={() => setShowRejectInput(true)}
                    className="flex-1 py-4 border-4 border-black rounded-full font-black text-red-600 hover:bg-red-200 transition-all active:translate-y-1"
                  >
                    ปฏิเสธ
                  </button>
                  <button
                    onClick={() => setIsConfirmDialogOpen(true)}
                    className="flex-1 py-4 bg-green-400 border-4 border-black rounded-full font-black shadow-[4px_4px_0px_0px_black] hover:bg-green-400 transition-all active:translate-y-1 active:shadow-none"
                  >
                    ยืนยันการชำระ
                  </button>
                </div>
              ) : (
                <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2">
                  <div className="relative">
                    <textarea
                      placeholder="ระบุเหตุผลที่ปฏิเสธ (เช่น สลิปไม่ถูกต้อง, ยอดไม่ครบ)"
                      className="w-full p-4 border-4 border-black rounded-2xl font-bold text-[11px] focus:outline-none focus:ring-2 ring-red-500 min-h-[100px] resize-none"
                      maxLength={50}
                      value={reason}
                      onChange={(e) => {
                        const value = e.target.value;
                        const cleanValue = value.replace(
                          /[^a-zA-Z0-9ก-๙\s]/g,
                          "",
                        );
                        setReason(cleanValue);
                      }}
                    />
                    <div
                      className={`absolute bottom-4 right-5 text-[10px] font-black ${reason.length >= 50 ? "text-red-600" : "text-gray-400"}`}
                    >
                      {reason.length}/50
                    </div>
                  </div>
                  <div className="flex flex-row-reverse gap-3">
                    <button
                      onClick={() => {
                        setShowRejectInput(false);
                        setReason("");
                      }}
                      className="flex-1 font-bold underline"
                    >
                      ยกเลิก
                    </button>
                    <button
                      onClick={() => onReject(reason)}
                      disabled={!reason.trim()}
                      className="flex-[2] py-4 bg-red-600 text-white border-4 border-black rounded-full font-black disabled:opacity-50"
                    >
                      ส่งการปฏิเสธ
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body,
      )}
      <ConfirmDialog
        open={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        onConfirm={() => {
          setIsConfirmDialogOpen(false);
          onConfirm(); // เรียกฟังก์ชันยืนยันจริง
        }}
        title="ยืนยันการตรวจสอบ"
        content={
          <>
            คุณตรวจสอบสลิปและยอดเงิน <br />
            เรียบร้อยแล้วใช่หรือไม่?
           
            <br />
            <span>ยอดเงิน: </span>
             <span className="font-bold text-black">
              ฿{order.net_amount.toLocaleString()}
            </span>{" "}
          </>
        }
        variant="primary"
      />
    </>
  );
};
