import { money } from "@/shared/format";
import { List, Meter } from "@/shared/ui";
import type { MonthTotals } from "../api";
import { HISTORY_BAR_PX, historyBars } from "../domain/charts";

export function HistoryChart({ history }: { history: MonthTotals[] }) {
  return (
    <>
      <h2>últimos 12 meses</h2>
      <List className="history" aria-label="ingresos y gastos por mes">
        {historyBars(history).map((h) => (
          <li className="col" key={h.month} title={`${h.month}: ${money(h.income)} / ${money(h.expenses)}`}>
            <Meter
              orientation="vertical"
              label={`${h.month} ingresos`}
              value={h.incomePx}
              max={HISTORY_BAR_PX}
              color="var(--color-positive)"
            />
            <Meter
              orientation="vertical"
              label={`${h.month} gastos`}
              value={h.expensesPx}
              max={HISTORY_BAR_PX}
              color="var(--color-negative)"
            />
            <span className="sub" style={{ fontSize: "var(--text-2xs)" }}>
              {h.label}
            </span>
          </li>
        ))}
      </List>
      <p className="sub" style={{ margin: "8px 4px" }}>
        verde = ingresos · rojo = gastos
      </p>
    </>
  );
}
