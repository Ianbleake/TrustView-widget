import { useQuery } from "@tanstack/react-query";
import { getProductReviews } from "../../services/widgets/getProductReviews";


export const useProductReviews = (
  storeId: string,
  productId: string
) =>
  useQuery({
    queryKey: ["productReviews", storeId, productId],
    queryFn: () => getProductReviews({storeId, productId}),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!storeId && !!productId,
  });