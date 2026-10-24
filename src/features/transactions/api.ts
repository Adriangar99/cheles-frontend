import { request } from "@/shared/api/http";
import type { components } from "@/shared/api/schema";

export type Transaction = components["schemas"]["TransactionOut"];
export type Category = components["schemas"]["CategoryOut"];
export type TransactionPatch = components["schemas"]["TxPatch"];
export type TransactionFilter = { month: string; q: string };

const LIST_LIMIT = 500;

export interface TransactionsApi {
  list(filter: TransactionFilter): Promise<Transaction[]>;
  categories(): Promise<Category[]>;
  update(id: number, patch: TransactionPatch): Promise<void>;
}

export const httpTransactionsApi: TransactionsApi = {
  list({ month, q }) {
    const params = new URLSearchParams({ month, limit: String(LIST_LIMIT) });
    if (q) params.set("q", q);
    return request(`/transactions?${params}`);
  },
  categories: () => request("/categories"),
  async update(id, patch) {
    await request(`/transactions/${id}`, { method: "PATCH", json: patch });
  },
};
