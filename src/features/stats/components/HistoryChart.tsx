import { money } from "@/shared/format";
import type { MonthTotals } from "../api";
import { HISTORY_BAR_PX, historyBars } from "../domain/charts";

// One bar per amount, exposed as a meter whose value is its height on the chart's scale
function Bar({ label, px, color }: { label: string; px: number; color: string }) {
  return (
    // biome-ignore lint/a11y/useSemanticElements: a native <meter> cannot be drawn as a vertical or category-colored bar consistently across browsers
    <div
      className="b"
      role="meter"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={HISTORY_BAR_PX}
      aria-valuenow={px}
      style={{ height: `${px}px`, background: color }}
    />
  );
}

export function HistoryChart({ history }: { history: MonthTotals[] }) {
  return (
    <>
      <h2>últimos 12 meses</h2>
      <ul className="card history" aria-label="ingresos y gastos por mes">
        {historyBars(history).map((h) => (
          <li className="col" key={h.month} title={`${h.month}: ${money(h.income)} / ${money(h.expenses)}`}>
            <Bar label={`${h.month} ingresos`} px={h.incomePx} color="var(--accent)" />
            <Bar label={`${h.month} gastos`} px={h.expensesPx} color="var(--danger)" />
            <span className="sub" style={{ fontSize: 10 }}>
              {h.label}
            </span>
          </li>
        ))}
      </ul>
      <p className="sub" style={{ margin: "8px 4px" }}>
        verde = ingresos · rojo = gastos
      </p>
    </>
  );
}
