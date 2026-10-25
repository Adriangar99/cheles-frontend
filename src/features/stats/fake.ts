import { answer, type FakeState } from "@/shared/fakeState";
import { currentMonth, shiftMonth } from "@/shared/month";
import type { MonthTotals, StatsApi, Summary } from "./api";

const SUMMARY: Summary = {
  month: currentMonth(),
  income: 2000,
  expenses: 1287.3,
  net: 712.7,
  saved: 300,
  by_category: [
    { id: 1, name: "Vivienda", icon: "🏠", color: "#5b8def", amount: 750 },
    { id: 2, name: "Supermercado", icon: "🛒", color: "#4caf50", amount: 312.4 },
    { id: 3, name: "Restaurantes", icon: "🍽", color: "#d9822b", amount: 124.9 },
    { id: null, name: "Sin categoría", icon: "•", color: "#8a8a8a", amount: 100 },
  ],
  balances: { main: 1612.7, savings: 5300, total: 6912.7 },
  other_currencies: [],
};

const HISTORY: MonthTotals[] = Array.from({ length: 12 }, (_, i) => ({
  month: shiftMonth(currentMonth(), i - 11),
  income: 2000 + (i % 3) * 150,
  expenses: 1100 + ((i * 137) % 600),
}));

const EMPTY: Summary = {
  ...SUMMARY,
  income: 0,
  expenses: 0,
  net: 0,
  saved: 0,
  by_category: [],
  balances: { total: 0 },
};

// An in-memory StatsApi for stories and feature tests
export function fakeStatsApi(state: FakeState = "loaded", overrides: Partial<Summary> = {}): StatsApi {
  return {
    summary: (month) => answer(state, { ...SUMMARY, ...overrides, month }, { ...EMPTY, month }),
    history: () => answer(state, HISTORY, []),
  };
}
