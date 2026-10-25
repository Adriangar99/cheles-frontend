import { Amount, Stamp } from "@/shared/ui";
import type { Banks } from "../api";
import { banksSummary } from "../domain/banks";

// What the accounts that count add up to, and whether any bank needs attention
export function BanksSummary({ banks, now }: { banks: Banks; now: number }) {
  const summary = banksSummary(banks, now);
  if (!summary) return null;
  return (
    <section aria-label="resumen" className="card summary">
      <div className="summary-total">
        <Amount value={summary.total} />
        <span className="sub">{summary.accounts}</span>
      </div>
      <Stamp tone={summary.attention.tone}>{summary.attention.text}</Stamp>
    </section>
  );
}
