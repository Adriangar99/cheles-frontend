"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { AuthApiProvider, httpAuthApi } from "@/features/auth";
import { createQueryClient } from "@/shared/query";

// Composition root: the query cache and, per feature, the adapter behind its API port.
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(createQueryClient);
  return (
    <QueryClientProvider client={queryClient}>
      <AuthApiProvider adapter={httpAuthApi}>{children}</AuthApiProvider>
    </QueryClientProvider>
  );
}
