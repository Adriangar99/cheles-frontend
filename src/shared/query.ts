import { QueryClient } from "@tanstack/react-query";

// Defaults that keep the screens' behavior: a failed request shows its error at once, and nothing refetches by itself.
export function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: { retry: false, refetchOnWindowFocus: false, refetchOnReconnect: false },
      mutations: { retry: false },
    },
  });
}
