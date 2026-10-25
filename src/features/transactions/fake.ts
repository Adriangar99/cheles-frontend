import { answer, type FakeState } from "@/shared/fakeState";
import { currentMonth } from "@/shared/month";
import type { Category, Transaction, TransactionsApi } from "./api";

export const CATEGORIES: Category[] = [
  { id: 1, name: "Supermercado", kind: "expense", icon: "🛒", color: "#4caf50" },
  { id: 2, name: "Restaurantes", kind: "expense", icon: "🍽", color: "#d9822b" },
  { id: 3, name: "Nómina", kind: "income", icon: "💼", color: "#2ec4b6" },
];

const day = (d: number) => `${currentMonth()}-${String(d).padStart(2, "0")}`;
const base = { currency: "EUR", status: "BOOK", kind: "normal", kind_manual: false, category_manual: false } as const;

const TRANSACTIONS: Transaction[] = [
  {
    ...base,
    id: 1,
    date: day(1),
    amount: 2000,
    counterparty: "EMPRESA SL",
    description: "NOMINA",
    category_id: 3,
    account: "Nómina",
    account_id: 1,
    note: null,
  },
  {
    ...base,
    id: 2,
    date: day(2),
    amount: -62.4,
    counterparty: "MERCADONA",
    description: "",
    category_id: 1,
    account: "Nómina",
    account_id: 1,
    note: null,
  },
  {
    ...base,
    id: 3,
    date: day(3),
    amount: -24.9,
    counterparty: "RESTAURANTE LA PLAZA",
    description: "",
    category_id: 2,
    account: "Nómina",
    account_id: 1,
    note: null,
  },
  {
    ...base,
    id: 4,
    date: day(4),
    amount: -300,
    counterparty: null,
    description: "TRASPASO",
    category_id: null,
    account: "Nómina",
    account_id: 1,
    note: null,
    kind: "transfer",
  },
  {
    ...base,
    id: 5,
    date: day(5),
    amount: -12.5,
    counterparty: "MERCADONA",
    description: "",
    category_id: 1,
    account: "Nómina",
    account_id: 1,
    note: null,
    status: "PDNG",
  },
];

// An in-memory TransactionsApi for stories and feature tests; edits change its data
export function fakeTransactionsApi(state: FakeState = "loaded"): TransactionsApi {
  // Newest first, like the API
  const stored = TRANSACTIONS.map((t) => ({ ...t })).reverse();
  return {
    list: ({ q }) =>
      answer(
        state,
        stored.filter((t) => !q || `${t.counterparty} ${t.description}`.toLowerCase().includes(q.toLowerCase())),
        [],
      ),
    categories: () => answer(state === "error" ? "loaded" : state, CATEGORIES, CATEGORIES),
    async update(id, patch) {
      const tx = stored.find((t) => t.id === id);
      if (tx)
        Object.assign(
          tx,
          patch.kind ? { kind: patch.kind } : {},
          patch.category_id ? { category_id: patch.category_id } : {},
        );
    },
  };
}
