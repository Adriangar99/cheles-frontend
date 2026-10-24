import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test } from "vitest";
import Movements from "@/app/(app)/movimientos/page";
import { type ApiRequest, fail, fakeApi, ok } from "./fake-api";
import { today } from "./location";
import { renderScreen } from "./render";
import { category, tx } from "./screens";

type Tx = ReturnType<typeof tx>;

const supermercado = category({ id: 1, name: "Supermercado", kind: "expense", icon: "🛒" });
const restaurantes = category({ id: 2, name: "Restaurantes", kind: "expense", icon: "🍽" });
const nomina = category({ id: 3, name: "Nómina", kind: "income", icon: "💶" });

beforeEach(() => today("2026-10-15T12:00:00"));

// The fake API keeps the transactions: a PATCH changes them and the next list request shows the change.
function open(stored: Tx[]) {
  const list = (req: ApiRequest) => {
    const q = req.query.get("q")?.toLowerCase();
    return ok(stored.filter((t) => !q || `${t.counterparty} ${t.description}`.toLowerCase().includes(q)));
  };
  const patches = Object.fromEntries(
    stored.map((t) => [
      `PATCH /api/transactions/${t.id}`,
      (req: ApiRequest) => {
        const changes = req.body as Partial<Tx>;
        Object.assign(t, changes, changes.category_id ? { category_manual: true } : {});
        return ok(t);
      },
    ]),
  );
  const api = fakeApi({
    "GET /api/transactions": list,
    "GET /api/categories": ok([supermercado, restaurantes, nomina]),
    ...patches,
  });
  renderScreen(<Movements />);
  return api;
}

const rowOf = async (text: string) => (await screen.findByText(text)).closest(".row") as HTMLElement;
const optionsOf = (row: HTMLElement) =>
  within(row)
    .getAllByRole("option")
    .map((o) => o.textContent);

test("Search", async () => {
  const api = open([tx({ id: 1, counterparty: "MERCADONA" }), tx({ id: 2, counterparty: "BAR PEPE" })]);
  await screen.findByText("BAR PEPE");

  await userEvent.type(screen.getByPlaceholderText("buscar…"), "merca");

  await waitFor(() => expect(screen.queryByText("BAR PEPE")).not.toBeInTheDocument());
  expect(screen.getByText("MERCADONA")).toBeInTheDocument();
  expect(screen.getByText("1 movimientos")).toBeInTheDocument();
  const last = api.to("GET", "/api/transactions").at(-1);
  expect(Object.fromEntries(last?.query ?? [])).toEqual({ month: "2026-10", limit: "500", q: "merca" });
});

test("Typing quickly", async () => {
  const api = open([tx()]);
  await screen.findByText("MERCADONA");

  await userEvent.type(screen.getByPlaceholderText("buscar…"), "merca");
  await new Promise((resolve) => setTimeout(resolve, 400));

  const searches = api.to("GET", "/api/transactions").filter((r) => r.query.has("q"));
  expect(searches.map((r) => r.query.get("q"))).toEqual(["merca"]);
});

test("Pending debit", async () => {
  open([tx({ counterparty: "MERCADONA", amount: -12.5, status: "PDNG", date: "2026-10-03", account: "Nómina" })]);

  const row = await rowOf("MERCADONA");
  expect(within(row).getByText("3 oct · Nómina · pendiente")).toBeInTheDocument();
  expect(within(row).getByText("-12,50 €")).not.toHaveClass("pos");
});

test("Empty month", async () => {
  const api = open([]);

  await waitFor(() => expect(api.to("GET", "/api/transactions")).toHaveLength(1));
  expect(screen.getByText("0 movimientos")).toBeInTheDocument();
  expect(screen.getByText("nada por aquí")).toBeInTheDocument();
});

test("Change category", async () => {
  const debit = tx({ id: 7, category_id: 1 });
  const api = open([debit]);
  const row = await rowOf("MERCADONA");
  await waitFor(() => expect(optionsOf(row)).toContain("🍽 Restaurantes"));

  await userEvent.selectOptions(within(row).getByRole("combobox", { name: "categoría" }), "🍽 Restaurantes");

  expect(api.to("PATCH", "/api/transactions/7")[0].body).toEqual({ category_id: 2 });
  await waitFor(() => expect(api.to("GET", "/api/transactions")).toHaveLength(2));
  expect(within(await rowOf("MERCADONA")).getByRole("combobox")).toHaveDisplayValue("🍽 Restaurantes");
});

test("Categories offered for a credit", async () => {
  open([tx({ id: 1, counterparty: "EMPRESA SL", amount: 2000, category_id: 1 })]);
  const row = await rowOf("EMPRESA SL");

  await waitFor(() => expect(optionsOf(row)).toEqual(["💶 Nómina", "🛒 Supermercado"]));
  expect(within(row).getByText("2000,00 €")).toHaveClass("pos");
});

test("Mark as transfer", async () => {
  const api = open([tx({ id: 4, kind: "normal" })]);

  await userEvent.click(within(await rowOf("MERCADONA")).getByRole("button", { name: "⇄" }));

  expect(api.to("PATCH", "/api/transactions/4")[0].body).toEqual({ kind: "transfer" });
  const quitar = await screen.findByRole("button", { name: "⇄ entre mis cuentas (quitar)" });
  const row = quitar.closest(".row") as HTMLElement;
  expect(row.style.opacity).toBe("0.55");
  expect(within(row).queryByRole("combobox")).not.toBeInTheDocument();
});

test("Unmark a transfer", async () => {
  const api = open([tx({ id: 5, kind: "transfer" })]);

  await userEvent.click(await screen.findByRole("button", { name: "⇄ entre mis cuentas (quitar)" }));

  expect(api.to("PATCH", "/api/transactions/5")[0].body).toEqual({ kind: "normal" });
  const row = await rowOf("MERCADONA");
  expect(await within(row).findByRole("combobox", { name: "categoría" })).toBeInTheDocument();
  expect(row.style.opacity).toBe("");
});

// ---------- Load and edit errors ----------

const belowSearch = () => screen.getByPlaceholderText("buscar…").nextElementSibling;

test("List unavailable", async () => {
  fakeApi({ "GET /api/transactions": fail(500), "GET /api/categories": ok([]) });
  renderScreen(<Movements />);

  await waitFor(() => expect(belowSearch()).toHaveTextContent("Error 500"));
});

test("Change rejected", async () => {
  const api = fakeApi({
    "GET /api/transactions": ok([tx({ id: 7, category_id: 1 })]),
    "GET /api/categories": ok([supermercado, restaurantes]),
    "PATCH /api/transactions/7": fail(400, { detail: "Categoría inexistente" }),
  });
  renderScreen(<Movements />);
  const row = await rowOf("MERCADONA");
  await waitFor(() => expect(optionsOf(row)).toContain("🍽 Restaurantes"));

  await userEvent.selectOptions(within(row).getByRole("combobox", { name: "categoría" }), "🍽 Restaurantes");

  await waitFor(() => expect(belowSearch()).toHaveTextContent("Categoría inexistente"));
  expect(api.to("GET", "/api/transactions")).toHaveLength(1);
});

test("Error cleared by the next edit", async () => {
  let patches = 0;
  fakeApi({
    "GET /api/transactions": ok([tx({ id: 7, category_id: 1 })]),
    "GET /api/categories": ok([supermercado, restaurantes]),
    "PATCH /api/transactions/7": () => {
      patches += 1;
      return patches === 1 ? fail(400, { detail: "Categoría inexistente" }) : ok({});
    },
  });
  renderScreen(<Movements />);
  const row = await rowOf("MERCADONA");
  await waitFor(() => expect(optionsOf(row)).toContain("🍽 Restaurantes"));
  await userEvent.selectOptions(within(row).getByRole("combobox", { name: "categoría" }), "🍽 Restaurantes");
  expect(await screen.findByText("Categoría inexistente")).toBeInTheDocument();

  await userEvent.click(within(await rowOf("MERCADONA")).getByRole("button", { name: "⇄" }));

  await waitFor(() => expect(screen.queryByText("Categoría inexistente")).not.toBeInTheDocument());
});
