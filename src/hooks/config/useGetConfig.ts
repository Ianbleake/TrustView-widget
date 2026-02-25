import { useQuery } from "@tanstack/react-query";
import { getConfig } from "../../services/widgets/getConfig";

export const useGetConfig = (storeId: string) =>
  useQuery({
    queryKey: ["getConfig", storeId],
    queryFn: () => getConfig({storeId}),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });