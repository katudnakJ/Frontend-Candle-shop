import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { useOrderCardService } from "../services";
import { OrdersResponse } from "../type";
import { ROUTE } from "@/constants/routes";
import { getOrderReceiptWithStale } from "../services";


export const useOrderCard = (
    setIsVerifyOpen : (bool: boolean) => void,
    order : OrdersResponse
) => {

    const router = useRouter();
    const getStatusDisplay = (status: OrdersResponse["orderStatus"]) => {
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

    const {
        addTrackingNumber,
    } = useOrderCardService();

    const [isPDFCreating, setIsPDFCreating] = useState(false);

    const handlePaymentAgain = () => {
        toast.error("checkout flow needed")
        console.log("ข้อความจาก handlePaymentAgain \n ใช้เส้น : /v1/checkout/${orderId}", );
        
        // router.push(
        //   `/shoppingcart/checkoutcart/paymentcart?orderId=${order.orderId}&mode=repay`,
        // );
    };  
    
    const handleAddTrackingNumber = async (orderId: string, trackingNumber: string[]) => {
    await addTrackingNumber.mutateAsync({ orderId, trackingNumber });
    setIsVerifyOpen(false);
    router.push(ROUTE.SELLER.ORDER);
  }

  const handleDowloadPDF = async(orderId: string) => {
    setIsPDFCreating(true);
    const fileUrl = await getOrderReceiptWithStale(orderId);

    if (fileUrl === null) {
        toast.error("ไม่พบไฟล์ใบเสร็จ กรุณาลองใหม่อีกครั้ง");
        setIsPDFCreating(false);
        return;
     }

    setIsPDFCreating(false);

    window.open(fileUrl?.signedFileUrl, "_blank");
  }

    return { 
        handlePaymentAgain,
        handleAddTrackingNumber,
        getStatusDisplay,
        handleDowloadPDF,
        isPDFCreating,
     }
}