import { useId } from "react";
import { Amount, Button, ListItem, Select } from "@/shared/ui";
import type { Category, Transaction, TransactionPatch } from "../api";
import { categoryOptions, isCredit, rowLabel } from "../domain/transactions";

type Props = { tx: Transaction; categories: Category[]; onChange: (patch: TransactionPatch) => void };

export function TransactionRow({ tx, categories, onChange }: Props) {
  const transfer = tx.kind === "transfer";
  const { uncategorized, options } = categoryOptions(tx, categories);
  const labelId = useId();
  return (
    <ListItem aria-labelledby={labelId} data-kind={tx.kind}>
      <div className="grow">
        <div className="ellipsis" id={labelId}>
          {rowLabel(tx)}
        </div>
        <div className="sub ellipsis">
          {tx.account}
          {tx.status === "PDNG" && " · pendiente"}
        </div>
        {transfer ? (
          <Button size="small" className="tx-tools" onClick={() => onChange({ kind: "normal" })}>
            ⇄ entre mis cuentas (quitar)
          </Button>
        ) : (
          <div className="tx-tools">
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
              size="small"
              onClick={() => onChange({ kind: "transfer" })}
              title="marcar como transferencia entre mis cuentas"
            >
              ⇄
            </Button>
          </div>
        )}
      </div>
      <Amount as="div" value={tx.amount} tone={isCredit(tx) ? "pos" : undefined} />
    </ListItem>
  );
}
