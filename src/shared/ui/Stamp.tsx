import type { ReactNode } from "react";
import type { Tone } from "./Figure";

// A short status as a label: a soft tint of credit or stamp ink with a dot
export function Stamp({ tone, children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={tone ? `stamp ${tone}` : "stamp"} data-tone={tone}>
      {children}
    </span>
  );
}
