import type { ReactNode } from "react";
import type { Tone } from "./Figure";

// A status stamped like a branch stamp in a passbook: bordered, in credit or stamp ink
export function Stamp({ tone, children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={tone ? `stamp ${tone}` : "stamp"} data-tone={tone}>
      {children}
    </span>
  );
}
