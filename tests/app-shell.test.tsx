import { existsSync } from "node:fs";
import { screen, waitFor } from "@testing-library/react";
import { NextRequest } from "next/server";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, test, vi } from "vitest";
import AppLayout from "@/app/(app)/layout";
import MyMonth from "@/app/(app)/page";
import RootLayout, { metadata, viewport } from "@/app/layout";
import LoginPage from "@/app/login/page";
import { config, middleware } from "@/middleware";
import { fail, fakeApi } from "./fake-api";
import { stubLocation } from "./location";
import { renderScreen } from "./render";

const navigation = vi.hoisted(() => ({ path: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => navigation.path }));

const guarded = (path: string) => new RegExp(`^${config.matcher[0]}$`).test(path);
const request = (path: string, cookie?: string) =>
  new NextRequest(`http://localhost${path}`, { headers: cookie ? { cookie } : {} });

test("No session cookie", () => {
  const response = middleware(request("/movimientos"));

  expect(guarded("/movimientos")).toBe(true);
  expect(response.status).toBe(307);
  expect(response.headers.get("location")).toBe("http://localhost/login");
});

test("Stale session cookie", async () => {
  const response = middleware(request("/", "cheles_session=stale"));
  expect(response.headers.get("x-middleware-next")).toBe("1");

  const location = stubLocation("/");
  fakeApi({ "GET /api/stats/summary": fail(401), "GET /api/stats/history": fail(401) });
  renderScreen(<MyMonth />);

  await waitFor(() => expect(location.href).toBe("/login"));
});

test("Login page is reachable", () => {
  expect(guarded("/login")).toBe(false);

  renderScreen(<LoginPage />);

  expect(screen.getByRole("heading", { name: "cheles" })).toBeInTheDocument();
});

test("Navigate between screens", () => {
  navigation.path = "/movimientos";

  renderScreen(<AppLayout>contenido</AppLayout>);

  const tabs = screen.getAllByRole("link");
  expect(tabs.map((t) => [t.textContent, t.getAttribute("href"), t.className])).toEqual([
    ["◔mi mes", "/", ""],
    ["☰movimientos", "/movimientos", "on"],
    ["⌂bancos", "/bancos", ""],
  ]);
});

test("Login has no tabs", () => {
  // The tab bar lives in the (app) route group's layout; login sits outside it, under the bare root layout.
  expect(existsSync("src/app/login/page.tsx")).toBe(true);
  expect(existsSync("src/app/(app)/login")).toBe(false);

  expect(renderToStaticMarkup(<RootLayout>login</RootLayout>)).not.toContain("<nav");
});

test("Metadata", () => {
  expect(renderToStaticMarkup(<RootLayout>x</RootLayout>)).toContain('<html lang="es">');
  expect(metadata).toMatchObject({
    title: "Cheles",
    robots: { index: false, follow: false },
    appleWebApp: { capable: true, title: "Cheles", statusBarStyle: "default" },
  });
  expect(viewport.themeColor).toEqual([
    { media: "(prefers-color-scheme: light)", color: "#E8ECF1" },
    { media: "(prefers-color-scheme: dark)", color: "#0E1828" },
  ]);
});
