"use client";

import { useState } from "react";
import { errorMessage } from "@/shared/api/client";
import { MonthNav } from "@/shared/MonthNav";
import { currentMonth } from "@/shared/month";
import { useHistory, useSummary } from "../hooks";
import { HistoryChart } from "./HistoryChart";
import { MonthlyFigures } from "./MonthlyFigures";
import { SpendingByCategory } from "./SpendingByCategory";

export function MyMonthScreen() {
  const [month, setMonth] = useState(currentMonth);
  const summary = useSummary(month);
  const history = useHistory();
  const error = errorMessage(summary.error, history.error);

  return (
    <>
      <MonthNav month={month} onChange={setMonth} />
      {error && <p className="err">{error}</p>}
      {summary.data && (
        <>
          <MonthlyFigures summary={summary.data} />
          <SpendingByCategory categories={summary.data.by_category} />
        </>
      )}
      <HistoryChart history={history.data ?? []} />
    </>
  );
}
