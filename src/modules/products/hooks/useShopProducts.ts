// hooks/useProducts.ts
import { InfiniteData } from "@tanstack/react-query";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  getAllShopProducts,
  deleteProduct,
  getShopProductsBySearch,
} from "@/modules/products/services/ShopProductService";
import { useShopProductStore } from "@/modules/products/hooks/useShopProductStore";
import { toast } from "react-hot-toast";
import { ProductHomeResData, SearchProductResData } from "../homeproduct";
import { useDebounce } from "use-debounce";

export const useShopProducts = () => {
  const queryClient = useQueryClient();

  const rawSearchQuery = useShopProductStore((state) => state.searchQuery);
  const [debouncedSearch] = useDebounce(rawSearchQuery, 800);
  const isSearchMode = debouncedSearch.trim().length > 0;
  const {
    data,
    hasNextPage,
    isFetchingNextPage,
    isLoading: isFetching,
    isError,
    refetch,
    fetchNextPage,
  } = useInfiniteQuery<
    SearchProductResData | ProductHomeResData,
    Error,
    InfiniteData<SearchProductResData | ProductHomeResData>,
    string[],
    number
  >({
    queryKey: ["seller-shop-products", debouncedSearch],
    queryFn: ({ pageParam = 0 }) => {
      return isSearchMode
        ? getShopProductsBySearch({ pageParam, size: 10, q: debouncedSearch })
        : getAllShopProducts({ pageParam, size: 10 });
    },
    initialPageParam: 0,
    staleTime: 5*60*1000,
    gcTime: 10*60*1000,
    retry: 2,
    retryDelay: 1000,
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext ? lastPage.page + 1 : undefined;
    },
  });

  const allFetchedProducts =
    data?.pages.flatMap((page) => {
      if (isSearchMode) {
        return (page as SearchProductResData).products || [];
      }

      return (page as ProductHomeResData).allProducts || [];
    }) || [];

  // สำหรับ รับค่าที่ เป็นสินค้าขายดี  
  // const allFeaturedProducts = !isSearchMode
  //   ? (data?.pages[0] as ProductHomeResData)?.featuredProducts || []
  //   : [];

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-shop-products"] });
      toast.success("ลบสินค้าสำเร็จ");
    },
  });

  const editMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log("Editing...", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["seller-shop-products"] });
      toast.success("แก้ไขข้อมูลสำเร็จ");
    },
    onError: () => toast.error("แก้ไขไม่สำเร็จ"),
  });

  // const isLoading =
  //   isFetching || deleteMutation.isPending || editMutation.isPending;
  return {
    // featuredProducts: allFeaturedProducts,
    nonFeaturedProducts: allFetchedProducts,
    totalAll: data?.pages[0]?.totalProducts || 0,
    isInitialLoading: isFetching && !data,
    isSearchMode,
    isFetchingNextPage,
    hasNextPage,
    isError,
    isFetching,
    isDeleting: deleteMutation.isPending,
    isEditing: editMutation.isPending,
    refetch,
    fetchNextPage,
    deleteProduct: deleteMutation.mutateAsync,
    editProduct: editMutation.mutate,
  };
};
