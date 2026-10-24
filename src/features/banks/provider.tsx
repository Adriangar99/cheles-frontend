"use client";

import { createContext, useContext } from "react";
import type { BanksApi } from "./api";

const BanksApiContext = createContext<BanksApi | null>(null);

export function BanksApiProvider({ adapter, children }: { adapter: BanksApi; children: React.ReactNode }) {
  return <BanksApiContext.Provider value={adapter}>{children}</BanksApiContext.Provider>;
}

export function useBanksApi() {
  const api = useContext(BanksApiContext);
  if (!api) throw new Error("BanksApiProvider is missing");
  return api;
}
