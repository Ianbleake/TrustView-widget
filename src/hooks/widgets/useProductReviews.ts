import { useQuery } from "@tanstack/react-query";
import { getProductReviews } from "../../services/widgets/getProductReviews";

export const useProductReviews = (
  storeId: string,
  productId: string,
  page: number = 1,
  limit: number = 9
) =>
  useQuery({
    queryKey: ["productReviews", storeId, productId, page, limit],
    queryFn: () => getProductReviews({ store_external_id: storeId, product_external_id: productId, page, limit }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!storeId && !!productId,
  });
