import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, expect, test } from "vitest";
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

  expect(await status("al día · 90 días de permiso")).toHaveClass("pos");
  expect(screen.getByText("leído el 23 oct, 19:00")).toBeInTheDocument();
});

test("Consent about to expire", async () => {
  open([connection({ valid_until: daysFromNow(10) })]);

  expect(await status("caduca en 10 días")).toHaveClass("neg");
});

test("Expired connection", async () => {
  open([connection({ status: "expired", valid_until: daysFromNow(-1), last_error: `${"x".repeat(130)}` })]);

  expect(await status("hay que reconectar")).toHaveClass("neg");
  expect(screen.getByText("x".repeat(120))).toBeInTheDocument();
});

test("Never synced", async () => {
  open([connection({ valid_until: daysFromNow(90), last_synced_at: null })]);

  expect(await screen.findByText("sin leer aún")).toBeInTheDocument();
});

test("Read now", async () => {
  const sync = pending();
  const { api } = open([connection({ id: 3, valid_until: daysFromNow(90) })], { "POST /api/banks/3/sync": sync.route });

  await userEvent.click(await screen.findByRole("button", { name: "leer ahora" }));

  expect(screen.getByRole("button", { name: "leyendo…" })).toBeDisabled();
  sync.release(ok({ ok: true }));
  expect(await screen.findByRole("button", { name: "leer ahora" })).toBeEnabled();
  expect(api.to("GET", "/api/banks")).toHaveLength(2);
});

test("Reconnect", async () => {
  const { api, location } = open([connection({ bank: "BBVA", status: "expired" })], {
    "POST /api/banks/connect": ok({ url: "https://bbva.example/authorize" }),
  });

  await userEvent.click(await screen.findByRole("button", { name: "reconectar" }));

  await waitFor(() => expect(location.href).toBe("https://bbva.example/authorize"));
  expect(api.to("POST", "/api/banks/connect")[0].body).toEqual({ name: "BBVA", country: "ES" });
});

test("Pick a bank", async () => {
  const { api, location } = open([], {
    "GET /api/banks/available": ok([
      { name: "BBVA", country: "ES" },
      { name: "Revolut", country: "LT" },
    ]),
    "POST /api/banks/connect": ok({ url: "https://revolut.example/authorize" }),
  });

  await userEvent.click(await screen.findByRole("button", { name: "conectar un banco" }));
  const revolut = (await screen.findByText("Revolut")).closest(".row") as HTMLElement;
  await userEvent.click(within(revolut).getByRole("button", { name: "conectar" }));

  await waitFor(() => expect(location.href).toBe("https://revolut.example/authorize"));
  expect(api.to("POST", "/api/banks/connect")[0].body).toEqual({ name: "Revolut", country: "LT" });
});

test("Back from a successful authorization", async () => {
  open([], {}, "/bancos?connected=1");

  expect(await screen.findByText("banco conectado ✓")).toBeInTheDocument();
});

test("Back from a failed authorization", async () => {
  open([], {}, "/bancos?error=1");

  expect(await screen.findByText("no se pudo conectar el banco")).toBeInTheDocument();
});

test("Change role", async () => {
  const { api } = open(
    [connection({ valid_until: daysFromNow(90), accounts: [account({ id: 8, name: "Colchón", iban_tail: "9876" })] })],
    { "PATCH /api/accounts/8": ok(account({ id: 8, role: "savings" })) },
  );
  const row = (await screen.findByText("Colchón")).closest(".row") as HTMLElement;
  expect(within(row).getByText("·· 9876")).toBeInTheDocument();
  expect(within(row).getByText("1000,00 €")).toBeInTheDocument();

  await userEvent.selectOptions(within(row).getByRole("combobox", { name: "para qué es esta cuenta" }), "ahorro");

  expect(api.to("PATCH", "/api/accounts/8")[0].body).toEqual({ role: "savings" });
  await waitFor(() => expect(api.to("GET", "/api/banks")).toHaveLength(2));
});

test("Reprocess", async () => {
  const reprocess = pending();
  const { api } = open([], { "POST /api/reprocess": reprocess.route });
  expect(
    await screen.findByText("recalcula categorías y transferencias; no cambia lo que has tocado a mano"),
  ).toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: "hazlo ahora" }));

  expect(screen.getByRole("button", { name: "…" })).toBeDisabled();
  reprocess.release(ok({ processed: 3 }));
  expect(await screen.findByRole("button", { name: "hazlo ahora" })).toBeEnabled();
  expect(api.to("GET", "/api/banks")).toHaveLength(2);
});

test("Bank list unavailable", async () => {
  open([], { "GET /api/banks/available": fail(502, { detail: "Enable Banking: no responde" }) });

  await userEvent.click(await screen.findByRole("button", { name: "conectar un banco" }));

  expect(await screen.findByText("Enable Banking: no responde")).toBeInTheDocument();
});

test("Message cleared by the next action", async () => {
  const sync = pending();
  open([connection({ id: 3, valid_until: daysFromNow(90) })], {
    "POST /api/reprocess": fail(500, { detail: "algo falló" }),
    "POST /api/banks/3/sync": sync.route,
  });
  await userEvent.click(await screen.findByRole("button", { name: "hazlo ahora" }));
  expect(await screen.findByText("algo falló")).toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: "leer ahora" }));

  expect(screen.queryByText("algo falló")).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "leyendo…" })).toBeInTheDocument();
  sync.release(ok({ ok: true }));
  await screen.findByRole("button", { name: "leer ahora" });
});

test("Log out", async () => {
  const { api, location } = open([], { "POST /api/auth/logout": ok({ ok: true }) });

  await userEvent.click(await screen.findByRole("button", { name: "salir" }));

  await waitFor(() => expect(location.href).toBe("/login"));
  expect(api.to("POST", "/api/auth/logout")).toHaveLength(1);
});
