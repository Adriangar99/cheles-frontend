import { request } from "@/shared/api/http";
import type { components } from "@/shared/api/schema";

export type Summary = components["schemas"]["SummaryOut"];
export type MonthTotals = components["schemas"]["MonthTotalsOut"];
export type CategorySpending = components["schemas"]["CategorySpendingOut"];

export interface StatsApi {
  summary(month: string): Promise<Summary>;
  history(months: number): Promise<MonthTotals[]>;
}

export const httpStatsApi: StatsApi = {
  summary: (month) => request(`/stats/summary?month=${month}`),
  history: (months) => request(`/stats/history?months=${months}`),
};
