# Design

## Context

See proposal.md. Every screen is a feature: `MyMonthScreen` (stats), `TransactionsScreen` (transactions) and
`BanksScreen` (banks) read TanStack Query hooks; `BanksScreen` already owns a `message` with clearing rules. The HTTP
client throws `Error(detail ?? "Error <status>")` and redirects on 401. `currentMonth()` is
`shiftMonth(new Date().toISOString().slice(0, 7), 0)`.

## Goals / Non-Goals

**Goals:** local current month; every failed load or action visible; detached accounts editable.

**Non-Goals:** retry buttons; other observations.

## Decisions

### Local current month
`currentMonth()` builds `YYYY-MM` from `getFullYear()`/`getMonth()` of `new Date()`. The characterization tests run in
`Europe/Madrid` (set in `vitest.config.mts`), so the new scenario freezes the clock at `2026-10-31T23:30:00Z`.

### Errors derived from query state, not stored
- «mi mes»: `summary.error ?? history.error` rendered as `<p className="err">` under `MonthNav`. Changing the month
  creates a new summary query, so a previous month's error disappears by itself once the new one loads. With
  `keepPreviousData` the previous figures stay visible on a failed month, as for a slow one; the error tells the user
  they are stale. On the first load there is no previous data, so «Summary unavailable» shows no figures.
- «movimientos»: `transactions.error` (load) and `update.error` (edit, reset by TanStack Query when the next mutation
  starts) under the search box; load error first.
- «bancos»: the existing `message` gains `banks.error` as a fallback when nothing else is shown, and `connect` and
  `logout` receive the same `onError` as the other actions without clearing the message first.

Messages use the existing `err` class (red, as on the login page); «bancos» keeps its current `sub` message styling.

### A 401 is not an error to show
The HTTP client already redirects to `/login` before throwing «No autenticado». The screens skip errors with that
message so it does not flash before the navigation.

### Accounts without a bank
The account row (`AccountRow`: name, IBAN tail, balance, role selector) is extracted from `ConnectionCard` and reused
by a `DetachedAccounts` section rendered after the connections when `detached_accounts` is not empty.

### Contract sync
`pnpm api:sync` after the backend change merges; `src/shared/api/schema.d.ts` gains `kind_manual`. No code uses it in
this change.

## Risks / Trade-offs

- [Stale figures shown with an error after a failed month change] → Accepted: the message says so; clearing them would
  make a transient failure blank the screen.
- [Skipping «No autenticado» by message text] → The same literal the client throws; covered by the session-expired
  tests (no message rendered before the redirect).

## Migration Plan

Code-only; rebuild the image. Rollback: revert the PR.
