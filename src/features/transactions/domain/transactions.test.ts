import { expect, test } from "vitest";
import { category, tx } from "../../../../tests/screens";
import { categoryOptions, isCredit, rowLabel } from "./transactions";

// Screen tests cover the counterparty label and the options of a categorized credit; these cover the rest.

test("a transaction without counterparty is labeled by its description", () => {
  expect(rowLabel(tx({ counterparty: null, description: "RECIBO LUZ" }))).toBe("RECIBO LUZ");
});

test("a transaction without counterparty or description is labeled «—»", () => {
  expect(rowLabel(tx({ counterparty: null, description: "" }))).toBe("—");
});

test("an uncategorized debit offers «sin categoría» and the expense categories", () => {
  const supermercado = category({ id: 1, kind: "expense" });
  const nomina = category({ id: 2, kind: "income", name: "Nómina" });

  expect(categoryOptions(tx({ amount: -5, category_id: null }), [supermercado, nomina])).toEqual({
    uncategorized: true,
    options: [supermercado],
  });
});

test("a zero amount counts as a debit", () => {
  expect(isCredit(tx({ amount: 0 }))).toBe(false);
});
