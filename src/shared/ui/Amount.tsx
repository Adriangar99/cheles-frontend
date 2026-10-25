import { money } from "../format";
import { cx } from "./cx";
import type { Tone } from "./Figure";

type Props = { value: number | null | undefined; tone?: Tone; as?: "span" | "div" };

// An amount of money in euros (es-ES), with an optional tone
export function Amount({ value, tone, as: Tag = "span" }: Props) {
  return (
    <Tag className={cx("tx-amount", tone)} data-tone={tone}>
      {money(value)}
    </Tag>
  );
}
