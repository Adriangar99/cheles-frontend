import type { ComponentProps } from "react";
import { cx } from "./cx";

type Props = ComponentProps<"p"> & { kind: "error" | "status" | "note" };

// A message for the user: an error (announced at once), a status update, or a side note
export function Message({ kind, className, ...props }: Props) {
  const role = kind === "error" ? "alert" : kind;
  return <p className={cx(kind === "error" ? "err" : "sub", className)} role={role} {...props} />;
}
