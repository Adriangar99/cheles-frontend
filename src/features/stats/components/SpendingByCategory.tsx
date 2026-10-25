import { Amount, List, ListItem, Meter } from "@/shared/ui";
import type { CategorySpending } from "../api";
import { categoryBars } from "../domain/charts";

export function SpendingByCategory({ categories }: { categories: CategorySpending[] }) {
  return (
    <>
      <h2>en qué se va</h2>
      <List>
        {categories.length === 0 && <ListItem muted>sin gastos este mes</ListItem>}
        {categoryBars(categories).map((c) => (
          <ListItem key={c.name} style={{ display: "block" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span>
                {c.icon} {c.name}
              </span>
              <Amount value={c.amount} />
            </div>
            <Meter label={`${c.icon} ${c.name}`} value={c.widthPct} max={100} color={c.color} />
          </ListItem>
        ))}
      </List>
    </>
  );
}
