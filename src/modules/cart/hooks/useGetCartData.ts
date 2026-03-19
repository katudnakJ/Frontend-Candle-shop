// // @/modules/cart/hooks/useCartData.ts
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { fetchShoppingCart } from "../services/ShoppingCartService";

export const useGetCartData = (page: number = 0, size: number = 100) => {
  return useQuery({
    queryKey: ["shopping-cart",page,size],
    queryFn: () => fetchShoppingCart(page, size),
    placeholderData: keepPreviousData,
  });
};

