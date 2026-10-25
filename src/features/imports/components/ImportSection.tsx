"use client";

import { useEffect, useId, useState } from "react";
import { errorMessage } from "@/shared/api/client";
import { shortDate } from "@/shared/format";
import { Button, List, ListItem, Message, Select } from "@/shared/ui";
import type { Targets, WalletPreview } from "../api";
import { everyWalletToNew, parseTarget, targetValue, toBase64, totalToImport } from "../domain/imports";
import { useImportPreview, useRunImport } from "../hooks";

type Account = { id: number; name: string };

// «importar movimientos»: a MoneyLover export, where each of its wallets goes, what would happen, and the import
export function ImportSection({ accounts }: { accounts: Account[] }) {
  const headingId = useId();
  const [file, setFile] = useState<string | null>(null);
  const [targets, setTargets] = useState<Targets | null>(null);
  const [done, setDone] = useState("");
  const preview = useImportPreview(file ? { file, accounts: targets ?? {} } : null);
  const run = useRunImport();

  // The first preview only names the wallets; until the user chooses, each one goes to a new account
  useEffect(() => {
    if (preview.data && targets === null) setTargets(everyWalletToNew(preview.data));
  }, [preview.data, targets]);

  async function choose(chosen: File | undefined) {
    if (!chosen) return;
    setDone("");
    setTargets(null);
    setFile(toBase64(new Uint8Array(await chosen.arrayBuffer())));
  }

  function reset() {
    setFile(null);
    setTargets(null);
  }

  function importNow() {
    if (!file || !targets) return;
    run.mutate(
      { file, accounts: targets },
      {
        onSuccess: (result) => {
          setDone(`${result.imported} movimientos importados ✓`);
          reset();
        },
      },
    );
  }

  const shown = file && targets ? preview.data : undefined;
  const error = errorMessage(preview.error, run.error);
  const total = shown ? totalToImport(shown) : 0;
  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId}>importar movimientos</h2>
      {done && <Message kind="status">{done}</Message>}
      {error && <Message kind="error">{error}</Message>}
      {!file ? (
        <label className="btn file-pick">
          elegir fichero CSV
          <input type="file" accept=".csv,text/csv" onChange={(e) => choose(e.target.files?.[0])} />
        </label>
      ) : (
        shown && (
          <>
            <List>
              {shown.wallets.map((w) => (
                <Wallet
                  key={w.name}
                  wallet={w}
                  accounts={accounts}
                  onTarget={(value) => setTargets({ ...targets, [w.name]: parseTarget(value) })}
                />
              ))}
            </List>
            {shown.unmatched_categories.length > 0 && (
              <Message kind="note" className="import-note">
                sin equivalencia, irán por reglas:{" "}
                {shown.unmatched_categories.map((c) => `${c.name} (${c.rows})`).join(", ")}
              </Message>
            )}
            <Message kind="note" className="import-note">
              las transferencias de MoneyLover entran como ingresos y gastos; marca ⇄ las que sean entre tus cuentas
            </Message>
            <div className="actions">
              <Button variant="primary" disabled={total === 0 || run.isPending} onClick={importNow}>
                importar {total} movimientos
              </Button>
              <Button variant="quiet" onClick={reset}>
                cancelar
              </Button>
            </div>
          </>
        )
      )}
    </section>
  );
}

type WalletProps = { wallet: WalletPreview; accounts: Account[]; onTarget: (value: string) => void };

// One MoneyLover wallet: its rows, where they go and what would happen to them
function Wallet({ wallet: w, accounts, onTarget }: WalletProps) {
  const nameId = useId();
  return (
    <ListItem aria-labelledby={nameId} className="wallet">
      <div className="grow">
        <div id={nameId}>{w.name}</div>
        <div className="sub">
          {w.rows} movimientos · {shortDate(w.first_date)} – {shortDate(w.last_date)}
        </div>
        <ul className="outcome">
          {w.target === null ? (
            <li>no se importa</li>
          ) : (
            <>
              <li className="pos">entran {w.to_import}</li>
              {w.skipped > 0 && w.bank_since && (
                <li>
                  {w.skipped} ya los trajo el banco (desde {shortDate(w.bank_since)})
                </li>
              )}
              {w.already_imported > 0 && <li>{w.already_imported} ya importados</li>}
            </>
          )}
          {w.adjustments > 0 && <li>{w.adjustments} ajustes de saldo no se importan</li>}
        </ul>
      </div>
      <Select label="dónde van" value={targetValue(w.target)} onChange={(e) => onTarget(e.target.value)}>
        <option value="new">nueva cuenta</option>
        {accounts.map((a) => (
          <option key={a.id} value={a.id}>
            {a.name}
          </option>
        ))}
        <option value="none">no importar</option>
      </Select>
    </ListItem>
  );
}
