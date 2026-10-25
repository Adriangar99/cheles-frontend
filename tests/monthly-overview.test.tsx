import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test } from "vitest";
import MyMonth from "@/app/(app)/page";
import { fail, fakeApi, ok, pending } from "./fake-api";
import { today } from "./location";
import { renderScreen } from "./render";
import { summary } from "./screens";

type Summary = ReturnType<typeof summary>;

beforeEach(() => today("2026-10-15T12:00:00"));

function open(month: Partial<Summary> = {}, history: unknown[] = []) {
  const api = fakeApi({
    "GET /api/stats/summary": (req) => ok(summary({ month: req.query.get("month") ?? "", ...month })),
    "GET /api/stats/history": ok(history),
  });
  renderScreen(<MyMonth />);
  return api;
}

// A figure is a term (dt) followed by its value (dd)
const card = async (label: string) => (await screen.findByText(label, { selector: "dt" })).nextElementSibling;
const heading = () => screen.getByRole("heading", { level: 1 });
const meter = (name: string) => screen.getByRole("meter", { name });

test("Default month", async () => {
  const api = open();

  expect(heading()).toHaveTextContent("octubre de 2026");
  expect(screen.getByRole("button", { name: "mes siguiente" })).toBeDisabled();
  await card("ingresos");
  expect(api.to("GET", "/api/stats/summary")[0].query.get("month")).toBe("2026-10");
});

test("Go to the previous month", async () => {
  const api = open();

  await userEvent.click(screen.getByRole("button", { name: "mes anterior" }));

  expect(heading()).toHaveTextContent("septiembre de 2026");
  expect(screen.getByRole("button", { name: "mes siguiente" })).toBeEnabled();
  expect(api.to("GET", "/api/stats/summary").at(-1)?.query.get("month")).toBe("2026-09");
});

test("Year boundary", async () => {
  today("2026-01-15T12:00:00");
  open();

  await userEvent.click(screen.getByRole("button", { name: "mes anterior" }));

  expect(heading()).toHaveTextContent("diciembre de 2025");
});

test("Positive month", async () => {
  open({ income: 2000, expenses: 1200, net: 800, saved: 300 });

  expect(await card("ingresos")).toHaveTextContent("2000,00 €");
  expect(await card("gastos")).toHaveTextContent("1200,00 €");
  expect(await card("sobra")).toHaveTextContent("800,00 €");
  expect(await card("sobra")).toHaveAttribute("data-tone", "pos");
  expect(await card("enviado a ahorro")).toHaveTextContent("300,00 €");
});

test("Negative month", async () => {
  open({ net: -150 });

  expect(await card("sobra")).toHaveTextContent("-150,00 €");
  expect(await card("sobra")).toHaveAttribute("data-tone", "neg");
});

// Requirement boundary not covered by a scenario: «sobra» is green when zero.
test("Break-even month", async () => {
  open({ net: 0 });

  expect(await card("sobra")).toHaveAttribute("data-tone", "pos");
});

test("No savings accounts", async () => {
  open({ balances: { total: 1500, main: 1500 } });

  expect(await card("saldo total ahora")).toHaveTextContent("1500,00 €");
  expect(await screen.findByText("día a día 1500,00 € · ahorro 0,00 €")).toBeInTheDocument();
});

test("Spending breakdown", async () => {
  open({
    by_category: [
      { id: 1, name: "Supermercado", icon: "🛒", color: "#4caf50", amount: 300 },
      { id: 2, name: "Restaurantes", icon: "🍽", color: "#ff9800", amount: 120 },
    ],
  });

  expect(await screen.findByRole("meter", { name: "🛒 Supermercado" })).toHaveAttribute("aria-valuenow", "100");
  expect(meter("🍽 Restaurantes")).toHaveAttribute("aria-valuenow", "40");
  // The bar takes the category's own color
  expect(meter("🛒 Supermercado").style.background).toBe("rgb(76, 175, 80)");
  expect(meter("🍽 Restaurantes").style.background).toBe("rgb(255, 152, 0)");
  expect(screen.getByText("en qué se va")).toBeInTheDocument();
});

test("No spending", async () => {
  open({ by_category: [] });

  expect(await screen.findByText("sin gastos este mes")).toBeInTheDocument();
});

test("History bars", async () => {
  open({}, [
    { month: "2026-08", income: 1500, expenses: 500 },
    { month: "2026-09", income: 2000, expenses: 1000 },
  ]);

  expect(await screen.findByRole("meter", { name: "2026-09 ingresos" })).toHaveAttribute("aria-valuenow", "70");
  expect(meter("2026-09 gastos")).toHaveAttribute("aria-valuenow", "35");
  expect(screen.getByText("09")).toBeInTheDocument();
  expect(screen.getByTitle("2026-09: 2000,00 € / 1000,00 €")).toBeInTheDocument();
  expect(screen.getByText("verde = ingresos · rojo = gastos")).toBeInTheDocument();
});

// Requirement detail not covered by a scenario: the largest value may be an expense.
test("Expenses can set the history scale", async () => {
  open({}, [{ month: "2026-09", income: 500, expenses: 1000 }]);

  expect(await screen.findByRole("meter", { name: "2026-09 ingresos" })).toHaveAttribute("aria-valuenow", "35");
  expect(meter("2026-09 gastos")).toHaveAttribute("aria-valuenow", "70");
});

// Current behavior not covered by a scenario: figures stay until the next month's arrive.
test("Previous figures stay while the next month loads", async () => {
  const september = pending();
  fakeApi({
    "GET /api/stats/summary": (req) =>
      req.query.get("month") === "2026-09" ? september.route() : ok(summary({ income: 2000 })),
    "GET /api/stats/history": ok([]),
  });
  renderScreen(<MyMonth />);
  expect(await card("ingresos")).toHaveTextContent("2000,00 €");

  await userEvent.click(screen.getByRole("button", { name: "mes anterior" }));

  expect(heading()).toHaveTextContent("septiembre de 2026");
  expect(await card("ingresos")).toHaveTextContent("2000,00 €");
  september.release(ok(summary({ month: "2026-09", income: 1500 })));
  await waitFor(async () => expect(await card("ingresos")).toHaveTextContent("1500,00 €"));
});

test("Month navigation does not reload history", async () => {
  const api = open({}, [{ month: "2026-09", income: 2000, expenses: 1000 }]);
  await screen.findByText("09");

  await userEvent.click(screen.getByRole("button", { name: "mes anterior" }));

  expect(await screen.findByText("09")).toBeInTheDocument();
  expect(api.to("GET", "/api/stats/history")).toHaveLength(1);
  expect(api.to("GET", "/api/stats/history")[0].query.get("months")).toBe("12");
});

// ---------- Load errors ----------

const alert = () => screen.getByRole("alert");

test("Summary unavailable", async () => {
  fakeApi({ "GET /api/stats/summary": fail(500), "GET /api/stats/history": ok([]) });
  renderScreen(<MyMonth />);

  await waitFor(() => expect(alert()).toHaveTextContent("Error 500"));
  expect(screen.queryByText("ingresos")).not.toBeInTheDocument();
});

test("History unavailable", async () => {
  fakeApi({ "GET /api/stats/summary": ok(summary({ income: 2000 })), "GET /api/stats/history": fail(503) });
  renderScreen(<MyMonth />);

  await waitFor(() => expect(alert()).toHaveTextContent("Error 503"));
  expect(await card("ingresos")).toHaveTextContent("2000,00 €");
});

test("Error cleared by changing the month", async () => {
  fakeApi({
    "GET /api/stats/summary": (req) =>
      req.query.get("month") === "2026-10" ? fail(500) : ok(summary({ month: "2026-09", income: 1500 })),
    "GET /api/stats/history": ok([]),
  });
  renderScreen(<MyMonth />);
  expect(await screen.findByText("Error 500")).toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: "mes anterior" }));

  expect(await card("ingresos")).toHaveTextContent("1500,00 €");
  expect(screen.queryByText("Error 500")).not.toBeInTheDocument();
});

// Requirement detail not covered by a scenario: with both failing, the summary's error is the one shown.
test("Summary error first when both fail", async () => {
  fakeApi({ "GET /api/stats/summary": fail(500), "GET /api/stats/history": fail(503) });
  renderScreen(<MyMonth />);

  await waitFor(() => expect(alert()).toHaveTextContent("Error 500"));
  expect(screen.queryByText("Error 503")).not.toBeInTheDocument();
});
