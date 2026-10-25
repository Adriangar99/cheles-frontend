import type { ComponentProps } from "react";
import { cx } from "./cx";

// A surface that groups content
export function Card({ className, ...props }: ComponentProps<"div">) {
  return <div className={cx("card", className)} {...props} />;
}
