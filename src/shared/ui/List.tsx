import type { ComponentProps } from "react";
import { cx } from "./cx";

// A card whose content is a list of rows
export function List({ className, ...props }: ComponentProps<"ul">) {
  return <ul className={cx("card", className)} {...props} />;
}

type ItemProps = ComponentProps<"li"> & { muted?: boolean };

// A row of a List; `muted` for placeholders such as an empty state
export function ListItem({ muted, className, ...props }: ItemProps) {
  return <li className={cx("row", muted && "muted", className)} {...props} />;
}
