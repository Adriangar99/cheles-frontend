import { answer, type FakeState } from "@/shared/fakeState";
import type { ImportPreview, ImportsApi, Targets } from "./api";

const WALLETS = [
  { name: "Cuenta Principal", rows: 1065, first_date: "2025-05-05", last_date: "2026-10-25", adjustments: 16 },
  { name: "Revolut", rows: 105, first_date: "2026-01-15", last_date: "2026-10-20", adjustments: 3 },
];

// The preview the API would give: onto account 1 the bank already has rows since July 2026
function preview(accounts: Targets): ImportPreview {
  return {
    wallets: WALLETS.map((w) => {
      const target = accounts[w.name] ?? null;
      const onBank = target === 1;
      const counted = target === null ? 0 : w.rows - w.adjustments;
      return {
        ...w,
        target,
        to_import: onBank ? counted - 300 : counted,
        skipped: onBank ? 300 : 0,
        bank_since: onBank ? "2026-07-01" : null,
        already_imported: 0,
      };
    }),
    unmatched_categories: [
      { name: "Ahorro", rows: 7 },
      { name: "Invertir", rows: 19 },
      { name: "Transferencia entrante", rows: 159 },
    ],
  };
}

// An in-memory ImportsApi for stories; «error» rejects the file like the API does
export function fakeImportsApi(state: FakeState = "loaded"): ImportsApi {
  return {
    preview: ({ accounts }) =>
      state === "error"
        ? Promise.reject(new Error("No reconozco este fichero: falta la columna Cuenta"))
        : answer(state, preview(accounts), preview({})),
    run: ({ accounts }) => {
      const imported = preview(accounts).wallets.reduce((sum, w) => sum + w.to_import, 0);
      const result = { imported, skipped: 0, already_imported: 0, adjustments: 19 };
      return answer("loaded", result, result);
    },
  };
}
