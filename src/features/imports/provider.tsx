"use client";

import { createContext, useContext } from "react";
import type { ImportsApi } from "./api";

const ImportsApiContext = createContext<ImportsApi | null>(null);

export function ImportsApiProvider({ adapter, children }: { adapter: ImportsApi; children: React.ReactNode }) {
  return <ImportsApiContext.Provider value={adapter}>{children}</ImportsApiContext.Provider>;
}

export function useImportsApi() {
  const api = useContext(ImportsApiContext);
  if (!api) throw new Error("ImportsApiProvider is missing");
  return api;
}
