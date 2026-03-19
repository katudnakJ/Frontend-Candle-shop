// @/modules/cart/hooks/useCartData.ts
import { useQuery } from "@tanstack/react-query";
import { fetchShoppingCart } from "../services/ShoppingCartService";

export const useCartData = () => {
  return useQuery({
    queryKey: ["shopping-cart"],
    queryFn: async () => {
      const response = await fetchShoppingCart(0, 100);
      const checkoutdata = response?.data || response;
      return checkoutdata.cartItems || [];
    },
  });
};