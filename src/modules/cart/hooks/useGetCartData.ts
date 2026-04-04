
import { useInfiniteQuery} from "@tanstack/react-query";
import { fetchShoppingCart } from "../services/ShoppingCartService";

export const useGetCartData = (size: number = 100, mode: string = "normalpage") => {
  return useInfiniteQuery({
    queryKey: ["shopping-cart",size],
    queryFn: ({ pageParam = 0 }) => fetchShoppingCart(pageParam as number, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const rawData = lastPage.data || lastPage;

      return rawData.hasNext ? allPages.length : undefined;
    },
    staleTime: 1000 * 60 * 5,
    
  });
};

