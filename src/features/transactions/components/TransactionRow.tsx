import { useId } from "react";
import { Amount, Button, ListItem, Select, Truncated } from "@/shared/ui";
import type { Category, Transaction, TransactionPatch } from "../api";
import { categoryOptions, isCredit, rowDetail, rowLabel } from "../domain/transactions";

type Props = { tx: Transaction; categories: Category[]; onChange: (patch: TransactionPatch) => void };

export function TransactionRow({ tx, categories, onChange }: Props) {
  const transfer = tx.kind === "transfer";
  const { uncategorized, options } = categoryOptions(tx, categories);
  const labelId = useId();
  const detail = rowDetail(tx);
  const selected = options.find((c) => c.id === tx.category_id);
  return (
    <ListItem aria-labelledby={labelId} data-kind={tx.kind}>
      <div className="grow">
        <Truncated id={labelId} text={rowLabel(tx)} />
        {detail && <Truncated className="sub" text={detail} />}
        <div className="sub ellipsis">
          {tx.account}
          {tx.status === "PDNG" && " · pendiente"}
        </div>
        {transfer ? (
          <Button size="small" className="tx-tools" onClick={() => onChange({ kind: "normal" })}>
            ⇄ Entre mis cuentas (quitar)
          </Button>
        ) : (
          <div className="tx-tools">
            <Select
              value={tx.category_id ?? ""}
              onChange={(e) => onChange({ category_id: Number(e.target.value) })}
              label="Categoría"
              title={selected ? `${selected.icon} ${selected.name}` : "Sin categoría"}
            >
              {uncategorized && <option value="">Sin categoría</option>}
              {options.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </Select>
            <Button
              size="small"
              onClick={() => onChange({ kind: "transfer" })}
              title="Marcar como transferencia entre mis cuentas"
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
