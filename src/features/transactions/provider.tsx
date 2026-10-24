"use client";

import { createContext, useContext } from "react";
import type { TransactionsApi } from "./api";

const TransactionsApiContext = createContext<TransactionsApi | null>(null);

export function TransactionsApiProvider({
  adapter,
  children,
}: {
  adapter: TransactionsApi;
  children: React.ReactNode;
}) {
  return <TransactionsApiContext.Provider value={adapter}>{children}</TransactionsApiContext.Provider>;
}

export function useTransactionsApi() {
  const api = useContext(TransactionsApiContext);
  if (!api) throw new Error("TransactionsApiProvider is missing");
  return api;
}
