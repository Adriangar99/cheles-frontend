import { useId } from "react";
import type { Connection, Role } from "../api";
import { consentStatus, errorExcerpt, lastReadLabel } from "../domain/banks";
import { AccountRow } from "./AccountRow";

type Props = {
  connection: Connection;
  now: number;
  syncing: boolean;
  onSync: () => void;
  onReconnect: () => void;
  onRemove: () => void;
  onRoleChange: (accountId: number, role: Role) => void;
};

export function ConnectionCard({ connection: c, now, syncing, onSync, onReconnect, onRemove, onRoleChange }: Props) {
  const status = consentStatus(c, now);
  const headingId = useId();
  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId}>{c.bank}</h2>
      <ul className="card">
        <li className="row">
          <div className="grow">
            <div className={status.tone} data-tone={status.tone}>
              {status.text}
            </div>
            <div className="sub">{lastReadLabel(c.last_synced_at)}</div>
            {c.last_error && <div className="err">{errorExcerpt(c.last_error)}</div>}
          </div>
          {status.needsReconnect ? (
            <button type="button" className="btn primary" onClick={onReconnect}>
              reconectar
            </button>
          ) : (
            <button type="button" className="btn" disabled={syncing} onClick={onSync}>
              {syncing ? "leyendo…" : "leer ahora"}
            </button>
          )}
        </li>
        <li className="row">
          <button type="button" className="btn" onClick={onRemove}>
            quitar
          </button>
        </li>
        {c.accounts.map((a) => (
          <AccountRow key={a.id} account={a} onRoleChange={(role) => onRoleChange(a.id, role)} />
        ))}
      </ul>
    </section>
  );
}
