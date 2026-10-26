import type { ComponentProps, ReactNode } from "react";
import { cx } from "./cx";

type Props = Omit<ComponentProps<"div">, "title" | "children"> & {
  // The whole text, shown on hover; also the content unless children are given
  text: string;
  children?: ReactNode;
  as?: "div" | "span";
};

// Text cut with an ellipsis when it does not fit, which still shows in full on hover
export function Truncated({ text, children, as: Tag = "div", className, ...props }: Props) {
  return (
    <Tag className={cx("ellipsis", className)} title={text} {...props}>
      {children ?? text}
    </Tag>
  );
}
