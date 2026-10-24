import { money } from "@/shared/format";
import type { Connection, Role } from "../api";
import { consentStatus, errorExcerpt, lastReadLabel, ROLE_LABEL } from "../domain/banks";

type Props = {
  connection: Connection;
  now: number;
  syncing: boolean;
  onSync: () => void;
  onReconnect: () => void;
  onRoleChange: (accountId: number, role: Role) => void;
};

export function ConnectionCard({ connection: c, now, syncing, onSync, onReconnect, onRoleChange }: Props) {
  const status = consentStatus(c, now);
  return (
    <section>
      <h2>{c.bank}</h2>
      <div className="card">
        <div className="row">
          <div className="grow">
            <div className={status.tone}>{status.text}</div>
            <div className="sub">{lastReadLabel(c.last_synced_at)}</div>
            {c.last_error && <div className="err">{errorExcerpt(c.last_error)}</div>}
          </div>
          {c.status !== "active" ? (
            <button type="button" className="btn primary" onClick={onReconnect}>
              reconectar
            </button>
          ) : (
            <button type="button" className="btn" disabled={syncing} onClick={onSync}>
              {syncing ? "leyendo…" : "leer ahora"}
            </button>
          )}
        </div>
        {c.accounts.map((a) => (
          <div className="row" key={a.id}>
            <div className="grow">
              <div className="ellipsis">
                {a.name}
                {a.iban_tail && <span className="muted"> ·· {a.iban_tail}</span>}
              </div>
              <div className="sub">{money(a.balance)}</div>
            </div>
            <select
              value={a.role}
              onChange={(e) => onRoleChange(a.id, e.target.value as Role)}
              aria-label="para qué es esta cuenta"
            >
              {Object.entries(ROLE_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </section>
  );
}
