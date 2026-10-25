import { useId } from "react";
import type { Account, Role } from "../api";
import { AccountRow } from "./AccountRow";

// Accounts whose connection is gone; their role can still be changed.
export function DetachedAccounts({
  accounts,
  onRoleChange,
}: {
  accounts: Account[];
  onRoleChange: (accountId: number, role: Role) => void;
}) {
  const headingId = useId();
  if (accounts.length === 0) return null;
  return (
    <section aria-labelledby={headingId}>
      <h2 id={headingId}>cuentas sin banco</h2>
      <ul className="card">
        {accounts.map((a) => (
          <AccountRow key={a.id} account={a} onRoleChange={(role) => onRoleChange(a.id, role)} />
        ))}
      </ul>
    </section>
  );
}
