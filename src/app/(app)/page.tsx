"use client";

import { useEffect, useState } from "react";
import { api, currentMonth, type HistoryPoint, money, monthLabel, type Summary, shiftMonth } from "@/lib/api";

export default function MyMonth() {
  const [month, setMonth] = useState(currentMonth());
  const [summary, setSummary] = useState<Summary | null>(null);
  const [history, setHistory] = useState<HistoryPoint[]>([]);

  useEffect(() => {
    api<Summary>(`/stats/summary?month=${month}`).then(setSummary);
  }, [month]);
  useEffect(() => {
    api<HistoryPoint[]>("/stats/history?months=12").then(setHistory);
  }, []);

  const maxHistory = Math.max(1, ...history.flatMap((h) => [h.income, h.expenses]));
  const maxCategory = Math.max(1, ...(summary?.by_category.map((c) => c.amount) ?? [1]));
  const isCurrent = month === currentMonth();

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
          disabled={isCurrent}
          onClick={() => setMonth(shiftMonth(month, 1))}
          aria-label="mes siguiente"
        >
          ›
        </button>
      </div>

      {summary && (
        <>
          <div className="stats">
            <div className="card stat">
              <div className="label">ingresos</div>
              <div className="value pos">{money(summary.income)}</div>
            </div>
            <div className="card stat">
              <div className="label">gastos</div>
              <div className="value">{money(summary.expenses)}</div>
            </div>
            <div className="card stat">
              <div className="label">sobra</div>
              <div className={`value ${summary.net >= 0 ? "pos" : "neg"}`}>{money(summary.net)}</div>
            </div>
            <div className="card stat">
              <div className="label">enviado a ahorro</div>
              <div className="value">{money(summary.saved)}</div>
            </div>
            <div className="card stat wide">
              <div className="label">saldo total ahora</div>
              <div className="value">{money(summary.balances.total)}</div>
              <div className="sub">
                día a día {money(summary.balances.main ?? 0)} · ahorro {money(summary.balances.savings ?? 0)}
              </div>
            </div>
          </div>

          <h2>en qué se va</h2>
          <div className="card">
            {summary.by_category.length === 0 && <div className="row muted">sin gastos este mes</div>}
            {summary.by_category.map((c) => (
              <div className="row" key={c.name} style={{ display: "block" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>
                    {c.icon} {c.name}
                  </span>
                  <span className="tx-amount">{money(c.amount)}</span>
                </div>
                <div className="bar">
                  <span style={{ width: `${(c.amount / maxCategory) * 100}%`, background: c.color }} />
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      <h2>últimos 12 meses</h2>
      <div className="card history" role="img" aria-label="ingresos y gastos por mes">
        {history.map((h) => (
          <div className="col" key={h.month} title={`${h.month}: ${money(h.income)} / ${money(h.expenses)}`}>
            <div className="b" style={{ height: `${(h.income / maxHistory) * 70}px`, background: "var(--accent)" }} />
            <div className="b" style={{ height: `${(h.expenses / maxHistory) * 70}px`, background: "var(--danger)" }} />
            <span className="sub" style={{ fontSize: 10 }}>
              {h.month.slice(5)}
            </span>
          </div>
        ))}
      </div>
      <p className="sub" style={{ margin: "8px 4px" }}>
        verde = ingresos · rojo = gastos
      </p>
    </>
  );
}
