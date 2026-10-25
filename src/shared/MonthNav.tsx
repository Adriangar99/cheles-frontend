"use client";

import { monthLabel } from "./format";
import { currentMonth, shiftMonth } from "./month";
import { Button } from "./ui";

// Previous/next month buttons around the month heading; the next one stops at the current month.
export function MonthNav({ month, onChange }: { month: string; onChange: (month: string) => void }) {
  return (
    <nav className="month-nav" aria-label="mes">
      <Button onClick={() => onChange(shiftMonth(month, -1))} aria-label="mes anterior">
        ‹
      </Button>
      <h1 style={{ textTransform: "capitalize" }}>{monthLabel(month)}</h1>
      <Button
        disabled={month === currentMonth()}
        onClick={() => onChange(shiftMonth(month, 1))}
        aria-label="mes siguiente"
      >
        ›
      </Button>
    </nav>
  );
}
