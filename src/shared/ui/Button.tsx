import type { ComponentProps } from "react";
import { cx } from "./cx";

type Props = ComponentProps<"button"> & { variant?: "default" | "primary" };

// A plain button by default (never an accidental form submit)
export function Button({ variant = "default", type = "button", className, ...props }: Props) {
  return <button type={type} className={cx("btn", variant === "primary" && "primary", className)} {...props} />;
}
