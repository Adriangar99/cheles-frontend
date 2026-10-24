// Transitional: screens not yet migrated to src/features/ import from here. Removed with the last feature change.
import type { components } from "@/shared/api/schema";

export { request as api } from "@/shared/api/http";
export { money, monthLabel } from "@/shared/format";
export { currentMonth, shiftMonth } from "@/shared/month";

type Schemas = components["schemas"];

export type Account = Schemas["AccountOut"];
export type Connection = Schemas["ConnectionOut"];
export type Category = Schemas["CategoryOut"];
export type Tx = Schemas["TransactionOut"];
export type Summary = Schemas["SummaryOut"];
export type HistoryPoint = Schemas["MonthTotalsOut"];
