# Design

## Context

The backend takes `{"file": <base64>, "accounts": {<wallet>: <account id> | "new" | null}}` on both endpoints. Preview
answers per wallet (`name`, `rows`, `first_date`, `last_date`, `target`, `to_import`, `skipped`, `bank_since`,
`already_imported`, `adjustments`) plus `unmatched_categories` (`name`, `rows`); import answers `imported`, `skipped`,
`already_imported`.

## Decisions

### Flow
1. «elegir fichero» (a visually styled `<input type="file" accept=".csv,text/csv">` with a label) reads the file as
   bytes and base64 in the browser.
2. A first preview with every wallet sent to `new` (the default the owner is most likely to want for history).
3. Changing a wallet's selector requests the preview again (only the latest answer counts, TanStack Query keyed by
   the map).
4. «importar <n> movimientos» (disabled with nothing to import) posts the import, then invalidates banks, stats and
   transactions queries and shows «<n> movimientos importados ✓».
5. «cancelar» forgets the file.

### Where it lives
Feature `imports` with its own port, like the other features; «bancos» renders `ImportSection` from
`@/features/imports`, passing the accounts it already loaded (for the selector), so imports does not depend on banks.

### Copy
- Wallet line: «<wallet>», «<rows> movimientos · <first> – <last>» (dates as «5 may 2025»).
- Outcome under the selector: «entran <n>»; «<n> ya los trajo el banco (desde <date>)» when skipped; «<n> ya
  importados» when any; «<n> ajustes de saldo no se importan» when any; «no se importa» for «no importar».
- MoneyLover transfers arrive as ordinary movements (owner's choice); the section reminds it once under the wallets:
  «las transferencias de MoneyLover entran como ingresos y gastos; marca ⇄ las que sean entre tus cuentas».
- Unmatched: «sin equivalencia, irán por reglas: Ahorro (12), Invertir (3)».
- Errors from the API (unrecognized file, bad line, too large) are shown as they come.

## Risks / Trade-offs

- [Base64 grows the body by a third] → 1338 rows are ~150 KB; the backend caps at 5 MB.

## Migration Plan

Code-only. Rollback: revert the PR.
