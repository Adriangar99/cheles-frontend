import { money } from "@/shared/format";
import { Message } from "@/shared/ui";
import type { Summary } from "../api";
import { netTone } from "../domain/charts";

// Each figure is a term (dt) followed by its value (dd)
function Figure({ label, value, tone, wide, children }: FigureProps) {
  return (
    <div className={`card stat${wide ? " wide" : ""}`}>
      <dt className="label">{label}</dt>
      <dd className={`value${tone ? ` ${tone}` : ""}`} data-tone={tone}>
        {value}
      </dd>
      {children}
    </div>
  );
}

type FigureProps = { label: string; value: string; tone?: "pos" | "neg"; wide?: boolean; children?: React.ReactNode };

export function MonthlyFigures({ summary }: { summary: Summary }) {
  return (
    <>
      <dl className="stats">
        <Figure label="ingresos" value={money(summary.income)} tone="pos" />
        <Figure label="gastos" value={money(summary.expenses)} />
        <Figure label="sobra" value={money(summary.net)} tone={netTone(summary.net)} />
        <Figure label="enviado a ahorro" value={money(summary.saved)} />
        <Figure label="saldo total ahora" value={money(summary.balances.total)} wide>
          <dd className="sub">
            día a día {money(summary.balances.main ?? 0)} · ahorro {money(summary.balances.savings ?? 0)}
          </dd>
        </Figure>
      </dl>
      {summary.other_currencies.length > 0 && (
        <Message kind="note">No se cuentan importes en {summary.other_currencies.join(", ")}</Message>
      )}
    </>
  );
}
