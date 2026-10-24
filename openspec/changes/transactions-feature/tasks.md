# Tasks

Refactor note: characterization tests must stay green with unchanged expectations after every task. Commit before
any mutation check.

## 1. Domain and shared formatting

- [ ] 1.1 Add `dayMonth` to `src/shared/format.ts` and `src/features/transactions/domain/transactions.ts` (`rowLabel`, `isCredit`, `categoryOptions`) test-first for the cases screen tests leave out (description and «—» fallbacks, «sin categoría», zero amount as debit); verify the domain tests pass

## 2. Port, hooks and screen

- [ ] 2.1 Add the `TransactionsApi` port and HTTP adapter, `TransactionsApiProvider`/`useTransactionsApi`, `useDebounced`, `useTransactions` (debounced, `keepPreviousData`), `useCategories` and `useUpdateTransaction` (invalidates the list), and wire the provider in `providers.tsx`; verify `pnpm typecheck` passes
- [ ] 2.2 Add `TransactionRow` and `TransactionsScreen` (with `MonthNav`), and make `src/app/(app)/movimientos/page.tsx` a thin route; verify every characterization test passes and mutation-check the screen (debounce delay and single request, list kept while loading, reload after an edit, category options, transfer dimming)

## 3. Docs and verification

- [ ] 3.1 Update the migration status in `openspec/config.yaml`; verify `pnpm check`, `pnpm typecheck`, `pnpm test`, `pnpm build` and CI pass, and the transactions endpoints answer through the proxy with a session on a throwaway stack (removed afterwards)

## Workflow follow-up

- Archive the change (`/opsx:archive`; no spec sync, `skip_specs: true`).
- Next change: `banks-feature` (removes `src/lib/api.ts`).
