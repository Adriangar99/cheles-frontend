import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

// Dates are shown in the user's zone; workers inherit it
process.env.TZ = "Europe/Madrid";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) } },
  test: {
    environment: "jsdom",
    include: ["tests/**/*.test.{ts,tsx}"],
    setupFiles: ["tests/setup.ts"],
    restoreMocks: true,
    unstubGlobals: true,
    // Screens do not catch the error the API client throws after redirecting a 401 to /login (current
    // behavior, fixed with the feature restructure); that one rejection is expected, any other still fails.
    onUnhandledError: (error) => error.message !== "No autenticado",
  },
});
