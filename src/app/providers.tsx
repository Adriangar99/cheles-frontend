"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthApiProvider, httpAuthApi } from "@/features/auth";
import { BanksApiProvider, httpBanksApi } from "@/features/banks";
import { httpImportsApi, ImportsApiProvider } from "@/features/imports";
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
          <TransactionsApiProvider adapter={httpTransactionsApi}>
            <BanksApiProvider adapter={httpBanksApi}>
              <ImportsApiProvider adapter={httpImportsApi}>{children}</ImportsApiProvider>
            </BanksApiProvider>
          </TransactionsApiProvider>
        </StatsApiProvider>
      </AuthApiProvider>
    </QueryClientProvider>
  );
}
