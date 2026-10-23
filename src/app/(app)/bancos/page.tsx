"use client";

import { useCallback, useEffect, useState } from "react";
import { Account, api, Connection, money } from "@/lib/api";

type Banks = { connections: Connection[]; detached_accounts: Account[] };
type Available = { name: string; country: string }[];

const ROLE_LABEL = { main: "día a día", savings: "ahorro", excluded: "no cuenta" } as const;

export default function Banks() {
  const [data, setData] = useState<Banks | null>(null);
  const [available, setAvailable] = useState<Available | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  const load = useCallback(() => api<Banks>("/banks").then(setData), []);

  useEffect(() => {
    load();
    const params = new URLSearchParams(window.location.search);
    if (params.get("connected")) setMessage("banco conectado ✓");
    if (params.get("error")) setMessage("no se pudo conectar el banco");
  }, [load]);

  async function run<T>(key: string, fn: () => Promise<T>) {
    setBusy(key);
    setMessage("");
    try {
      await fn();
      await load();
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error");
    }
    setBusy(null);
  }

  async function openPicker() {
    setBusy("picker");
    try {
      setAvailable(await api<Available>("/banks/available"));
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Error");
    }
    setBusy(null);
  }

  async function connect(name: string, country: string) {
    const { url } = await api<{ url: string }>("/banks/connect", { method: "POST", json: { name, country } });
    window.location.href = url;
  }

  const patch = (id: number, json: object) => run(`acc${id}`, () => api(`/accounts/${id}`, { method: "PATCH", json }));

  return (
    <>
      <h1>los bancos</h1>
      <p className="sub">de dónde salen tus movimientos</p>
      {message && <p className="sub" style={{ marginTop: 12 }}>{message}</p>}

      {data?.connections.map((c) => {
        const daysLeft = Math.ceil((new Date(c.valid_until).getTime() - Date.now()) / 86400000);
        const expired = c.status !== "active";
        return (
          <section key={c.id}>
            <h2>{c.bank}</h2>
            <div className="card">
              <div className="row">
                <div className="grow">
                  <div className={expired || daysLeft < 14 ? "neg" : "pos"}>
                    {expired ? "hay que reconectar" : daysLeft < 14 ? `caduca en ${daysLeft} días` : `al día · ${daysLeft} días de permiso`}
                  </div>
                  <div className="sub">
                    {c.last_synced_at ? `leído el ${new Date(c.last_synced_at).toLocaleString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}` : "sin leer aún"}
                  </div>
                  {c.last_error && <div className="err">{c.last_error.slice(0, 120)}</div>}
                </div>
                {expired ? (
                  <button className="btn primary" onClick={() => connect(c.bank, "ES")}>reconectar</button>
                ) : (
                  <button className="btn" disabled={busy === `sync${c.id}`} onClick={() => run(`sync${c.id}`, () => api(`/banks/${c.id}/sync`, { method: "POST" }))}>
                    {busy === `sync${c.id}` ? "leyendo…" : "leer ahora"}
                  </button>
                )}
              </div>
              {c.accounts.map((a) => (
                <div className="row" key={a.id}>
                  <div className="grow">
                    <div className="ellipsis">{a.name}{a.iban_tail && <span className="muted"> ·· {a.iban_tail}</span>}</div>
                    <div className="sub">{money(a.balance)}</div>
                  </div>
                  <select value={a.role} onChange={(e) => patch(a.id, { role: e.target.value })} aria-label="para qué es esta cuenta">
                    {Object.entries(ROLE_LABEL).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                  </select>
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <h2>añadir un banco</h2>
      {!available ? (
        <button className="btn primary" disabled={busy === "picker"} onClick={openPicker}>conectar un banco</button>
      ) : (
        <div className="card">
          {available.map((b) => (
            <div className="row" key={`${b.name}${b.country}`}>
              <span>{b.name}</span>
              <button className="btn" onClick={() => connect(b.name, b.country)}>conectar</button>
            </div>
          ))}
        </div>
      )}

      <h2>si algo no cuadra</h2>
      <div className="card">
        <div className="row">
          <div className="grow">
            <div>reprocesar desde los bancos</div>
            <div className="sub">recalcula categorías y transferencias; no cambia lo que has tocado a mano</div>
          </div>
          <button className="btn" disabled={busy === "reprocess"} onClick={() => run("reprocess", () => api("/reprocess", { method: "POST" }))}>
            {busy === "reprocess" ? "…" : "hazlo ahora"}
          </button>
        </div>
      </div>

      <button
        className="btn"
        style={{ marginTop: 28 }}
        onClick={async () => {
          await api("/auth/logout", { method: "POST" });
          window.location.href = "/login";
        }}
      >
        salir
      </button>
    </>
  );
}
