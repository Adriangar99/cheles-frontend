"use client";

import { useState } from "react";
import { errorMessage } from "@/shared/api/http";
import { MonthNav } from "@/shared/MonthNav";
import { currentMonth } from "@/shared/month";
import { useCategories, useDebounced, useTransactions, useUpdateTransaction } from "../hooks";
import { TransactionRow } from "./TransactionRow";

export function TransactionsScreen() {
  const [month, setMonth] = useState(currentMonth);
  const [query, setQuery] = useState("");
  const transactions = useTransactions(useDebounced({ month, q: query }));
  const categories = useCategories();
  const update = useUpdateTransaction();

  const error = errorMessage(transactions.error, update.error);
  const txs = transactions.data ?? [];
  return (
    <>
      <MonthNav month={month} onChange={setMonth} />
      <input placeholder="buscar…" value={query} onChange={(e) => setQuery(e.target.value)} />
      {error && <p className="err">{error}</p>}

      <h2>{txs.length} movimientos</h2>
      <div className="card">
        {txs.map((tx) => (
          <TransactionRow
            key={tx.id}
            tx={tx}
            categories={categories.data ?? []}
            onChange={(patch) => update.mutate({ id: tx.id, patch })}
          />
        ))}
        {txs.length === 0 && <div className="row muted">nada por aquí</div>}
      </div>
    </>
  );
}
