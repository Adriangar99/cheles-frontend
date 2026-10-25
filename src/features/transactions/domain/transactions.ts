import type { Category, Transaction } from "../api";

export const rowLabel = (tx: Transaction) => tx.counterparty || tx.description || "—";

export const isCredit = (tx: Transaction) => tx.amount > 0;

// Categories of the transaction's sign, then its current one if it is of the other kind (so the selector can show
// it); «sin categoría» only while it has none.
export function categoryOptions(tx: Transaction, categories: Category[]) {
  const kind = isCredit(tx) ? "income" : "expense";
  const current = categories.find((c) => c.id === tx.category_id);
  const options = categories.filter((c) => c.kind === kind);
  return {
    uncategorized: !tx.category_id,
    options: current && current.kind !== kind ? [...options, current] : options,
  };
}

// Transactions grouped by day in the order they come (newest first), with the day's total of non-transfers
export function byDay(transactions: Transaction[]) {
  const days: { date: string; total: number; transactions: Transaction[] }[] = [];
  for (const tx of transactions) {
    let day = days.at(-1);
    if (day?.date !== tx.date) {
      day = { date: tx.date, total: 0, transactions: [] };
      days.push(day);
    }
    day.transactions.push(tx);
    if (tx.kind !== "transfer") day.total = Math.round((day.total + tx.amount) * 100) / 100;
  }
  return days;
}
