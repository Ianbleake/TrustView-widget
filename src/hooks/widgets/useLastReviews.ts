import { useQuery } from "@tanstack/react-query";
import { getLastReviews } from "../../services/widgets/getLastReviews";

export const useLastReviews = (storeId: string, page: number = 1, limit: number = 9) =>
  useQuery({
    queryKey: ["lastReviews", storeId, page, limit],
    queryFn: () => getLastReviews({ store_external_id: storeId, page, limit }),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
