import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import Banks from "@/app/(app)/bancos/page";
import MyMonth from "@/app/(app)/page";
import LoginPage from "@/app/login/page";
import { fail, fakeApi, ok } from "./fake-api";
import { stubLocation } from "./location";

const SECURITY_HEADERS = [
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "no-referrer" },
  { key: "Cache-Control", value: "no-store" },
];

async function nextConfig() {
  vi.resetModules();
  return (await import("../next.config")).default;
}

const noBanks = ok({ connections: [], detached_accounts: [] });

async function login(user = userEvent.setup()) {
  await user.type(screen.getByPlaceholderText("usuario"), "adrian");
  await user.type(screen.getByPlaceholderText("contraseña"), "secret");
  await user.type(screen.getByPlaceholderText("código de 6 dígitos"), "123456");
  await user.click(screen.getByRole("button", { name: "entrar" }));
}

test("Proxied request", async () => {
  vi.stubEnv("API_URL", "http://api:8000");
  const config = await nextConfig();

  expect(await config.rewrites?.()).toEqual([{ source: "/api/:path*", destination: "http://api:8000/api/:path*" }]);
});

test("JSON payload", async () => {
  stubLocation("/login");
  const api = fakeApi({ "POST /api/auth/login": ok({ ok: true }) });
  render(<LoginPage />);

  await login();

  const [request] = api.to("POST", "/api/auth/login");
  expect(request.headers.get("Content-Type")).toBe("application/json");
  expect(request.body).toEqual({ username: "adrian", password: "secret", code: "123456" });
});

test("Session expired while browsing", async () => {
  const location = stubLocation("/");
  fakeApi({ "GET /api/stats/summary": fail(401), "GET /api/stats/history": fail(401) });
  render(<MyMonth />);

  await waitFor(() => expect(location.href).toBe("/login"));
});

test("Failed login is not redirected", async () => {
  const location = stubLocation("/login");
  fakeApi({ "POST /api/auth/login": fail(401, { detail: "Datos incorrectos" }) });
  render(<LoginPage />);

  await login();

  expect(await screen.findByText("Datos incorrectos")).toBeInTheDocument();
  expect(location.href).toBe("http://localhost/login");
});

test("Error with detail", async () => {
  stubLocation("/bancos");
  fakeApi({ "GET /api/banks": noBanks, "POST /api/reprocess": fail(502, { detail: "Enable Banking: caído" }) });
  render(<Banks />);

  await userEvent.click(await screen.findByRole("button", { name: "hazlo ahora" }));

  expect(await screen.findByText("Enable Banking: caído")).toBeInTheDocument();
});

test("Error without detail", async () => {
  stubLocation("/bancos");
  fakeApi({ "GET /api/banks": noBanks, "POST /api/reprocess": fail(500) });
  render(<Banks />);

  await userEvent.click(await screen.findByRole("button", { name: "hazlo ahora" }));

  expect(await screen.findByText("Error 500")).toBeInTheDocument();
});

test("Headers on a page", async () => {
  const config = await nextConfig();

  expect(await config.headers?.()).toEqual([{ source: "/:path*", headers: SECURITY_HEADERS }]);
  expect(config.poweredByHeader).toBe(false);
});
