"use client";

import { useEffect, useState } from "react";
import { useLogout } from "@/features/auth";
import { errorMessage } from "@/shared/api/http";
import type { Role } from "../api";
import { authorizationMessage } from "../domain/banks";
import { useAvailableBanks, useBanks, useConnectBank, useReprocess, useSetRole, useSyncConnection } from "../hooks";
import { BankPicker } from "./BankPicker";
import { ConnectionCard } from "./ConnectionCard";
import { DetachedAccounts } from "./DetachedAccounts";
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

  // Sync, reprocess and role changes clear the previous message; opening the bank list, connecting and logging out
  // do not.
  const onError = {
    onError: (error: Error) => {
      const shown = errorMessage(error);
      if (shown) setMessage(shown);
    },
  };
  const shown = message || errorMessage(banks.error);
  const changeRole = (accountId: number, role: Role) => {
    setMessage("");
    setRole.mutate({ accountId, role }, onError);
  };

  return (
    <>
      <h1>los bancos</h1>
      <p className="sub">de dónde salen tus movimientos</p>
      {shown && (
        <p className="sub" style={{ marginTop: 12 }}>
          {shown}
        </p>
      )}

      {banks.data?.connections.map((c) => (
        <ConnectionCard
          key={c.id}
          connection={c}
          now={Date.now()}
          syncing={sync.isPending && sync.variables === c.id}
          onSync={() => {
            setMessage("");
            sync.mutate(c.id, onError);
          }}
          onReconnect={() => connect.mutate({ name: c.bank, country: "ES" }, onError)}
          onRoleChange={changeRole}
        />
      ))}

      <DetachedAccounts accounts={banks.data?.detached_accounts ?? []} onRoleChange={changeRole} />

      <BankPicker
        banks={available.data}
        loading={available.isPending}
        onOpen={() => available.mutate(undefined, onError)}
        onConnect={(b) => connect.mutate({ name: b.name, country: b.country }, onError)}
      />

      <ReprocessCard
        busy={reprocess.isPending}
        onReprocess={() => {
          setMessage("");
          reprocess.mutate(undefined, onError);
        }}
      />

      <button type="button" className="btn" style={{ marginTop: 28 }} onClick={() => logout.mutate(undefined, onError)}>
        salir
      </button>
    </>
  );
}
