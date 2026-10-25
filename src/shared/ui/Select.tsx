import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<"select">, "aria-label"> & { label: string };

// A select always has an accessible name, even without a visible label
export function Select({ label, ...props }: Props) {
  return <select aria-label={label} {...props} />;
}
