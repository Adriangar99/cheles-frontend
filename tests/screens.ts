import type { components } from "@/shared/api/schema";
import { ok } from "./fake-api";

type Schemas = components["schemas"];

export const summary = (overrides: Partial<Schemas["SummaryOut"]> = {}): Schemas["SummaryOut"] => ({
  month: "2026-10",
  income: 0,
  expenses: 0,
  net: 0,
  saved: 0,
  by_category: [],
  balances: { total: 0, main: 0, savings: 0 },
  ...overrides,
});

export const tx = (overrides: Partial<Schemas["TransactionOut"]> = {}): Schemas["TransactionOut"] => ({
  id: 1,
  date: "2026-10-03",
  amount: -12.5,
  currency: "EUR",
  status: "BOOK",
  counterparty: "MERCADONA",
  description: "COMPRA",
  kind: "normal",
  category_id: null,
  category_manual: false,
  account: "Nómina",
  account_id: 1,
  note: null,
  ...overrides,
});

export const category = (overrides: Partial<Schemas["CategoryOut"]> = {}): Schemas["CategoryOut"] => ({
  id: 1,
  name: "Supermercado",
  kind: "expense",
  icon: "🛒",
  color: "#4caf50",
  ...overrides,
});

export const account = (overrides: Partial<Schemas["AccountOut"]> = {}): Schemas["AccountOut"] => ({
  id: 1,
  name: "Nómina",
  iban_tail: "1234",
  currency: "EUR",
  role: "main",
  balance: 1000,
  balance_at: "2026-10-15T10:00:00+00:00",
  connection_id: 1,
  ...overrides,
});

export const connection = (overrides: Partial<Schemas["ConnectionOut"]> = {}): Schemas["ConnectionOut"] => ({
  id: 1,
  bank: "BBVA",
  status: "active",
  valid_until: "2027-01-13T12:00:00+00:00",
  last_synced_at: "2026-10-15T08:00:00+00:00",
  last_error: null,
  accounts: [],
  ...overrides,
});

export const noHistory = ok([]);
