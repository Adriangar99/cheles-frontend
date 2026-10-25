import { money } from "@/shared/format";
import type { CategorySpending } from "../api";
import { categoryBars } from "../domain/charts";

export function SpendingByCategory({ categories }: { categories: CategorySpending[] }) {
  return (
    <>
      <h2>en qué se va</h2>
      <ul className="card">
        {categories.length === 0 && <li className="row muted">sin gastos este mes</li>}
        {categoryBars(categories).map((c) => (
          <li className="row" key={c.name} style={{ display: "block" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>
                {c.icon} {c.name}
              </span>
              <span className="tx-amount">{money(c.amount)}</span>
            </div>
            <div className="bar">
              {/* biome-ignore lint/a11y/useSemanticElements: a native <meter> cannot be drawn as a vertical or category-colored bar consistently across browsers */}
              <span
                role="meter"
                aria-label={`${c.icon} ${c.name}`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={c.widthPct}
                style={{ width: `${c.widthPct}%`, background: c.color }}
              />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
