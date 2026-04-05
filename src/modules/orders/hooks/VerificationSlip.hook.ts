import { OrdersResponse } from "@/modules/orders/type";
import { useGetPaymentSlip } from "../services/index";
import { usePaymentSlipService } from "../services/usePaymentSlipService";
import { ROUTE } from "@/constants/routes";
import { useRouter } from "next/navigation";


export const useVerificationSlip = ( 
  order: OrdersResponse,
  setIsVerifyOpen: (bool: boolean) => void
) => {

  const {data : slipUrlData, isLoading, isError} = useGetPaymentSlip(order.orderId);
  
  const {
    confirmPayment,
    rejectPayment,
  } = usePaymentSlipService();

  const router = useRouter();

  const handleConfirmPayment = async() => {
    await confirmPayment.mutateAsync(order.orderId);
    setIsVerifyOpen(false)
    router.refresh();
    router.push(ROUTE.SELLER.ORDER);
  }

  const handleRejectPayment = async (reason: string) => {
    await rejectPayment.mutateAsync({ 
      orderId: order.orderId, 
      reason 
    });
    setIsVerifyOpen(false);
     router.refresh();
    router.push(ROUTE.SELLER.ORDER);
  };



  return {
    slipUrlData,
    isLoading,
    isError,
    handleConfirmPayment,
    handleRejectPayment,
  }
}