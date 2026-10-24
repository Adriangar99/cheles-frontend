"use client";

import { createContext, useContext } from "react";
import type { StatsApi } from "./api";

const StatsApiContext = createContext<StatsApi | null>(null);

export function StatsApiProvider({ adapter, children }: { adapter: StatsApi; children: React.ReactNode }) {
  return <StatsApiContext.Provider value={adapter}>{children}</StatsApiContext.Provider>;
}

export function useStatsApi() {
  const api = useContext(StatsApiContext);
  if (!api) throw new Error("StatsApiProvider is missing");
  return api;
}
