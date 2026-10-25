import type { ReactNode } from "react";
import { cx } from "./cx";

export type Tone = "pos" | "neg";

// A sheet of figures, one ledger line each: a definition list, so each value is found by its term
export function Figures({ children }: { children: ReactNode }) {
  return <dl className="card ledger">{children}</dl>;
}

type Props = { label: string; value: string; tone?: Tone; total?: boolean; children?: ReactNode };

// One ledger line: its term (dt), its value (dd) with an optional tone, and any extra detail (more dd).
// `total` closes the sheet under a double rule.
export function Figure({ label, value, tone, total, children }: Props) {
  return (
    <div className={cx("line", total && "total")}>
      <dt>{label}</dt>
      <dd className={cx("value", tone)} data-tone={tone}>
        {value}
      </dd>
      {children}
    </div>
  );
}
