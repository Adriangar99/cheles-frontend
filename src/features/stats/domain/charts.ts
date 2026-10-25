import { money, monthName } from "@/shared/format";
import type { CategorySpending, MonthTotals } from "../api";

export const HISTORY_BAR_PX = 70;

// Green when the month ends even or better.
export const netTone = (net: number) => (net >= 0 ? "pos" : "neg");

// «La nómina repartida»: one strip as long as the income (or the expenses, when larger), split into each category's
// share and what is left. Shares are whole percentages; a month with no money has an empty strip.
export function spendingStrip(categories: CategorySpending[], income: number, expenses: number) {
  const length = Math.max(income, expenses);
  const pct = (amount: number) => (length > 0 ? Math.round((amount / length) * 100) : 0);
  const left = Math.max(0, income - expenses);
  return {
    segments: categories.map((c) => ({ ...c, pct: pct(c.amount) })),
    left: { amount: left, pct: pct(left) },
  };
}

// Income and expense bars share one scale: the largest value of the whole history is full height.
export function historyBars(points: MonthTotals[]) {
  const max = Math.max(1, ...points.flatMap((p) => [p.income, p.expenses]));
  return points.map((p) => ({
    ...p,
    label: p.month.slice(5),
    incomePx: (p.income / max) * HISTORY_BAR_PX,
    expensesPx: (p.expenses / max) * HISTORY_BAR_PX,
  }));
}

// How a figure compares to the previous month's. `riseIs` is the tone of a rise: good news for income, bad for spending.
export function versus(current: number, previous: number, previousMonth: string, riseIs: "pos" | "neg") {
  const diff = Math.round((current - previous) * 100) / 100;
  const month = monthName(previousMonth);
  if (diff === 0) return { text: `Igual que en ${month}`, tone: undefined };
  const fallIs = riseIs === "pos" ? "neg" : "pos";
  return diff > 0
    ? { text: `${money(diff)} más que en ${month}`, tone: riseIs }
    : { text: `${money(-diff)} menos que en ${month}`, tone: fallIs };
}
