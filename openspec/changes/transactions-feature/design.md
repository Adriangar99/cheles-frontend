# Design

## Context

See proposal.md. `src/shared/` has the HTTP client, formatting, month arithmetic, query client and `MonthNav`; auth
and stats are features wired in `src/app/providers.tsx`. The transactions screen has 8 scenario tests (search,
debounce, pending debit, empty month, change category, credit options, mark/unmark transfer) plus the
transaction-date test in locale-formatting.

## Goals / Non-Goals

**Goals:** «movimientos» on the transactions feature with unchanged behavior; its rules as pure, unit-tested domain
functions where screen tests do not reach.

**Non-Goals:** banks; behavior or backend changes; new edit fields.

## Decisions

### Layout
```
src/features/transactions/
  index.ts                          TransactionsScreen, TransactionsApiProvider, httpTransactionsApi, type TransactionsApi
  api.ts                            TransactionsApi port + httpTransactionsApi
  provider.tsx                      TransactionsApiProvider + useTransactionsApi()
  hooks.ts                          useDebounced, useTransactions, useCategories, useUpdateTransaction
  domain/transactions.ts            rowLabel, isCredit, categoryOptions
  domain/transactions.test.ts
  components/TransactionsScreen.tsx
  components/TransactionRow.tsx
```
Types come from the generated schema (`TransactionOut`, `CategoryOut`, `TxPatch`).

### The debounce covers month and search together
Today one effect waits 250 ms after either changes, including on the first render. `TransactionsScreen` keeps
`month` and `query` in state (so `MonthNav` and the input respond at once) and passes the debounced pair to
`useTransactions`. `useDebounced(value, 250)` returns `undefined` until the value has been stable for 250 ms and the
list query is disabled while it is `undefined`, so the first load is delayed exactly as now and quick typing makes a
single request. The characterization tests count requests and fail if this drifts.
It compares by content (JSON): with identity comparison a fresh `{ month, q }` object on every render would restart
the timer after each settle and re-render the screen every 250 ms.

### Queries and the reload after an edit
- `useTransactions(month, q)`: key `["transactions", month, q]`, `limit: 500`, `placeholderData: keepPreviousData` —
  today the previous list and count stay until the new ones arrive.
- `useCategories()`: key `["categories"]`, loaded once.
- `useUpdateTransaction()`: `mutationFn: ({ id, patch }) => api.update(id, patch)`; on success it invalidates
  `["transactions"]`, which refetches the visible list once, like the manual `load()`. The category selector sends
  `{ category_id }` and the ⇄ buttons `{ kind }`, as now.

### Domain
- `rowLabel(tx)`: `counterparty || description || "—"`.
- `isCredit(tx)`: `amount > 0` (drives the green amount and the category kind).
- `categoryOptions(tx, categories)`: `{ uncategorized: boolean, options: Category[] }` — categories whose kind matches
  the sign, then the current category if it is of the other kind; `uncategorized` when the transaction has none.

`domain/transactions.test.ts` covers what the screen tests leave out: the description and «—» fallbacks, «sin
categoría» for an uncategorized transaction, and that a zero amount counts as a debit. The rest stays characterized
through the screen.

### Shared `dayMonth`
`dayMonth(date)` formats with `toLocaleDateString("es-ES", { day: "numeric", month: "short" })` exactly as the row
does today, including parsing the ISO date as `new Date(date)`.

## Risks / Trade-offs

- [Debounce semantics drift with the query library] → Request-counting tests (search, typing quickly) guard it;
  mutation-check the delay and the enabled gate.
- [Invalidation could refetch more than today] → Only the active list query matches `["transactions"]`; categories
  are not invalidated.

## Migration Plan

Code-only; rebuild the image. Rollback: revert the PR.
