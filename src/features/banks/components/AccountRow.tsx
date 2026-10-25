import { useId } from "react";
import { money } from "@/shared/format";
import type { Account, Role } from "../api";
import { ROLE_LABEL } from "../domain/banks";

export function AccountRow({ account: a, onRoleChange }: { account: Account; onRoleChange: (role: Role) => void }) {
  const nameId = useId();
  return (
    <li className="row" aria-labelledby={nameId}>
      <div className="grow">
        <div className="ellipsis">
          <span id={nameId}>{a.name}</span>
          {a.iban_tail && <span className="muted"> ·· {a.iban_tail}</span>}
        </div>
        <div className="sub">{money(a.balance)}</div>
      </div>
      <select
        value={a.role}
        onChange={(e) => onRoleChange(e.target.value as Role)}
        aria-label="para qué es esta cuenta"
      >
        {Object.entries(ROLE_LABEL).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </li>
  );
}
