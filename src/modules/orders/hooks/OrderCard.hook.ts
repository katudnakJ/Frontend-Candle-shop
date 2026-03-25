import { useRouter } from "next/navigation";
import { useOrderCardService } from "../services";
import { OrdersResponse } from "../type";
import { ROUTE } from "@/constants/routes";


export const useOrderCard = (
    setIsVerifyOpen : (bool: boolean) => void,
    order : OrdersResponse
) => {

    const router = useRouter();
    const {
        addTrackingNumber
    } = useOrderCardService();

    const handlePaymentAgain = () => {
        router.push(
          `/shoppingcart/checkoutcart/paymentcart?orderId=${order.orderId}&mode=repay`,
        );
    };  
    
    const handleAddTrackingNumber = async (orderId: string, trackingNumber: string[]) => {
    await addTrackingNumber.mutateAsync({ orderId, trackingNumber });
    setIsVerifyOpen(false);
    router.push(ROUTE.SELLER.ORDER);
  }

    return { 
        handlePaymentAgain,
        handleAddTrackingNumber
     }
}