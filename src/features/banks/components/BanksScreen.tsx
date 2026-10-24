"use client";

import { useEffect, useState } from "react";
import { useLogout } from "@/features/auth";
import { authorizationMessage } from "../domain/banks";
import { useAvailableBanks, useBanks, useConnectBank, useReprocess, useSetRole, useSyncConnection } from "../hooks";
import { BankPicker } from "./BankPicker";
import { ConnectionCard } from "./ConnectionCard";
import { ReprocessCard } from "./ReprocessCard";

export function BanksScreen() {
  const banks = useBanks();
  const available = useAvailableBanks();
  const connect = useConnectBank();
  const sync = useSyncConnection();
  const reprocess = useReprocess();
  const setRole = useSetRole();
  const logout = useLogout();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const result = authorizationMessage(window.location.search);
    if (result) setMessage(result);
  }, []);

  const showError = (error: Error) => setMessage(error.message);
  // Sync, reprocess and role changes clear the previous message; opening the bank list does not.
  const action =
    <T,>(mutation: { mutate: (variables: T, options: { onError: typeof showError }) => void }) =>
    (variables: T) => {
      setMessage("");
      mutation.mutate(variables, { onError: showError });
    };

  return (
    <>
      <h1>los bancos</h1>
      <p className="sub">de dónde salen tus movimientos</p>
      {message && (
        <p className="sub" style={{ marginTop: 12 }}>
          {message}
        </p>
      )}

      {banks.data?.connections.map((c) => (
        <ConnectionCard
          key={c.id}
          connection={c}
          now={Date.now()}
          syncing={sync.isPending && sync.variables === c.id}
          onSync={() => action(sync)(c.id)}
          onReconnect={() => connect.mutate({ name: c.bank, country: "ES" })}
          onRoleChange={(accountId, role) => action(setRole)({ accountId, role })}
        />
      ))}

      <BankPicker
        banks={available.data}
        loading={available.isPending}
        onOpen={() => available.mutate(undefined, { onError: showError })}
        onConnect={(b) => connect.mutate({ name: b.name, country: b.country })}
      />

      <ReprocessCard busy={reprocess.isPending} onReprocess={() => action(reprocess)(undefined)} />

      <button type="button" className="btn" style={{ marginTop: 28 }} onClick={() => logout.mutate()}>
        salir
      </button>
    </>
  );
}
