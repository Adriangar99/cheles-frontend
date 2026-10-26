import { useId } from "react";
import { Button, List, ListItem, Stamp } from "@/shared/ui";
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
      <div className="section-head">
        <h2 id={headingId}>{c.bank}</h2>
        <Button variant="quiet" size="small" onClick={onRemove}>
          Quitar
        </Button>
      </div>
      <List>
        <ListItem>
          <div className="grow status">
            <Stamp tone={status.tone}>{status.text}</Stamp>
            <div className="sub">{lastReadLabel(c)}</div>
            {c.last_error && <div className="err">{errorExcerpt(c.last_error)}</div>}
          </div>
          {status.needsReconnect ? (
            <Button variant="primary" onClick={onReconnect}>
              Reconectar
            </Button>
          ) : (
            <Button disabled={syncing} onClick={onSync}>
              {syncing ? "Leyendo…" : "Leer ahora"}
            </Button>
          )}
        </ListItem>
        {c.accounts.map((a) => (
          <AccountRow key={a.id} account={a} onRoleChange={(role) => onRoleChange(a.id, role)} />
        ))}
      </List>
    </section>
  );
}
