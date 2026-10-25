import type { CategorySpending, MonthTotals } from "../api";

export const HISTORY_BAR_PX = 70;

// Green when the month ends even or better.
export const netTone = (net: number) => (net >= 0 ? "pos" : "neg");

// Each category's bar is relative to the largest one (1 at least, so all-zero months stay empty).
export function categoryBars(categories: CategorySpending[]) {
  const max = Math.max(1, ...categories.map((c) => c.amount));
  return categories.map((c) => ({ ...c, widthPct: (c.amount / max) * 100 }));
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
