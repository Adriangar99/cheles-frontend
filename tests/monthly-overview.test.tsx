import { screen, waitFor, within } from "@testing-library/react";
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

  expect(heading()).toHaveTextContent("Octubre de 2026");
  expect(screen.getByRole("button", { name: "Mes siguiente" })).toBeDisabled();
  await card("Ingresos");
  expect(api.to("GET", "/api/stats/summary")[0].query.get("month")).toBe("2026-10");
});

test("Go to the previous month", async () => {
  const api = open();

  await userEvent.click(screen.getByRole("button", { name: "Mes anterior" }));

  expect(heading()).toHaveTextContent("Septiembre de 2026");
  expect(screen.getByRole("button", { name: "Mes siguiente" })).toBeEnabled();
  expect(api.to("GET", "/api/stats/summary").at(-1)?.query.get("month")).toBe("2026-09");
});

test("Year boundary", async () => {
  today("2026-01-15T12:00:00");
  open();

  await userEvent.click(screen.getByRole("button", { name: "Mes anterior" }));

  expect(heading()).toHaveTextContent("Diciembre de 2025");
});

test("Positive month", async () => {
  open({ income: 2000, expenses: 1200, net: 800, saved: 300 });

  expect(await card("Ingresos")).toHaveTextContent("2000,00 €");
  expect(await card("Gastos")).toHaveTextContent("1200,00 €");
  expect(await card("Sobra")).toHaveTextContent("800,00 €");
  expect(await card("Sobra")).toHaveAttribute("data-tone", "pos");
  expect(await card("Enviado a ahorro")).toHaveTextContent("300,00 €");
});

test("Negative month", async () => {
  open({ net: -150 });

  expect(await card("Sobra")).toHaveTextContent("-150,00 €");
  expect(await card("Sobra")).toHaveAttribute("data-tone", "neg");
});

// Requirement boundary not covered by a scenario: «sobra» is green when zero.
test("Break-even month", async () => {
  open({ net: 0 });

  expect(await card("Sobra")).toHaveAttribute("data-tone", "pos");
});

test("No savings accounts", async () => {
  open({ balances: { total: 1500, main: 1500 } });

  expect(await card("Saldo total ahora")).toHaveTextContent("1500,00 €");
  expect(await screen.findByText("Día a día 1500,00 € · ahorro 0,00 €")).toBeInTheDocument();
});

test("Spending rose", async () => {
  open({ income: 2000, expenses: 1200, net: 800 }, [{ month: "2026-09", income: 2000, expenses: 1000 }]);

  const spendingRose = await screen.findByText("200,00 € más que en septiembre");
  expect(spendingRose).toHaveAttribute("data-tone", "neg");
  expect((await card("Gastos"))?.nextElementSibling).toBe(spendingRose);
  expect(screen.getByText("200,00 € menos que en septiembre")).toHaveAttribute("data-tone", "neg");
  expect((await card("Ingresos"))?.nextElementSibling).toHaveTextContent("Igual que en septiembre");
  expect(screen.getByText("Igual que en septiembre")).not.toHaveAttribute("data-tone");
});

// Requirement detail: a rise in income or in what is left is good news
test("Income rose", async () => {
  open({ income: 2500, expenses: 1000, net: 1500 }, [{ month: "2026-09", income: 2000, expenses: 1000 }]);

  expect((await card("Ingresos"))?.nextElementSibling).toHaveAttribute("data-tone", "pos");
  expect((await card("Sobra"))?.nextElementSibling).toHaveTextContent("500,00 € más que en septiembre");
  expect((await card("Sobra"))?.nextElementSibling).toHaveAttribute("data-tone", "pos");
});

test("No previous month in the history", async () => {
  open({ income: 2000 }, [{ month: "2026-08", income: 1500, expenses: 500 }]);

  await card("Ingresos");
  expect(screen.queryByText(/que en (agosto|septiembre)/)).not.toBeInTheDocument();
});

// A legend line of «la nómina repartida», named by its category
const share = (name: string) => screen.getByRole("listitem", { name });

test("Spending breakdown", async () => {
  open({
    income: 2000,
    expenses: 420,
    by_category: [
      { id: 1, name: "Supermercado", icon: "🛒", color: "#4caf50", amount: 300 },
      { id: 2, name: "Restaurantes", icon: "🍽", color: "#ff9800", amount: 120 },
    ],
  });

  expect(await screen.findByRole("meter", { name: "🛒 Supermercado" })).toHaveAttribute("aria-valuenow", "15");
  expect(meter("🍽 Restaurantes")).toHaveAttribute("aria-valuenow", "6");
  expect(meter("Sobra")).toHaveAttribute("aria-valuenow", "79");
  // Each segment takes the category's own color
  expect(meter("🛒 Supermercado").style.background).toBe("rgb(76, 175, 80)");
  expect(meter("🍽 Restaurantes").style.background).toBe("rgb(255, 152, 0)");
  expect(share("🛒 Supermercado")).toHaveTextContent("300,00 €15 %");
  expect(share("🍽 Restaurantes")).toHaveTextContent("120,00 €6 %");
  expect(share("Sobra")).toHaveTextContent("1580,00 €79 %");
  expect(screen.getByRole("heading", { name: "La nómina repartida" })).toBeInTheDocument();
});

test("Hover a long category name", async () => {
  open({
    income: 2000,
    expenses: 90,
    by_category: [{ id: 9, name: "Hogar, muebles y decoración", icon: "🛋", color: "#795548", amount: 90 }],
  });

  const name = "🛋 Hogar, muebles y decoración";

  expect(within(await screen.findByRole("listitem", { name })).getByText(name)).toHaveAttribute("title", name);
});

test("Spending over income", async () => {
  open({
    income: 1000,
    expenses: 1250,
    by_category: [{ id: 1, name: "Supermercado", icon: "🛒", color: "#4caf50", amount: 1250 }],
  });

  expect(await screen.findByRole("meter", { name: "🛒 Supermercado" })).toHaveAttribute("aria-valuenow", "100");
  expect(meter("Sobra")).toHaveAttribute("aria-valuenow", "0");
  expect(share("Sobra")).toHaveTextContent("0,00 €0 %");
});

test("No spending", async () => {
  open({ by_category: [] });

  expect(await screen.findByText("Sin gastos este mes")).toBeInTheDocument();
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
  expect(screen.getByText("Verde = ingresos · rojo = gastos")).toBeInTheDocument();
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
  expect(await card("Ingresos")).toHaveTextContent("2000,00 €");

  await userEvent.click(screen.getByRole("button", { name: "Mes anterior" }));

  expect(heading()).toHaveTextContent("Septiembre de 2026");
  expect(await card("Ingresos")).toHaveTextContent("2000,00 €");
  september.release(ok(summary({ month: "2026-09", income: 1500 })));
  await waitFor(async () => expect(await card("Ingresos")).toHaveTextContent("1500,00 €"));
});

test("Month navigation does not reload history", async () => {
  const api = open({}, [{ month: "2026-09", income: 2000, expenses: 1000 }]);
  await screen.findByText("09");

  await userEvent.click(screen.getByRole("button", { name: "Mes anterior" }));

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
  expect(screen.queryByText("Ingresos")).not.toBeInTheDocument();
});

test("History unavailable", async () => {
  fakeApi({ "GET /api/stats/summary": ok(summary({ income: 2000 })), "GET /api/stats/history": fail(503) });
  renderScreen(<MyMonth />);

  await waitFor(() => expect(alert()).toHaveTextContent("Error 503"));
  expect(await card("Ingresos")).toHaveTextContent("2000,00 €");
});

test("Error cleared by changing the month", async () => {
  fakeApi({
    "GET /api/stats/summary": (req) =>
      req.query.get("month") === "2026-10" ? fail(500) : ok(summary({ month: "2026-09", income: 1500 })),
    "GET /api/stats/history": ok([]),
  });
  renderScreen(<MyMonth />);
  expect(await screen.findByText("Error 500")).toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: "Mes anterior" }));

  expect(await card("Ingresos")).toHaveTextContent("1500,00 €");
  expect(screen.queryByText("Error 500")).not.toBeInTheDocument();
});

// Requirement detail not covered by a scenario: with both failing, the summary's error is the one shown.
test("Summary error first when both fail", async () => {
  fakeApi({ "GET /api/stats/summary": fail(500), "GET /api/stats/history": fail(503) });
  renderScreen(<MyMonth />);

  await waitFor(() => expect(alert()).toHaveTextContent("Error 500"));
  expect(screen.queryByText("Error 503")).not.toBeInTheDocument();
});

// ---------- Other currencies warning ----------

test("Dollars left out", async () => {
  open({ other_currencies: ["USD"] });

  expect(await screen.findByRole("note")).toHaveTextContent("No se cuentan importes en USD");
});

test("Only euros", async () => {
  open({ other_currencies: [] });

  await card("Ingresos");
  expect(screen.queryByRole("note")).not.toBeInTheDocument();
});

// Requirement detail not covered by a scenario: several currencies are joined by commas.
test("Several currencies left out", async () => {
  open({ other_currencies: ["GBP", "USD"] });

  expect(await screen.findByRole("note")).toHaveTextContent("No se cuentan importes en GBP, USD");
});
