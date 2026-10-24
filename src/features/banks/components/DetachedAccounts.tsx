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
  if (accounts.length === 0) return null;
  return (
    <section>
      <h2>cuentas sin banco</h2>
      <div className="card">
        {accounts.map((a) => (
          <AccountRow key={a.id} account={a} onRoleChange={(role) => onRoleChange(a.id, role)} />
        ))}
      </div>
    </section>
  );
}
