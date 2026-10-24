# Proposal

## Why

«movimientos» (`src/app/(app)/movimientos/page.tsx`) is the second-to-last screen on the transitional
`src/lib/api.ts`. It debounces the month and search with a timer effect, reloads the list by hand after every edit,
and keeps the rules for which categories a transaction can take, how its row is labeled and when it counts as a
credit inline in the markup. Moving it to a `transactions` feature, after `stats-feature`, gives those rules a pure
domain module, puts the list, categories and edits behind the `TransactionsApi` port with TanStack Query, and reuses
the shared `MonthNav`.

## What Changes

- **transactions feature** (`src/features/transactions/`):
  - `TransactionsApi` port (`list({ month, q })`, `categories()`, `update(id, patch)`) with an HTTP adapter,
    `TransactionsApiProvider`/`useTransactionsApi`, wired in `src/app/providers.tsx`.
  - Hooks: `useTransactions(month, q)` (up to 500, previous list kept while loading), `useCategories()`, and
    `useUpdateTransaction()`, whose success refetches the list (as the manual reload does today).
  - 250 ms debounce of month and search together (`useDebounced`), so typing quickly makes one request.
  - `domain/`: the row label (counterparty, else description, else «—»), whether an amount is a credit, and the
    category options of a transaction (categories of its sign, plus its current one when of the other kind, plus
    «sin categoría» when it has none).
  - Components: the transaction row (category selector and ⇄ toggle, dimmed transfers) and `TransactionsScreen`
    with `MonthNav`, the «buscar…» box, the count and the list.
- **Shared formatting**: the short transaction date («3 oct») joins `src/shared/format.ts` as `dayMonth`.
- `src/app/(app)/movimientos/page.tsx` renders `TransactionsScreen`.
- `openspec/config.yaml`: migration status.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None (`skip_specs: true`): no user-visible behavior changes.

## Impact

- **Features affected**: transactions screen; shared formatting gains `dayMonth`.
- **Backend dependency**: none; same `GET /api/transactions`, `GET /api/categories`, `PATCH /api/transactions/{id}`.
- **Security surface**: unchanged.
- **Dependencies**: none new.

### Out of scope

- Migrating banks and removing `src/lib/api.ts` (next change).
- Backend or behavior changes, including the ⇄ manual-mark defect recorded for the backend.
- Using the API's other `TxPatch` fields (`clear_category`, `note`); the screen does not offer them today.
