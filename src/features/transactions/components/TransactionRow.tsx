import { useId } from "react";
import { dayMonth, money } from "@/shared/format";
import { Button, ListItem, Select } from "@/shared/ui";
import type { Category, Transaction, TransactionPatch } from "../api";
import { categoryOptions, isCredit, rowLabel } from "../domain/transactions";

type Props = { tx: Transaction; categories: Category[]; onChange: (patch: TransactionPatch) => void };

export function TransactionRow({ tx, categories, onChange }: Props) {
  const transfer = tx.kind === "transfer";
  const { uncategorized, options } = categoryOptions(tx, categories);
  const labelId = useId();
  return (
    <ListItem aria-labelledby={labelId} data-kind={tx.kind} style={transfer ? { opacity: 0.55 } : undefined}>
      <div className="grow">
        <div className="ellipsis" id={labelId}>
          {rowLabel(tx)}
        </div>
        <div className="sub ellipsis">
          {dayMonth(tx.date)} · {tx.account}
          {tx.status === "PDNG" && " · pendiente"}
        </div>
        {transfer ? (
          <Button
            style={{ marginTop: 6, padding: "4px 10px", fontSize: "var(--text-xs)" }}
            onClick={() => onChange({ kind: "normal" })}
          >
            ⇄ entre mis cuentas (quitar)
          </Button>
        ) : (
          <div style={{ display: "flex", gap: 6, marginTop: 6, alignItems: "center" }}>
            <Select
              value={tx.category_id ?? ""}
              onChange={(e) => onChange({ category_id: Number(e.target.value) })}
              label="categoría"
            >
              {uncategorized && <option value="">sin categoría</option>}
              {options.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </Select>
            <Button
              style={{ padding: "6px 10px", fontSize: "var(--text-xs)" }}
              onClick={() => onChange({ kind: "transfer" })}
              title="marcar como transferencia entre mis cuentas"
            >
              ⇄
            </Button>
          </div>
        )}
      </div>
      <div className={`tx-amount ${isCredit(tx) ? "pos" : ""}`} data-tone={isCredit(tx) ? "pos" : undefined}>
        {money(tx.amount)}
      </div>
    </ListItem>
  );
}
