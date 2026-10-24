import { money } from "@/shared/format";
import type { CategorySpending } from "../api";
import { categoryBars } from "../domain/charts";

export function SpendingByCategory({ categories }: { categories: CategorySpending[] }) {
  return (
    <>
      <h2>en qué se va</h2>
      <div className="card">
        {categories.length === 0 && <div className="row muted">sin gastos este mes</div>}
        {categoryBars(categories).map((c) => (
          <div className="row" key={c.name} style={{ display: "block" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>
                {c.icon} {c.name}
              </span>
              <span className="tx-amount">{money(c.amount)}</span>
            </div>
            <div className="bar">
              <span style={{ width: `${c.widthPct}%`, background: c.color }} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
