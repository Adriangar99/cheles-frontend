import { expect, test } from "@playwright/test";

const SECURITY_HEADERS = ["x-frame-options", "x-content-type-options", "referrer-policy", "cache-control"];

// The web container runs with API_URL=http://nowhere.invalid:1 (e2e/compose.yaml) after being built with the default
test("API URL fixed at build time", async ({ request }) => {
  const response = await request.get("/api/health");

  expect(await response.json()).toEqual({ ok: true });
});

test("Proxied API response", async ({ request }) => {
  const response = await request.get("/api/health");

  expect(response.headers().server).toBe("uvicorn");
  for (const header of SECURITY_HEADERS) expect(response.headers()).not.toHaveProperty(header);
});
