import { useQuery } from "@tanstack/react-query";
import { getProductRating } from "../../services/widgets/getProductRating";

export const useProductRating = (
  storeId: string,
  productId: string
) =>
  useQuery({
    queryKey: ["productRating", storeId, productId],
    queryFn: () => getProductRating({storeId, productId}),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!storeId && !!productId,
  });