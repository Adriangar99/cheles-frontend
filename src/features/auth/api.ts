import { request } from "@/shared/api/http";
import type { components } from "@/shared/api/schema";

export type Credentials = components["schemas"]["LoginBody"];

export interface AuthApi {
  login(credentials: Credentials): Promise<void>;
  logout(): Promise<void>;
}

export const httpAuthApi: AuthApi = {
  async login(credentials) {
    await request("/auth/login", { method: "POST", json: credentials });
  },
  async logout() {
    await request("/auth/logout", { method: "POST" });
  },
};
