"use client";

import { monthLabel } from "./format";
import { currentMonth, shiftMonth } from "./month";

// Previous/next month buttons around the month heading; the next one stops at the current month.
export function MonthNav({ month, onChange }: { month: string; onChange: (month: string) => void }) {
  return (
    <div className="month-nav">
      <button type="button" className="btn" onClick={() => onChange(shiftMonth(month, -1))} aria-label="mes anterior">
        ‹
      </button>
      <h1 style={{ textTransform: "capitalize" }}>{monthLabel(month)}</h1>
      <button
        type="button"
        className="btn"
        disabled={month === currentMonth()}
        onClick={() => onChange(shiftMonth(month, 1))}
        aria-label="mes siguiente"
      >
        ›
      </button>
    </div>
  );
}
