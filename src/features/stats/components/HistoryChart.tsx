import { money } from "@/shared/format";
import type { MonthTotals } from "../api";
import { historyBars } from "../domain/charts";

export function HistoryChart({ history }: { history: MonthTotals[] }) {
  return (
    <>
      <h2>últimos 12 meses</h2>
      <div className="card history" role="img" aria-label="ingresos y gastos por mes">
        {historyBars(history).map((h) => (
          <div className="col" key={h.month} title={`${h.month}: ${money(h.income)} / ${money(h.expenses)}`}>
            <div className="b" style={{ height: `${h.incomePx}px`, background: "var(--accent)" }} />
            <div className="b" style={{ height: `${h.expensesPx}px`, background: "var(--danger)" }} />
            <span className="sub" style={{ fontSize: 10 }}>
              {h.label}
            </span>
          </div>
        ))}
      </div>
      <p className="sub" style={{ margin: "8px 4px" }}>
        verde = ingresos · rojo = gastos
      </p>
    </>
  );
}
