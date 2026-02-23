import { useRef } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "react-hot-toast";
import { Order } from "../type";

export const useReceiptPDF = (order: Order) => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!receiptRef.current) return;

    try {
      const loadingToast = toast.loading("กำลังสร้างใบเสร็จ PDF...", {
        duration: 4000,
      });

      const canvas = await html2canvas(receiptRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(
        `Receipt-${order.order_no}-${new Date(order.order_created_date).toLocaleDateString("th-TH")}.pdf`,
      );

      toast.dismiss(loadingToast);
      toast.success("ดาวน์โหลดใบเสร็จเรียบร้อยแล้ว!");
    } catch (error) {
      console.error("PDF Generation Error:", error);
      toast.error("ไม่สามารถสร้าง PDF ได้ในขณะนี้");
    }
  };

  return { receiptRef, downloadPDF };
};
