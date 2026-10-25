import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test, vi } from "vitest";
import Banks from "@/app/(app)/bancos/page";
import MyMonth from "@/app/(app)/page";
import LoginPage from "@/app/login/page";
import { fail, fakeApi, ok } from "./fake-api";
import { stubLocation } from "./location";
import { renderScreen } from "./render";

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
  await user.type(screen.getByPlaceholderText("Usuario"), "adrian");
  await user.type(screen.getByPlaceholderText("Contraseña"), "secret");
  await user.type(screen.getByPlaceholderText("Código de 6 dígitos"), "123456");
  await user.click(screen.getByRole("button", { name: "Entrar" }));
}

test("Proxied request", async () => {
  vi.stubEnv("API_URL", "http://api:8000");
  const config = await nextConfig();

  expect(await config.rewrites?.()).toEqual([{ source: "/api/:path*", destination: "http://api:8000/api/:path*" }]);
});

test("JSON payload", async () => {
  stubLocation("/login");
  const api = fakeApi({ "POST /api/auth/login": ok({ ok: true }) });
  renderScreen(<LoginPage />);

  await login();

  const [request] = api.to("POST", "/api/auth/login");
  expect(request.headers.get("Content-Type")).toBe("application/json");
  expect(request.body).toEqual({ username: "adrian", password: "secret", code: "123456" });
});

test("Session expired while browsing", async () => {
  const location = stubLocation("/");
  fakeApi({ "GET /api/stats/summary": fail(401), "GET /api/stats/history": fail(401) });
  renderScreen(<MyMonth />);

  await waitFor(() => expect(location.href).toBe("/login"));
  // The browser is leaving; the screen does not flash the client's «No autenticado»
  expect(screen.queryByText("No autenticado")).not.toBeInTheDocument();
});

test("Failed login is not redirected", async () => {
  const location = stubLocation("/login");
  fakeApi({ "POST /api/auth/login": fail(401, { detail: "Datos incorrectos" }) });
  renderScreen(<LoginPage />);

  await login();

  expect(await screen.findByText("Datos incorrectos")).toBeInTheDocument();
  expect(location.href).toBe("http://localhost/login");
});

test("Error with detail", async () => {
  stubLocation("/bancos");
  fakeApi({ "GET /api/banks": noBanks, "POST /api/reprocess": fail(502, { detail: "Enable Banking: caído" }) });
  renderScreen(<Banks />);

  await userEvent.click(await screen.findByRole("button", { name: "Hazlo ahora" }));

  expect(await screen.findByText("Enable Banking: caído")).toBeInTheDocument();
});

test("Error without detail", async () => {
  stubLocation("/bancos");
  fakeApi({ "GET /api/banks": noBanks, "POST /api/reprocess": fail(500) });
  renderScreen(<Banks />);

  await userEvent.click(await screen.findByRole("button", { name: "Hazlo ahora" }));

  expect(await screen.findByText("Error 500")).toBeInTheDocument();
});

test("Validation error", async () => {
  stubLocation("/bancos");
  const detail = [{ loc: ["body", "role"], msg: "Input should be 'main'", type: "enum" }];
  fakeApi({ "GET /api/banks": noBanks, "POST /api/reprocess": fail(422, { detail }) });
  renderScreen(<Banks />);

  await userEvent.click(await screen.findByRole("button", { name: "Hazlo ahora" }));

  expect(await screen.findByText("Datos no válidos")).toBeInTheDocument();
});

test("Headers on a page", async () => {
  const config = await nextConfig();

  expect(await config.headers?.()).toEqual([{ source: "/:path*", headers: SECURITY_HEADERS }]);
  expect(config.poweredByHeader).toBe(false);
});
