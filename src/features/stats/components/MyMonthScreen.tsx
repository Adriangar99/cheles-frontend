"use client";

import { useState } from "react";
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

  return (
    <>
      <MonthNav month={month} onChange={setMonth} />
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
