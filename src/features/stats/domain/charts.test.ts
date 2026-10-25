import { expect, test } from "vitest";
import { historyBars, spendingStrip } from "./charts";

// Screen tests cover the scaling; these cover the guard against dividing by zero.

test("a month with no money has an empty strip", () => {
  const strip = spendingStrip([{ id: 1, name: "Supermercado", icon: "🛒", color: "#4caf50", amount: 0 }], 0, 0);

  expect(strip.segments.map((s) => s.pct)).toEqual([0]);
  expect(strip.left).toEqual({ amount: 0, pct: 0 });
});

test("a history with no movements has flat bars", () => {
  const bars = historyBars([{ month: "2026-09", income: 0, expenses: 0 }]);

  expect(bars).toEqual([{ month: "2026-09", label: "09", income: 0, expenses: 0, incomePx: 0, expensesPx: 0 }]);
});
