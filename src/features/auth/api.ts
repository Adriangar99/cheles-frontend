import { api, call } from "@/shared/api/client";
import type { components } from "@/shared/api/schema";

export type Credentials = components["schemas"]["LoginBody"];

export interface AuthApi {
  login(credentials: Credentials): Promise<void>;
  logout(): Promise<void>;
}

export const httpAuthApi: AuthApi = {
  async login(credentials) {
    // A rejected login is a 401 that must stay on the page and show its message
    await call(api().POST("/api/auth/login", { body: credentials }), { redirectOn401: false });
  },
  async logout() {
    await call(api().POST("/api/auth/logout"));
  },
};
