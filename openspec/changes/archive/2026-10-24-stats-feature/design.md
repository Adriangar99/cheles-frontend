# Design

## Context

See proposal.md. After `feature-skeleton`: `src/shared/` holds the HTTP client, formatting, month arithmetic and
query client; `src/app/providers.tsx` wires `AuthApiProvider`; Biome enforces the boundaries; characterization tests
render screens through `renderScreen` with `fetch` stubbed. «mi mes» has 10 scenario tests plus the break-even
boundary, and two tests elsewhere (session expired, stale cookie) open it with a 401.

## Goals / Non-Goals

**Goals:** «mi mes» fully on the stats feature with unchanged behavior; reusable month navigation; no Vitest
exception left.

**Non-Goals:** migrating other screens; fixing silent failures or the UTC month.

## Decisions

### Layout
```
src/shared/MonthNav.tsx                 month state lives in the caller: <MonthNav month onChange />
src/features/stats/
  index.ts                              MyMonthScreen, StatsApiProvider, httpStatsApi, type StatsApi
  api.ts                                StatsApi port + httpStatsApi
  provider.tsx                          StatsApiProvider + useStatsApi()
  hooks.ts                              useSummary(month), useHistory()
  domain/charts.ts                      netTone, categoryBars, historyBars
  domain/charts.test.ts
  components/MyMonthScreen.tsx          month state + MonthNav + the three blocks
  components/MonthlyFigures.tsx
  components/SpendingByCategory.tsx
  components/HistoryChart.tsx
```
Types come from the generated schema (`SummaryOut`, `MonthTotalsOut`, `CategorySpendingOut`).

### MonthNav is controlled
It receives `month` and `onChange` and renders the same markup (`month-nav`, `aria-label` «mes anterior» / «mes
siguiente», `textTransform: capitalize`), disabling «mes siguiente» when `month === currentMonth()`. Keeping the state
in the screen lets transactions combine it with its search debounce later.

### Queries keep today's rendering
- `useSummary(month)`: key `["stats", "summary", month]`, with `placeholderData: keepPreviousData` — today the previous
  month's figures stay on screen until the new ones arrive; without it the cards would blink out on every navigation.
- `useHistory()`: key `["stats", "history", 12]`, independent of the month, so navigation never refetches it
  («Month navigation does not reload history»).
- A failed query renders nothing for that block, as today. The rejection no longer escapes (TanStack Query catches
  it), so `onUnhandledError` is removed from `vitest.config.mts`; any unhandled error fails the suite again.

### Domain: chart scaling as pure functions
`domain/charts.ts` returns plain data the components only render:
- `netTone(net)`: `"pos"` when `net >= 0`, else `"neg"`.
- `categoryBars(byCategory)`: each category with `widthPct = amount / max(1, …amounts) * 100`.
- `historyBars(points)`: each month with `incomePx`/`expensesPx = value / max(1, …values) * 70` and `label` (`MM`).

`charts.test.ts` covers only what screen tests do not reach: all-zero and empty inputs (the `max(1, …)` guard keeps
heights and widths at 0 instead of `NaN`). The rest is already characterized through the screen.

### No fake-adapter tests yet
`MyMonthScreen` has no behavior a screen test cannot reach cheaply, so the stats port is exercised only through the
HTTP adapter in the characterization tests. Fake adapters arrive with the first feature whose hooks carry logic.

## Risks / Trade-offs

- [`keepPreviousData` shows stale figures while loading] → It is the current behavior; changing it belongs in a UX
  change, not a refactor.
- [Removing the Vitest exception could surface a rejection elsewhere] → Only «mi mes» is opened with a 401 in the
  tests; if another screen does, the suite fails and points at it.

## Migration Plan

Code-only; rebuild the image. Rollback: revert the PR.
