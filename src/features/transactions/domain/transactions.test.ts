import { category, tx } from "@tests/screens";
import { expect, test } from "vitest";
import { categoryOptions, isCredit, rowLabel } from "./transactions";

// Screen tests cover the title, the bank detail and the options of a categorized credit; these cover the rest.

test("a transaction without title is labeled «—»", () => {
  expect(rowLabel(tx({ title: "" }))).toBe("—");
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
