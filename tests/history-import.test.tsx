import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test } from "vitest";
import Banks from "@/app/(app)/bancos/page";
import { type ApiRequest, fail, fakeApi, ok } from "./fake-api";
import { stubLocation, today } from "./location";
import { renderScreen } from "./render";
import { account, connection } from "./screens";

type Accounts = Record<string, number | "new" | null>;
type Routes = Parameters<typeof fakeApi>[0];

beforeEach(() => today("2026-10-15T12:00:00"));

const CSV = "Id,Fecha,Categoria,Cantidad,Moneda,Nota,Cuenta\r\n1,25/10/2026,Gasolina,-47.80,EUR,,Revolut";
const NOMINA = 7;

// The API's preview for two wallets: onto Nómina the bank already has rows since July 2026 (all of Revolut's are older)
function previewFor(req: ApiRequest) {
  const { accounts } = req.body as { accounts: Accounts };
  const wallet = (name: string, rows: number, adjustments = 0, skippedOnBank = 120) => {
    const target = accounts[name] ?? null;
    const onBank = target === NOMINA;
    return {
      name,
      rows,
      first_date: "2025-05-05",
      last_date: "2026-10-25",
      target,
      to_import: target === null ? 0 : onBank ? rows - adjustments - skippedOnBank : rows - adjustments,
      skipped: onBank ? skippedOnBank : 0,
      bank_since: onBank ? "2026-07-01" : null,
      already_imported: 0,
      adjustments,
    };
  };
  return ok({
    wallets: [wallet("Cuenta Principal", 422, 2), wallet("Revolut", 40, 0, 0)],
    unmatched_categories: [
      { name: "Ahorro", rows: 12 },
      { name: "Invertir", rows: 3 },
    ],
  });
}

function open(routes: Routes = {}) {
  stubLocation("/bancos");
  const banks = ok({
    connections: [connection({ accounts: [account({ id: NOMINA, name: "Nómina", role: "main" })] })],
    detached_accounts: [],
  });
  const api = fakeApi({ "GET /api/banks": banks, "POST /api/imports/preview": previewFor, ...routes });
  renderScreen(<Banks />);
  return api;
}

const choose = async () =>
  userEvent.upload(await screen.findByLabelText("Elegir fichero CSV"), new File([CSV], "moneylover.csv"));
const walletRow = (name: string) => screen.findByRole("listitem", { name });
const previews = (api: ReturnType<typeof fakeApi>) =>
  api.to("POST", "/api/imports/preview").map((r) => r.body as { file: string; accounts: Accounts });
const target = async (name: string, option: string) =>
  userEvent.selectOptions(within(await walletRow(name)).getByRole("combobox", { name: "Dónde van" }), option);

test("Choose a file", async () => {
  const api = open();

  await choose();

  expect(await walletRow("Cuenta Principal")).toHaveTextContent("422 movimientos · 5 may 2025 – 25 oct 2026");
  expect(await walletRow("Revolut")).toBeInTheDocument();
  await waitFor(() => expect(previews(api).at(-1)?.accounts).toEqual({ "Cuenta Principal": "new", Revolut: "new" }));
  expect(atob(previews(api)[0].file)).toBe(CSV);
});

test("Unrecognized file", async () => {
  open({
    "POST /api/imports/preview": fail(422, { detail: "No reconozco este fichero: falta la columna Cuenta" }),
  });

  await choose();

  expect(await screen.findByText("No reconozco este fichero: falta la columna Cuenta")).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: /^Importar/ })).not.toBeInTheDocument();
});

test("Wallet onto a bank account", async () => {
  const api = open();
  await choose();

  await target("Cuenta Principal", "Nómina");
  await target("Revolut", "Nómina");

  const wallet = await walletRow("Cuenta Principal");
  await waitFor(() => expect(within(wallet).getByText("Entran 300")).toBeInTheDocument());
  expect(within(wallet).getByText("120 ya los trajo el banco (desde 1 jul 2026)")).toBeInTheDocument();
  expect(previews(api).at(-1)?.accounts).toEqual({ "Cuenta Principal": NOMINA, Revolut: NOMINA });
  // Every Revolut row is older than the bank's: nothing skipped, no line about it
  expect(within(await walletRow("Revolut")).queryByText(/ya los trajo el banco/)).not.toBeInTheDocument();
});

test("Balance adjustments", async () => {
  open();
  await choose();

  expect(
    within(await walletRow("Cuenta Principal")).getByText("2 ajustes de saldo no se importan"),
  ).toBeInTheDocument();
  expect(within(await walletRow("Revolut")).queryByText(/ajustes de saldo/)).not.toBeInTheDocument();
});

test("Not imported", async () => {
  const api = open();
  await choose();

  await target("Revolut", "No importar");

  await waitFor(() => expect(previews(api).at(-1)?.accounts).toEqual({ "Cuenta Principal": "new", Revolut: null }));
  expect(within(await walletRow("Revolut")).getByText("No se importa")).toBeInTheDocument();
});

test("Categories without equivalent", async () => {
  open();
  await choose();

  expect(await screen.findByText("Sin equivalencia, irán por reglas: Ahorro (12), Invertir (3)")).toBeInTheDocument();
});

test("Import", async () => {
  const api = open({ "POST /api/imports": ok({ imported: 460, skipped: 0, already_imported: 0, adjustments: 2 }) });
  await choose();
  await walletRow("Revolut");

  await userEvent.click(await screen.findByRole("button", { name: "Importar 460 movimientos" }));

  expect(await screen.findByText("460 movimientos importados ✓")).toBeInTheDocument();
  expect((api.to("POST", "/api/imports")[0].body as { accounts: Accounts }).accounts).toEqual({
    "Cuenta Principal": "new",
    Revolut: "new",
  });
  await waitFor(() => expect(api.to("GET", "/api/banks")).toHaveLength(2));
  expect(screen.queryByRole("listitem", { name: "Revolut" })).not.toBeInTheDocument();
});

test("Nothing to import", async () => {
  open();
  await choose();

  await target("Cuenta Principal", "No importar");
  await target("Revolut", "No importar");

  expect(await screen.findByRole("button", { name: "Importar 0 movimientos" })).toBeDisabled();
});

test("Cancel", async () => {
  const api = open();
  await choose();
  await walletRow("Revolut");

  await userEvent.click(screen.getByRole("button", { name: "Cancelar" }));

  expect(screen.queryByRole("listitem", { name: "Revolut" })).not.toBeInTheDocument();
  expect(api.to("POST", "/api/imports")).toHaveLength(0);
  expect(screen.getByLabelText("Elegir fichero CSV")).toBeInTheDocument();
});

test("Import fails", async () => {
  open({ "POST /api/imports": fail(500) });
  await choose();
  await walletRow("Revolut");

  await userEvent.click(await screen.findByRole("button", { name: /^Importar \d+ movimientos$/ }));

  expect(await screen.findByText("Error 500")).toBeInTheDocument();
  expect(screen.getByRole("listitem", { name: "Revolut" })).toBeInTheDocument();
});
