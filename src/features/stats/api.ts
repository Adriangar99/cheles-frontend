import { api, call } from "@/shared/api/client";
import type { components } from "@/shared/api/schema";

export type Summary = components["schemas"]["SummaryOut"];
export type MonthTotals = components["schemas"]["MonthTotalsOut"];
export type CategorySpending = components["schemas"]["CategorySpendingOut"];

export interface StatsApi {
  summary(month: string): Promise<Summary>;
  history(months: number): Promise<MonthTotals[]>;
}

export const httpStatsApi: StatsApi = {
  summary: (month) => call(api().GET("/api/stats/summary", { params: { query: { month } } })),
  history: (months) => call(api().GET("/api/stats/history", { params: { query: { months } } })),
};
