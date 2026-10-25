import { useId } from "react";
import { Amount, ListItem, Select } from "@/shared/ui";
import type { Account, Role } from "../api";
import { parseRole, ROLE_LABEL } from "../domain/banks";

export function AccountRow({ account: a, onRoleChange }: { account: Account; onRoleChange: (role: Role) => void }) {
  const nameId = useId();
  return (
    <ListItem aria-labelledby={nameId}>
      <div className="grow">
        <div className="ellipsis">
          <span id={nameId}>{a.name}</span>
          {a.iban_tail && <span className="muted"> ·· {a.iban_tail}</span>}
        </div>
        <div className="sub">
          <Amount value={a.balance} />
        </div>
      </div>
      <Select value={a.role} onChange={(e) => onRoleChange(parseRole(e.target.value))} label="Para qué es esta cuenta">
        {Object.entries(ROLE_LABEL).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </Select>
    </ListItem>
  );
}
