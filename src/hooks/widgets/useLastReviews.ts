import { useQuery } from "@tanstack/react-query";
import { getLastReviews } from "../../services/widgets/getLastReviews";

export const useLastReviews = (storeId: string) =>
  useQuery({
    queryKey: ["lastReviews", storeId],
    queryFn: () => getLastReviews({storeId}),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });