import type { ReactNode } from "react";
import { cx } from "./cx";

export type Tone = "pos" | "neg";

// A grid of figures: a definition list, so each value is found by its term
export function Figures({ children }: { children: ReactNode }) {
  return <dl className="stats">{children}</dl>;
}

type Props = { label: string; value: string; tone?: Tone; wide?: boolean; children?: ReactNode };

// One figure: its term (dt), its value (dd) with an optional tone, and any extra detail (more dd)
export function Figure({ label, value, tone, wide, children }: Props) {
  return (
    <div className={cx("card", "stat", wide && "wide")}>
      <dt className="label">{label}</dt>
      <dd className={cx("value", tone)} data-tone={tone}>
        {value}
      </dd>
      {children}
    </div>
  );
}
