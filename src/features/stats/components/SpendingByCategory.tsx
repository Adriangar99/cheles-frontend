import { useId } from "react";
import { Amount, Card, List, ListItem, Meter, Truncated } from "@/shared/ui";
import type { Summary } from "../api";
import { spendingStrip } from "../domain/charts";

const LEFT_COLOR = "var(--strip-left)";

// «La nómina repartida»: the month's money as one strip, then one legend line per piece of it
export function SpendingByCategory({ summary }: { summary: Summary }) {
  const { segments, left } = spendingStrip(summary.by_category, summary.income, summary.expenses);
  return (
    <>
      <h2>La nómina repartida</h2>
      {segments.length === 0 ? (
        <List>
          <ListItem muted>Sin gastos este mes</ListItem>
        </List>
      ) : (
        <Card className="spending">
          {/* Keyed by month, so the strip grows again when another month loads */}
          <div className="strip" key={summary.month}>
            {segments.map((s) => (
              <Meter
                key={s.name}
                orientation="segment"
                label={`${s.icon} ${s.name}`}
                value={s.pct}
                max={100}
                color={s.color}
              />
            ))}
            <Meter orientation="segment" label="Sobra" value={left.pct} max={100} color={LEFT_COLOR} />
          </div>
          <ul className="legend">
            {segments.map((s) => (
              <Share key={s.name} name={`${s.icon} ${s.name}`} amount={s.amount} pct={s.pct} color={s.color} />
            ))}
            <Share name="Sobra" amount={left.amount} pct={left.pct} color={LEFT_COLOR} />
          </ul>
        </Card>
      )}
    </>
  );
}

function Share({ name, amount, pct, color }: { name: string; amount: number; pct: number; color: string }) {
  const nameId = useId();
  return (
    <li aria-labelledby={nameId}>
      <span className="dot" style={{ background: color }} aria-hidden="true" />
      <Truncated as="span" id={nameId} text={name} />
      <Amount value={amount} />
      <span className="pct">{pct} %</span>
    </li>
  );
}
