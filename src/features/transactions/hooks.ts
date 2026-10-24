import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { TransactionFilter, TransactionPatch } from "./api";
import { useTransactionsApi } from "./provider";

const DEBOUNCE_MS = 250;

// The value once it has not changed for `ms`; undefined until then, including on the first render.
export function useDebounced<T>(value: T, ms = DEBOUNCE_MS) {
  const [settled, setSettled] = useState<T>();
  useEffect(() => {
    const timer = setTimeout(() => setSettled(value), ms);
    return () => clearTimeout(timer);
  }, [value, ms]);
  return settled;
}

// Waits for a settled filter; the previous list stays on screen until the new one arrives.
export function useTransactions(filter: TransactionFilter | undefined) {
  const api = useTransactionsApi();
  return useQuery({
    queryKey: ["transactions", filter?.month, filter?.q],
    queryFn: () => api.list(filter as TransactionFilter),
    enabled: filter !== undefined,
    placeholderData: keepPreviousData,
  });
}

export function useCategories() {
  const api = useTransactionsApi();
  return useQuery({ queryKey: ["categories"], queryFn: () => api.categories() });
}

// Every edit reloads the visible list.
export function useUpdateTransaction() {
  const api = useTransactionsApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: number; patch: TransactionPatch }) => api.update(id, patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["transactions"] }),
  });
}
