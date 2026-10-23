import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test } from "vitest";
import MyMonth from "@/app/(app)/page";
import { fakeApi, ok } from "./fake-api";
import { today } from "./location";
import { summary } from "./screens";

type Summary = ReturnType<typeof summary>;

beforeEach(() => today("2026-10-15T12:00:00"));

function open(month: Partial<Summary> = {}, history: unknown[] = []) {
  const api = fakeApi({
    "GET /api/stats/summary": (req) => ok(summary({ month: req.query.get("month") ?? "", ...month })),
    "GET /api/stats/history": ok(history),
  });
  render(<MyMonth />);
  return api;
}

const card = async (label: string) => (await screen.findByText(label)).nextElementSibling as HTMLElement;
const heading = () => screen.getByRole("heading", { level: 1 });
const inline = (el: Element) => {
  const { width, height, background } = (el as HTMLElement).style;
  return { width, height, background };
};

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
  expect(await card("sobra")).toHaveClass("pos");
  expect(await card("enviado a ahorro")).toHaveTextContent("300,00 €");
});

test("Negative month", async () => {
  open({ net: -150 });

  expect(await card("sobra")).toHaveTextContent("-150,00 €");
  expect(await card("sobra")).toHaveClass("neg");
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

  const bar = async (label: string) =>
    (await screen.findByText(label)).closest(".row")?.querySelector(".bar span") as HTMLElement;
  expect(inline(await bar("🛒 Supermercado"))).toMatchObject({ width: "100%", background: "rgb(76, 175, 80)" });
  expect(inline(await bar("🍽 Restaurantes"))).toMatchObject({ width: "40%", background: "rgb(255, 152, 0)" });
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

  const september = (await screen.findByText("09")).closest(".col") as HTMLElement;
  const [income, expenses] = september.querySelectorAll(".b");
  expect(inline(income)).toMatchObject({ height: "70px", background: "var(--accent)" });
  expect(inline(expenses)).toMatchObject({ height: "35px", background: "var(--danger)" });
  expect(september.title.replace(/\s/g, " ")).toBe("2026-09: 2000,00 € / 1000,00 €");
  expect(screen.getByText("verde = ingresos · rojo = gastos")).toBeInTheDocument();
});

test("Month navigation does not reload history", async () => {
  const api = open({}, [{ month: "2026-09", income: 2000, expenses: 1000 }]);
  await screen.findByText("09");

  await userEvent.click(screen.getByRole("button", { name: "mes anterior" }));

  expect(await screen.findByText("09")).toBeInTheDocument();
  expect(api.to("GET", "/api/stats/history")).toHaveLength(1);
  expect(api.to("GET", "/api/stats/history")[0].query.get("months")).toBe("12");
});
