import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<"select">, "aria-label"> & { label: string };

// A select always has an accessible name, even without a visible label. The native control loses its look and
// gets a drawn chevron, so it lines up with buttons in every browser.
export function Select({ label, ...props }: Props) {
  return (
    <span className="select">
      <select aria-label={label} {...props} />
      <svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
        <path d="M2.5 4.5 6 8l3.5-3.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    </span>
  );
}
