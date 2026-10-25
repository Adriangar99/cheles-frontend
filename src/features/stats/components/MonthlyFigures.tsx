import { money } from "@/shared/format";
import { Figure, Figures, Message } from "@/shared/ui";
import type { MonthTotals, Summary } from "../api";
import { netTone, versus } from "../domain/charts";

type Props = { summary: Summary; previous?: MonthTotals };

export function MonthlyFigures({ summary, previous }: Props) {
  // How each figure compares to the previous month, when the history has it
  const vs = (current: number, before: (p: MonthTotals) => number, riseIs: "pos" | "neg") => {
    if (!previous) return null;
    const { text, tone } = versus(current, before(previous), previous.month, riseIs);
    return (
      <dd className="vs" data-tone={tone}>
        {text}
      </dd>
    );
  };
  return (
    <>
      <Figures>
        <Figure label="ingresos" value={money(summary.income)} tone="pos">
          {vs(summary.income, (p) => p.income, "pos")}
        </Figure>
        <Figure label="gastos" value={money(summary.expenses)}>
          {vs(summary.expenses, (p) => p.expenses, "neg")}
        </Figure>
        <Figure label="sobra" value={money(summary.net)} tone={netTone(summary.net)}>
          {vs(summary.net, (p) => p.income - p.expenses, "pos")}
        </Figure>
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
