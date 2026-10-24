"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthApiProvider, httpAuthApi } from "@/features/auth";
import { httpStatsApi, StatsApiProvider } from "@/features/stats";
import { httpTransactionsApi, TransactionsApiProvider } from "@/features/transactions";
import { createQueryClient } from "@/shared/query";

// Composition root: the query cache and, per feature, the adapter behind its API port.
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient);
  return (
    <QueryClientProvider client={queryClient}>
      <AuthApiProvider adapter={httpAuthApi}>
        <StatsApiProvider adapter={httpStatsApi}>
          <TransactionsApiProvider adapter={httpTransactionsApi}>{children}</TransactionsApiProvider>
        </StatsApiProvider>
      </AuthApiProvider>
    </QueryClientProvider>
  );
}
