import { money } from "@/shared/format";
import { Figure, Figures, Message } from "@/shared/ui";
import type { Summary } from "../api";
import { netTone } from "../domain/charts";

export function MonthlyFigures({ summary }: { summary: Summary }) {
  return (
    <>
      <Figures>
        <Figure label="ingresos" value={money(summary.income)} tone="pos" />
        <Figure label="gastos" value={money(summary.expenses)} />
        <Figure label="sobra" value={money(summary.net)} tone={netTone(summary.net)} />
        <Figure label="enviado a ahorro" value={money(summary.saved)} />
        <Figure label="saldo total ahora" value={money(summary.balances.total)} total>
          <dd className="sub">
            día a día {money(summary.balances.main ?? 0)} · ahorro {money(summary.balances.savings ?? 0)}
          </dd>
        </Figure>
      </Figures>
      {summary.other_currencies.length > 0 && (
        <Message kind="note">No se cuentan importes en {summary.other_currencies.join(", ")}</Message>
      )}
    </>
  );
}
