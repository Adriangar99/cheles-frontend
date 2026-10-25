import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { expect, test } from "vitest";
import Banks from "@/app/(app)/bancos/page";
import Movements from "@/app/(app)/movimientos/page";
import MyMonth from "@/app/(app)/page";
import { fakeApi, ok } from "./fake-api";
import { stubLocation, today } from "./location";
import { renderScreen } from "./render";
import { account, connection, noHistory, summary, tx } from "./screens";

async function incomeShownFor(income: number) {
  today("2026-10-15T12:00:00");
  fakeApi({ "GET /api/stats/summary": ok(summary({ income })), "GET /api/stats/history": noHistory });
  renderScreen(<MyMonth />);
  return (await screen.findByText("ingresos", { selector: "dt" })).nextElementSibling?.textContent?.replace(/\s/g, " ");
}

test("Four digits are not grouped", async () => {
  expect(await incomeShownFor(1234.5)).toBe("1234,50 €");
});

test("Five digits are grouped", async () => {
  expect(await incomeShownFor(12345.5)).toBe("12.345,50 €");
});

test("Negative amount", async () => {
  expect(await incomeShownFor(-12.5)).toBe("-12,50 €");
});

test("Missing amount", async () => {
  stubLocation("/bancos");
  fakeApi({
    "GET /api/banks": ok({
      connections: [connection({ accounts: [account({ balance: null })] })],
      detached_accounts: [],
    }),
  });
  renderScreen(<Banks />);

  expect(await screen.findByText("—")).toBeInTheDocument();
});

test("Month heading", async () => {
  today("2026-10-15T12:00:00");
  fakeApi({ "GET /api/stats/summary": ok(summary()), "GET /api/stats/history": noHistory });
  renderScreen(<MyMonth />);

  const heading = screen.getByRole("heading", { level: 1 });
  expect(heading).toHaveTextContent("octubre de 2026");
  expect(heading).not.toHaveStyle({ textTransform: "capitalize" });
});

test("Forward across the year", async () => {
  today("2027-01-15T12:00:00");
  const api = fakeApi({ "GET /api/stats/summary": ok(summary()), "GET /api/stats/history": noHistory });
  renderScreen(<MyMonth />);

  await userEvent.click(screen.getByRole("button", { name: "mes anterior" }));
  await userEvent.click(screen.getByRole("button", { name: "mes siguiente" }));

  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("enero de 2027");
  expect(api.to("GET", "/api/stats/summary").map((r) => r.query.get("month"))).toEqual([
    "2027-01",
    "2026-12",
    "2027-01",
  ]);
});

test("Backward across the year", async () => {
  today("2026-01-15T12:00:00");
  const api = fakeApi({ "GET /api/stats/summary": ok(summary()), "GET /api/stats/history": noHistory });
  renderScreen(<MyMonth />);

  await userEvent.click(screen.getByRole("button", { name: "mes anterior" }));

  expect(api.to("GET", "/api/stats/summary").at(-1)?.query.get("month")).toBe("2025-12");
});

test("Transaction date", async () => {
  today("2026-10-15T12:00:00");
  fakeApi({ "GET /api/transactions": ok([tx({ date: "2026-10-03" })]), "GET /api/categories": ok([]) });
  renderScreen(<Movements />);

  expect(await screen.findByRole("heading", { name: "sábado, 3 de octubre" })).toBeInTheDocument();
});

test("Just after midnight on the first day", async () => {
  // 00:30 on 1 November in Madrid is still 31 October in UTC
  today("2026-10-31T23:30:00Z");
  const api = fakeApi({ "GET /api/stats/summary": ok(summary()), "GET /api/stats/history": noHistory });
  renderScreen(<MyMonth />);

  expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent("noviembre de 2026");
  await waitFor(() => expect(api.to("GET", "/api/stats/summary")[0]?.query.get("month")).toBe("2026-11"));
});
