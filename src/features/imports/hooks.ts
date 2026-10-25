import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { ImportRequest } from "./api";
import { useImportsApi } from "./provider";

// The preview of a file with its targets; a new request replaces the previous one, which stays shown meanwhile
export function useImportPreview(request: ImportRequest | null) {
  const api = useImportsApi();
  return useQuery({
    queryKey: ["imports", "preview", request],
    queryFn: () => api.preview(request as ImportRequest),
    enabled: request !== null,
    placeholderData: keepPreviousData,
    retry: false,
  });
}

// Importing changes accounts, figures and transactions: everything is loaded again
export function useRunImport() {
  const api = useImportsApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: ImportRequest) => api.run(request),
    onSuccess: () => queryClient.invalidateQueries({ predicate: (q) => q.queryKey[0] !== "imports" }),
  });
}
