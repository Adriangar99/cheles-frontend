"use client";

import { useId, useState } from "react";
import { errorMessage } from "@/shared/api/client";
import { capitalize, dayLabel } from "@/shared/format";
import { MonthNav } from "@/shared/MonthNav";
import { currentMonth } from "@/shared/month";
import { Amount, List, ListItem, Message } from "@/shared/ui";
import type { Category, Transaction, TransactionPatch } from "../api";
import { byDay } from "../domain/transactions";
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
      <input placeholder="Buscar…" value={query} onChange={(e) => setQuery(e.target.value)} />
      {error && <Message kind="error">{error}</Message>}

      <h2>{txs.length} movimientos</h2>
      {txs.length === 0 && (
        <List>
          <ListItem muted>Nada por aquí</ListItem>
        </List>
      )}
      {byDay(txs).map((day) => (
        <Day
          key={day.date}
          {...day}
          categories={categories.data ?? []}
          onChange={(id, patch) => update.mutate({ id, patch })}
        />
      ))}
    </>
  );
}

type DayProps = {
  date: string;
  total: number;
  transactions: Transaction[];
  categories: Category[];
  onChange: (id: number, patch: TransactionPatch) => void;
};

// One day: its date and total, then its transactions
function Day({ date, total, transactions, categories, onChange }: DayProps) {
  const headingId = useId();
  return (
    <section aria-labelledby={headingId} className="day">
      <div className="section-head">
        <h3 id={headingId}>{capitalize(dayLabel(date))}</h3>
        <Amount value={total} tone={total > 0 ? "pos" : undefined} />
      </div>
      <List>
        {transactions.map((tx) => (
          <TransactionRow key={tx.id} tx={tx} categories={categories} onChange={(patch) => onChange(tx.id, patch)} />
        ))}
      </List>
    </section>
  );
}
