import { api, call } from "@/shared/api/client";
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
    // No q parameter at all when there is no search text
    const query = q ? { month, limit: LIST_LIMIT, q } : { month, limit: LIST_LIMIT };
    return call(api().GET("/api/transactions", { params: { query } }));
  },
  categories: () => call(api().GET("/api/categories")),
  async update(id, patch) {
    await call(api().PATCH("/api/transactions/{tx_id}", { params: { path: { tx_id: id } }, body: patch }));
  },
};
