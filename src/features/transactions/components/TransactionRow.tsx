import { dayMonth, money } from "@/shared/format";
import type { Category, Transaction, TransactionPatch } from "../api";
import { categoryOptions, isCredit, rowLabel } from "../domain/transactions";

type Props = { tx: Transaction; categories: Category[]; onChange: (patch: TransactionPatch) => void };

export function TransactionRow({ tx, categories, onChange }: Props) {
  const transfer = tx.kind === "transfer";
  const { uncategorized, options } = categoryOptions(tx, categories);
  return (
    <div className="row" style={transfer ? { opacity: 0.55 } : undefined}>
      <div className="grow">
        <div className="ellipsis">{rowLabel(tx)}</div>
        <div className="sub ellipsis">
          {dayMonth(tx.date)} · {tx.account}
          {tx.status === "PDNG" && " · pendiente"}
        </div>
        {transfer ? (
          <button
            type="button"
            className="btn"
            style={{ marginTop: 6, padding: "4px 10px", fontSize: 12 }}
            onClick={() => onChange({ kind: "normal" })}
          >
            ⇄ entre mis cuentas (quitar)
          </button>
        ) : (
          <div style={{ display: "flex", gap: 6, marginTop: 6, alignItems: "center" }}>
            <select
              value={tx.category_id ?? ""}
              onChange={(e) => onChange({ category_id: Number(e.target.value) })}
              aria-label="categoría"
            >
              {uncategorized && <option value="">sin categoría</option>}
              {options.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.icon} {c.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="btn"
              style={{ padding: "6px 10px", fontSize: 12 }}
              onClick={() => onChange({ kind: "transfer" })}
              title="marcar como transferencia entre mis cuentas"
            >
              ⇄
            </button>
          </div>
        )}
      </div>
      <div className={`tx-amount ${isCredit(tx) ? "pos" : ""}`}>{money(tx.amount)}</div>
    </div>
  );
}
