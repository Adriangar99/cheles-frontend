"use client";

import { createContext, useContext } from "react";
import type { AuthApi } from "./api";

const AuthApiContext = createContext<AuthApi | null>(null);

export function AuthApiProvider({ adapter, children }: { adapter: AuthApi; children: React.ReactNode }) {
  return <AuthApiContext.Provider value={adapter}>{children}</AuthApiContext.Provider>;
}

export function useAuthApi() {
  const api = useContext(AuthApiContext);
  if (!api) throw new Error("AuthApiProvider is missing");
  return api;
}
