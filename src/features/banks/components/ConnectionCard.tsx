import type { Connection, Role } from "../api";
import { consentStatus, errorExcerpt, lastReadLabel } from "../domain/banks";
import { AccountRow } from "./AccountRow";

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
          <AccountRow key={a.id} account={a} onRoleChange={(role) => onRoleChange(a.id, role)} />
        ))}
      </div>
    </section>
  );
}
