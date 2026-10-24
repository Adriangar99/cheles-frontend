import { expect, test } from "vitest";
import { categoryBars, historyBars } from "./charts";

// Screen tests cover the scaling; these cover the guard against dividing by zero.

test("a month whose categories all sum zero has empty bars", () => {
  const bars = categoryBars([{ id: 1, name: "Supermercado", icon: "🛒", color: "#4caf50", amount: 0 }]);

  expect(bars.map((b) => b.widthPct)).toEqual([0]);
});

test("a history with no movements has flat bars", () => {
  const bars = historyBars([{ month: "2026-09", income: 0, expenses: 0 }]);

  expect(bars).toEqual([{ month: "2026-09", label: "09", income: 0, expenses: 0, incomePx: 0, expensesPx: 0 }]);
});
