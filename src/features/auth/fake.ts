import type { AuthApi } from "./api";

// An in-memory AuthApi for stories and feature tests: «123456» is the only valid code
export function fakeAuthApi(): AuthApi {
  return {
    async login({ code }) {
      await new Promise((resolve) => setTimeout(resolve, 600));
      if (code !== "123456") throw new Error("Datos incorrectos");
    },
    async logout() {},
  };
}
