import { money } from "@/shared/format";
import type { Summary } from "../api";
import { netTone } from "../domain/charts";

export function MonthlyFigures({ summary }: { summary: Summary }) {
  return (
    <div className="stats">
      <div className="card stat">
        <div className="label">ingresos</div>
        <div className="value pos">{money(summary.income)}</div>
      </div>
      <div className="card stat">
        <div className="label">gastos</div>
        <div className="value">{money(summary.expenses)}</div>
      </div>
      <div className="card stat">
        <div className="label">sobra</div>
        <div className={`value ${netTone(summary.net)}`}>{money(summary.net)}</div>
      </div>
      <div className="card stat">
        <div className="label">enviado a ahorro</div>
        <div className="value">{money(summary.saved)}</div>
      </div>
      <div className="card stat wide">
        <div className="label">saldo total ahora</div>
        <div className="value">{money(summary.balances.total)}</div>
        <div className="sub">
          día a día {money(summary.balances.main ?? 0)} · ahorro {money(summary.balances.savings ?? 0)}
        </div>
      </div>
    </div>
  );
}
