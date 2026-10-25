"use client";

import { capitalize, monthLabel } from "./format";
import { currentMonth, shiftMonth } from "./month";
import { Button } from "./ui";

// Previous/next month buttons around the month heading; the next one stops at the current month.
export function MonthNav({ month, onChange }: { month: string; onChange: (month: string) => void }) {
  return (
    <nav className="month-nav" aria-label="mes">
      <h1>{capitalize(monthLabel(month))}</h1>
      <Button onClick={() => onChange(shiftMonth(month, -1))} aria-label="Mes anterior">
        ‹
      </Button>
      <Button
        disabled={month === currentMonth()}
        onClick={() => onChange(shiftMonth(month, 1))}
        aria-label="Mes siguiente"
      >
        ›
      </Button>
    </nav>
  );
}
