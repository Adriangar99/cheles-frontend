import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test, vi } from "vitest";
import Banks from "@/app/(app)/bancos/page";
import { fail, fakeApi, ok, pending } from "./fake-api";
import { stubLocation, today } from "./location";
import { renderScreen } from "./render";
import { account, connection } from "./screens";

type Connection = ReturnType<typeof connection>;
type Routes = Parameters<typeof fakeApi>[0];

const DAY = 86_400_000;

beforeEach(() => today("2026-10-15T12:00:00"));

const daysFromNow = (days: number) => new Date(Date.now() + days * DAY).toISOString();

function open(connections: Connection[], routes: Routes = {}, path = "/bancos") {
  const location = stubLocation(path);
  const api = fakeApi({ "GET /api/banks": ok({ connections, detached_accounts: [] }), ...routes });
  renderScreen(<Banks />);
  return { api, location };
}

const status = async (text: string) => screen.findByText(text);

test("Healthy connection", async () => {
  // Consent ends at any time of day; part of a day counts as a whole one.
  open([connection({ valid_until: daysFromNow(89.75), last_synced_at: "2026-10-23T17:00:00+00:00" })]);

  expect(await status("Al día · 90 días de permiso")).toHaveAttribute("data-tone", "pos");
  expect(screen.getByText("Leído el 23 oct, 19:00")).toBeInTheDocument();
});

test("Consent about to expire", async () => {
  open([connection({ valid_until: daysFromNow(10) })]);

  expect(await status("Caduca en 10 días")).toHaveAttribute("data-tone", "neg");
});

test("Expired connection", async () => {
  open([connection({ status: "expired", valid_until: daysFromNow(-1), last_error: `${"x".repeat(130)}` })]);

  expect(await status("Hay que reconectar")).toHaveAttribute("data-tone", "neg");
  expect(screen.getByText("x".repeat(120))).toBeInTheDocument();
});

test("Consent date already passed", async () => {
  open([connection({ status: "active", valid_until: daysFromNow(-3) })]);

  expect(await status("Hay que reconectar")).toHaveAttribute("data-tone", "neg");
  expect(screen.getByRole("button", { name: "Reconectar" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Leer ahora" })).not.toBeInTheDocument();
});

test("Never synced", async () => {
  open([connection({ valid_until: daysFromNow(90), last_synced_at: null })]);

  expect(await screen.findByText("Sin leer aún")).toBeInTheDocument();
});

test("Read now", async () => {
  const sync = pending();
  const { api } = open([connection({ id: 3, valid_until: daysFromNow(90) })], { "POST /api/banks/3/sync": sync.route });

  await userEvent.click(await screen.findByRole("button", { name: "Leer ahora" }));

  expect(screen.getByRole("button", { name: "Leyendo…" })).toBeDisabled();
  sync.release(ok({ ok: true }));
  expect(await screen.findByRole("button", { name: "Leer ahora" })).toBeEnabled();
  expect(api.to("GET", "/api/banks")).toHaveLength(2);
});

test("Reconnect", async () => {
  const { api, location } = open([connection({ bank: "BBVA", status: "expired" })], {
    "POST /api/banks/connect": ok({ url: "https://bbva.example/authorize" }),
  });

  await userEvent.click(await screen.findByRole("button", { name: "Reconectar" }));

  await waitFor(() => expect(location.href).toBe("https://bbva.example/authorize"));
  expect(api.to("POST", "/api/banks/connect")[0].body).toEqual({ name: "BBVA", country: "ES" });
});

test("Reconnect in the connection's country", async () => {
  const { api } = open([connection({ bank: "Revolut", country: "LT", status: "expired" })], {
    "POST /api/banks/connect": ok({ url: "https://revolut.example/authorize" }),
  });

  await userEvent.click(await screen.findByRole("button", { name: "Reconectar" }));

  await waitFor(() =>
    expect(api.to("POST", "/api/banks/connect")[0]?.body).toEqual({ name: "Revolut", country: "LT" }),
  );
});

test("Pick a bank", async () => {
  const { api, location } = open([], {
    "GET /api/banks/available": ok([
      { name: "BBVA", country: "ES" },
      { name: "Revolut", country: "LT" },
    ]),
    "POST /api/banks/connect": ok({ url: "https://revolut.example/authorize" }),
  });

  await userEvent.click(await screen.findByRole("button", { name: "Conectar un banco" }));
  const revolut = await screen.findByRole("listitem", { name: "Revolut" });
  await userEvent.click(within(revolut).getByRole("button", { name: "Conectar" }));

  await waitFor(() => expect(location.href).toBe("https://revolut.example/authorize"));
  expect(api.to("POST", "/api/banks/connect")[0].body).toEqual({ name: "Revolut", country: "LT" });
});

test("Back from a successful authorization", async () => {
  open([], {}, "/bancos?connected=1");

  expect(await screen.findByText("Banco conectado ✓")).toBeInTheDocument();
});

test("Back from a failed authorization", async () => {
  open([], {}, "/bancos?error=1");

  expect(await screen.findByText("No se pudo conectar el banco")).toBeInTheDocument();
});

test("Reloading after the result", async () => {
  const { location } = open([], {}, "/bancos?connected=1");

  expect(await screen.findByText("Banco conectado ✓")).toBeInTheDocument();
  expect(location.href).toBe("http://localhost/bancos");
});

test("Change role", async () => {
  const { api } = open(
    [connection({ valid_until: daysFromNow(90), accounts: [account({ id: 8, name: "Colchón", iban_tail: "9876" })] })],
    { "PATCH /api/accounts/8": ok(account({ id: 8, role: "savings" })) },
  );
  const row = await screen.findByRole("listitem", { name: "Colchón" });
  expect(within(row).getByText("·· 9876")).toBeInTheDocument();
  expect(within(row).getByText("1000,00 €")).toBeInTheDocument();

  await userEvent.selectOptions(within(row).getByRole("combobox", { name: "Para qué es esta cuenta" }), "Ahorro");

  expect(api.to("PATCH", "/api/accounts/8")[0].body).toEqual({ role: "savings" });
  await waitFor(() => expect(api.to("GET", "/api/banks")).toHaveLength(2));
});

test("Reprocess", async () => {
  const reprocess = pending();
  const { api } = open([], { "POST /api/reprocess": reprocess.route });
  expect(
    await screen.findByText("Recalcula categorías y transferencias; no cambia lo que has tocado a mano"),
  ).toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: "Hazlo ahora" }));

  expect(screen.getByRole("button", { name: "…" })).toBeDisabled();
  reprocess.release(ok({ processed: 3 }));
  expect(await screen.findByRole("button", { name: "Hazlo ahora" })).toBeEnabled();
  expect(api.to("GET", "/api/banks")).toHaveLength(2);
});

test("Bank list unavailable", async () => {
  open([], { "GET /api/banks/available": fail(502, { detail: "Enable Banking: no responde" }) });

  await userEvent.click(await screen.findByRole("button", { name: "Conectar un banco" }));

  expect(await screen.findByText("Enable Banking: no responde")).toBeInTheDocument();
});

test("Message cleared by the next action", async () => {
  const sync = pending();
  open([connection({ id: 3, valid_until: daysFromNow(90) })], {
    "POST /api/reprocess": fail(500, { detail: "algo falló" }),
    "POST /api/banks/3/sync": sync.route,
  });
  await userEvent.click(await screen.findByRole("button", { name: "Hazlo ahora" }));
  expect(await screen.findByText("algo falló")).toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: "Leer ahora" }));

  expect(screen.queryByText("algo falló")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Leyendo…" })).toBeInTheDocument();
  sync.release(ok({ ok: true }));
  await screen.findByRole("button", { name: "Leer ahora" });
});

test("Log out", async () => {
  const { api, location } = open([], { "POST /api/auth/logout": ok({ ok: true }) });

  await userEvent.click(await screen.findByRole("button", { name: "Salir" }));

  await waitFor(() => expect(location.href).toBe("/login"));
  expect(api.to("POST", "/api/auth/logout")).toHaveLength(1);
});

// Requirement details not covered by a scenario.

test("Read now stays busy until the screen has reloaded", async () => {
  const reload = pending();
  const healthy = connection({ id: 3, valid_until: daysFromNow(90) });
  let lists = 0;
  open([], {
    "GET /api/banks": () => {
      lists += 1;
      return lists === 1 ? ok({ connections: [healthy], detached_accounts: [] }) : reload.route();
    },
    "POST /api/banks/3/sync": ok({ ok: true }),
  });

  await userEvent.click(await screen.findByRole("button", { name: "Leer ahora" }));

  await waitFor(() => expect(lists).toBe(2));
  expect(screen.getByRole("button", { name: "Leyendo…" })).toBeDisabled();
  reload.release(ok({ connections: [healthy], detached_accounts: [] }));
  expect(await screen.findByRole("button", { name: "Leer ahora" })).toBeEnabled();
});

test("Only the connection being read shows it", async () => {
  const sync = pending();
  open(
    [
      connection({ id: 3, bank: "BBVA", valid_until: daysFromNow(90) }),
      connection({ id: 4, bank: "Revolut", valid_until: daysFromNow(90) }),
    ],
    { "POST /api/banks/3/sync": sync.route },
  );
  const [bbva] = await screen.findAllByRole("button", { name: "Leer ahora" });

  await userEvent.click(bbva);

  expect(screen.getAllByRole("button", { name: "Leer ahora" })).toHaveLength(1);
  expect(screen.getByRole("button", { name: "Leyendo…" })).toBeInTheDocument();
  sync.release(ok({ ok: true }));
  await waitFor(() => expect(screen.getAllByRole("button", { name: "Leer ahora" })).toHaveLength(2));
});

test("Reprocessing and changing a role clear the message", async () => {
  const reprocess = pending();
  const setRole = pending();
  open(
    [connection({ valid_until: daysFromNow(90), accounts: [account({ id: 8 })] })],
    {
      "POST /api/reprocess": reprocess.route,
      "PATCH /api/accounts/8": setRole.route,
    },
    "/bancos?error=1",
  );
  expect(await screen.findByText("No se pudo conectar el banco")).toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: "Hazlo ahora" }));
  expect(screen.queryByText("No se pudo conectar el banco")).not.toBeInTheDocument();
  reprocess.release(fail(500, { detail: "algo falló" }));
  expect(await screen.findByText("algo falló")).toBeInTheDocument();

  await userEvent.selectOptions(screen.getByRole("combobox", { name: "Para qué es esta cuenta" }), "Ahorro");
  expect(screen.queryByText("algo falló")).not.toBeInTheDocument();
  setRole.release(ok(account({ id: 8, role: "savings" })));
});

test("Opening the bank list keeps the message", async () => {
  const banks = pending();
  open([], { "GET /api/banks/available": banks.route }, "/bancos?connected=1");
  expect(await screen.findByText("Banco conectado ✓")).toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: "Conectar un banco" }));

  expect(screen.getByText("Banco conectado ✓")).toBeInTheDocument();
  banks.release(ok([]));
});

test("Morning read times keep the leading zero", async () => {
  open([connection({ valid_until: daysFromNow(90), last_synced_at: "2026-10-23T07:05:00+00:00" })]);

  expect(await screen.findByText("Leído el 23 oct, 09:05")).toBeInTheDocument();
});

// ---------- Action errors (loading, connecting, logging out) ----------

test("Connections unavailable", async () => {
  open([], { "GET /api/banks": fail(500) });

  expect(await screen.findByText("Error 500")).toBeInTheDocument();
});

test("Connecting fails", async () => {
  const { location } = open([], {
    "GET /api/banks/available": ok([{ name: "Revolut", country: "LT" }]),
    "POST /api/banks/connect": fail(503, { detail: "Enable Banking no está configurado" }),
  });
  await userEvent.click(await screen.findByRole("button", { name: "Conectar un banco" }));

  await userEvent.click(await screen.findByRole("button", { name: "Conectar" }));

  expect(await screen.findByText("Enable Banking no está configurado")).toBeInTheDocument();
  expect(location.href).toBe("http://localhost/bancos");
});

test("Logout fails", async () => {
  const { location } = open([], { "POST /api/auth/logout": fail(500) });

  await userEvent.click(await screen.findByRole("button", { name: "Salir" }));

  expect(await screen.findByText("Error 500")).toBeInTheDocument();
  expect(location.href).toBe("http://localhost/bancos");
});

// ---------- Accounts without a bank ----------

const colchon = account({ id: 9, name: "Colchón", iban_tail: "9876", balance: 500, connection_id: null });

function openWithDetached(routes: Routes = {}) {
  return open([], { "GET /api/banks": ok({ connections: [], detached_accounts: [colchon] }), ...routes });
}

test("Detached account", async () => {
  openWithDetached();

  const section = await screen.findByRole("region", { name: "Cuentas sin banco" });
  const row = within(section).getByRole("listitem", { name: "Colchón" });
  expect(within(row).getByText("·· 9876")).toBeInTheDocument();
  expect(within(row).getByText("500,00 €")).toBeInTheDocument();
  expect(within(row).getByRole("combobox", { name: "Para qué es esta cuenta" })).toHaveValue("main");
});

test("Role of a detached account", async () => {
  const { api } = openWithDetached({ "PATCH /api/accounts/9": ok(account({ id: 9, role: "savings" })) });
  const row = await screen.findByRole("listitem", { name: "Colchón" });

  await userEvent.selectOptions(within(row).getByRole("combobox", { name: "Para qué es esta cuenta" }), "Ahorro");

  expect(api.to("PATCH", "/api/accounts/9")[0].body).toEqual({ role: "savings" });
  await waitFor(() => expect(api.to("GET", "/api/banks")).toHaveLength(2));
});

test("No detached accounts", async () => {
  open([connection({ valid_until: daysFromNow(90), accounts: [account()] })]);

  await screen.findByText("Nómina");
  expect(screen.queryByRole("heading", { name: "Cuentas sin banco" })).not.toBeInTheDocument();
});

// ---------- Removing a connection ----------

const QUESTION = '¿Quitar BBVA? Sus cuentas y movimientos se quedan en "Cuentas sin banco".';

test("Remove a connection", async () => {
  const confirm = vi.fn(() => true);
  vi.stubGlobal("confirm", confirm);
  const { api } = open([connection({ id: 3, bank: "BBVA", valid_until: daysFromNow(90) })], {
    "DELETE /api/banks/3": { status: 204 },
  });

  await userEvent.click(await screen.findByRole("button", { name: "Quitar" }));

  expect(confirm).toHaveBeenCalledWith(QUESTION);
  await waitFor(() => expect(api.to("GET", "/api/banks")).toHaveLength(2));
  expect(api.to("DELETE", "/api/banks/3")).toHaveLength(1);
});

test("Cancel removing", async () => {
  vi.stubGlobal(
    "confirm",
    vi.fn(() => false),
  );
  const { api } = open([connection({ id: 3, bank: "BBVA", valid_until: daysFromNow(90) })]);

  await userEvent.click(await screen.findByRole("button", { name: "Quitar" }));

  expect(api.requests.filter((r) => r.method === "DELETE")).toEqual([]);
});

test("Removing fails", async () => {
  vi.stubGlobal(
    "confirm",
    vi.fn(() => true),
  );
  open([connection({ id: 3, bank: "BBVA", valid_until: daysFromNow(90) })], { "DELETE /api/banks/3": fail(500) });

  await userEvent.click(await screen.findByRole("button", { name: "Quitar" }));

  expect(await screen.findByText("Error 500")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "BBVA" })).toBeInTheDocument();
});

const summary = () => screen.findByRole("region", { name: "Resumen" });

test("A bank needs attention", async () => {
  open([
    connection({
      accounts: [
        account({ id: 1, name: "Nómina", role: "main", balance: 1000 }),
        account({ id: 2, name: "Colchón", role: "savings", balance: 500 }),
      ],
    }),
    connection({
      id: 2,
      bank: "ING",
      status: "expired",
      valid_until: daysFromNow(-1),
      accounts: [account({ id: 3, name: "Naranja", role: "excluded", balance: 12, connection_id: 2 })],
    }),
  ]);

  const box = await summary();
  expect(within(box).getByText("1500,00 €")).toBeInTheDocument();
  expect(within(box).getByText("en 2 cuentas")).toBeInTheDocument();
  expect(within(box).getByText("1 banco necesita atención")).toHaveAttribute("data-tone", "neg");
});

// Requirement detail: expiring soon also needs attention, several banks are counted, other currencies are not added
test("Several banks need attention", async () => {
  open([
    connection({ valid_until: daysFromNow(10), accounts: [account({ balance: 100 })] }),
    connection({
      id: 2,
      status: "expired",
      accounts: [account({ id: 2, balance: 50, currency: "USD", connection_id: 2 })],
    }),
  ]);

  const box = await summary();
  expect(within(box).getByText("100,00 €")).toBeInTheDocument();
  expect(within(box).getByText("en 1 cuenta")).toBeInTheDocument();
  expect(within(box).getByText("2 bancos necesitan atención")).toHaveAttribute("data-tone", "neg");
});

test("Every bank up to date", async () => {
  open([connection({ valid_until: daysFromNow(90), accounts: [account()] })]);

  expect(within(await summary()).getByText("Todos los bancos al día")).toHaveAttribute("data-tone", "pos");
});

test("Nothing connected yet", async () => {
  const { api } = open([]);

  await waitFor(() => expect(api.to("GET", "/api/banks")).toHaveLength(1));
  await new Promise((resolve) => setTimeout(resolve, 50));
  expect(screen.queryByRole("region", { name: "Resumen" })).not.toBeInTheDocument();
});
