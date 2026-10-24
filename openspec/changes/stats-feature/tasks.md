# Tasks

Refactor note: characterization tests must stay green with unchanged expectations after every task. Commit before
any mutation check.

## 1. Shared month navigation

- [x] 1.1 Extract `src/shared/MonthNav.tsx` (controlled: `month`, `onChange`) and use it from «mi mes»; verify the monthly-overview and locale-formatting tests pass

## 2. stats feature

- [x] 2.1 Add `src/features/stats/` port and HTTP adapter (`api.ts`), `StatsApiProvider`/`useStatsApi`, `useSummary` (with `keepPreviousData`) and `useHistory`, and wire the provider in `providers.tsx`; verify `pnpm typecheck` passes
- [x] 2.2 Add `domain/charts.ts` (`netTone`, `categoryBars`, `historyBars`) test-first for the zero/empty guards in `domain/charts.test.ts`; verify the domain tests pass
- [x] 2.3 Add the components and `MyMonthScreen`, make `src/app/(app)/page.tsx` a thin route and remove `onUnhandledError` from `vitest.config.mts`; verify every characterization test passes with no unhandled errors and mutation-check the domain and screen (net tone, bar scales, previous data kept while loading, history not refetched)

## 3. Docs and verification

- [x] 3.1 Update the migration status in `openspec/config.yaml`; verify `pnpm check`, `pnpm typecheck`, `pnpm test`, `pnpm build` and CI pass, and «mi mes» loads in Docker after logging in (`/api/stats/summary` and `/api/stats/history` through the proxy)

## Workflow follow-up

- Archive the change (`/opsx:archive`; no spec sync, `skip_specs: true`).
- Next change: `transactions-feature` (reuses `MonthNav`).
