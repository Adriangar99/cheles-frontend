"use client";

import { useCallback, useEffect, useState } from "react";
import { api, type Category, currentMonth, money, monthLabel, shiftMonth, type Tx } from "@/lib/api";

export default function Movements() {
  const [month, setMonth] = useState(currentMonth());
  const [query, setQuery] = useState("");
  const [txs, setTxs] = useState<Tx[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  const load = useCallback(() => {
    const params = new URLSearchParams({ month, limit: "500" });
    if (query) params.set("q", query);
    api<Tx[]>(`/transactions?${params}`).then(setTxs);
  }, [month, query]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);
  useEffect(() => {
    api<Category[]>("/categories").then(setCategories);
  }, []);

  async function setCategory(tx: Tx, categoryId: number) {
    await api(`/transactions/${tx.id}`, { method: "PATCH", json: { category_id: categoryId } });
    load();
  }

  async function toggleTransfer(tx: Tx) {
    await api(`/transactions/${tx.id}`, {
      method: "PATCH",
      json: { kind: tx.kind === "transfer" ? "normal" : "transfer" },
    });
    load();
  }

  const byId = new Map(categories.map((c) => [c.id, c]));

  return (
    <>
      <div className="month-nav">
        <button type="button" className="btn" onClick={() => setMonth(shiftMonth(month, -1))} aria-label="mes anterior">
          ‹
        </button>
        <h1 style={{ textTransform: "capitalize" }}>{monthLabel(month)}</h1>
        <button
          type="button"
          className="btn"
          disabled={month === currentMonth()}
          onClick={() => setMonth(shiftMonth(month, 1))}
          aria-label="mes siguiente"
        >
          ›
        </button>
      </div>
      <input placeholder="buscar…" value={query} onChange={(e) => setQuery(e.target.value)} />

      <h2>{txs.length} movimientos</h2>
      <div className="card">
        {txs.map((tx) => {
          const cat = tx.category_id ? byId.get(tx.category_id) : undefined;
          return (
            <div className="row" key={tx.id} style={tx.kind === "transfer" ? { opacity: 0.55 } : undefined}>
              <div className="grow">
                <div className="ellipsis">{tx.counterparty || tx.description || "—"}</div>
                <div className="sub ellipsis">
                  {new Date(tx.date).toLocaleDateString("es-ES", { day: "numeric", month: "short" })} · {tx.account}
                  {tx.status === "PDNG" && " · pendiente"}
                </div>
                {tx.kind === "transfer" ? (
                  <button
                    type="button"
                    className="btn"
                    style={{ marginTop: 6, padding: "4px 10px", fontSize: 12 }}
                    onClick={() => toggleTransfer(tx)}
                  >
                    ⇄ entre mis cuentas (quitar)
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: 6, marginTop: 6, alignItems: "center" }}>
                    <select
                      value={tx.category_id ?? ""}
                      onChange={(e) => setCategory(tx, Number(e.target.value))}
                      aria-label="categoría"
                    >
                      {!tx.category_id && <option value="">sin categoría</option>}
                      {categories
                        .filter((c) => c.kind === (tx.amount > 0 ? "income" : "expense"))
                        .map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.icon} {c.name}
                          </option>
                        ))}
                      {cat && cat.kind !== (tx.amount > 0 ? "income" : "expense") && (
                        <option value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      )}
                    </select>
                    <button
                      type="button"
                      className="btn"
                      style={{ padding: "6px 10px", fontSize: 12 }}
                      onClick={() => toggleTransfer(tx)}
                      title="marcar como transferencia entre mis cuentas"
                    >
                      ⇄
                    </button>
                  </div>
                )}
              </div>
              <div className={`tx-amount ${tx.amount > 0 ? "pos" : ""}`}>{money(tx.amount)}</div>
            </div>
          );
        })}
        {txs.length === 0 && <div className="row muted">nada por aquí</div>}
      </div>
    </>
  );
}
