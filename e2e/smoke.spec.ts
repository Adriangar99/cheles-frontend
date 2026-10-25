import { expect, test } from "@playwright/test";

test("the stack answers", async ({ request }) => {
  expect((await request.get("/api/health")).ok()).toBe(true);
});
