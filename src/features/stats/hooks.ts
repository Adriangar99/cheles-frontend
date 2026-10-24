import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useStatsApi } from "./provider";

const HISTORY_MONTHS = 12;

// The previous month's figures stay on screen until the new month's arrive.
export function useSummary(month: string) {
  const api = useStatsApi();
  return useQuery({
    queryKey: ["stats", "summary", month],
    queryFn: () => api.summary(month),
    placeholderData: keepPreviousData,
  });
}

// Independent of the selected month: navigating never refetches it.
export function useHistory() {
  const api = useStatsApi();
  return useQuery({ queryKey: ["stats", "history", HISTORY_MONTHS], queryFn: () => api.history(HISTORY_MONTHS) });
}
