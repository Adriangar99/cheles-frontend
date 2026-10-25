import type { ComponentProps } from "react";
import { cx } from "./cx";

type Props = ComponentProps<"button"> & {
  // primary: the screen's main action; quiet: a text-only secondary action
  variant?: "default" | "primary" | "quiet";
  size?: "default" | "small";
};

// A plain button by default (never an accidental form submit)
export function Button({ variant = "default", size = "default", type = "button", className, ...props }: Props) {
  return (
    <button
      type={type}
      className={cx("btn", variant !== "default" && variant, size === "small" && "small", className)}
      {...props}
    />
  );
}
