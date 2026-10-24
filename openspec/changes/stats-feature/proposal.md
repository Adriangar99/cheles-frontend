# Proposal

## Why

«mi mes» (`src/app/(app)/page.tsx`) is the largest screen still on the transitional `src/lib/api.ts`: it loads the
summary and history with `useEffect`, computes chart scales inline and mixes four blocks of markup in one route
file. Moving it to a `stats` feature, the second of the feature migration after `feature-skeleton`, puts its
rules in a pure domain module, its data behind the `StatsApi` port with TanStack Query, and leaves the route as a
one-liner.

## What Changes

- **Shared month navigation**: `MonthNav` (previous button, capitalized month heading, next button disabled on the
  current month) moves to `src/shared/MonthNav.tsx`, since the transactions screen uses the same navigation. Only
  «mi mes» uses it in this change; transactions switches in its own change.
- **stats feature** (`src/features/stats/`):
  - `StatsApi` port (`summary(month)`, `history(months)`) with an HTTP adapter, `StatsApiProvider`/`useStatsApi`,
    wired in `src/app/providers.tsx`.
  - Query hooks `useSummary(month)` and `useHistory()`.
  - `domain/`: the net tone (green when zero or positive), category bar widths relative to the largest category, and
    history bar heights scaled to 70 px against the largest value, with the current guards (never dividing by zero).
  - Components for the figures, the spending breakdown and the history chart, composed by `MyMonthScreen`.
- `src/app/(app)/page.tsx` renders `MyMonthScreen`.
- The Vitest exception for the unhandled «No autenticado» rejection is removed: queries handle the rejection, and no
  other screen in the characterization tests hits a 401.
- `openspec/config.yaml`: migration status.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None (`skip_specs: true`): no user-visible behavior changes.

## Impact

- **Features affected**: stats (monthly-overview screen); shared month navigation added.
- **Backend dependency**: none; same `GET /api/stats/summary?month=` and `GET /api/stats/history?months=12`.
- **Security surface**: unchanged.
- **Dependencies**: none new.

### Out of scope

- Migrating transactions and banks (next changes) and removing `src/lib/api.ts`.
- Behavior fixes from the `specs-base` observations: a failed summary still renders nothing (silent), and the
  current month is still derived in UTC.
