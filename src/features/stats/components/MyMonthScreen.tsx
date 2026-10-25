"use client";

import { useState } from "react";
import { errorMessage } from "@/shared/api/client";
import { MonthNav } from "@/shared/MonthNav";
import { currentMonth, shiftMonth } from "@/shared/month";
import { Message } from "@/shared/ui";
import { useHistory, useSummary } from "../hooks";
import { HistoryChart } from "./HistoryChart";
import { MonthlyFigures } from "./MonthlyFigures";
import { SpendingByCategory } from "./SpendingByCategory";

export function MyMonthScreen() {
  const [month, setMonth] = useState(currentMonth);
  const summary = useSummary(month);
  const history = useHistory();
  const error = errorMessage(summary.error, history.error);
  const previous = history.data?.find((h) => h.month === shiftMonth(month, -1));

  return (
    <>
      <MonthNav month={month} onChange={setMonth} />
      {error && <Message kind="error">{error}</Message>}
      {summary.data && (
        <>
          <MonthlyFigures summary={summary.data} previous={previous} />
          <SpendingByCategory summary={summary.data} />
        </>
      )}
      <HistoryChart history={history.data ?? []} />
    </>
  );
}
