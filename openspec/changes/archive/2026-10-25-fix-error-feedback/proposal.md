# Proposal

## Why

Three defects recorded in `specs-base` and kept unchanged through the feature restructure:

- **The current month is computed in UTC**, so between 00:00 and 01:00/02:00 (Madrid) on the first day of a month the
  app still opens on the previous month.
- **Silent failures**: when «mi mes» or «movimientos» cannot load, or a category/⇄ change, connecting a bank or logging
  out fails, nothing tells the user; the screen stays empty or stale. Only some «bancos» actions show their error.
- **Detached accounts are hidden**: the API returns accounts that no longer belong to a connection, but «bancos»
  ignores them, so their role cannot be changed.

Now that every screen is a feature with TanStack Query, these are small, local fixes.

## What Changes

- `currentMonth()` uses the local date instead of UTC.
- «mi mes» shows the summary or history error below the month heading; «movimientos» shows load and edit errors below
  the search box; «bancos» also shows errors when its connections fail to load, connecting fails or logging out fails.
  Messages are the API's `detail`, or «Error <status>», as everywhere else.
- «bancos» lists detached accounts under «cuentas sin banco», with the role selector.
- API types re-synced from cheles-backend (`pnpm api:sync`) to pick up `kind_manual` and keep the contract current.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `locale-formatting`: the current month follows the local time zone.
- `monthly-overview`: new requirement for load errors.
- `transactions`: new requirement for load and edit errors.
- `bank-management`: action errors cover loading, connecting and logging out; new requirement for accounts without a
  bank.

## Impact

- **Features affected**: stats, transactions, banks; `src/shared/month.ts`.
- **Backend dependency**: consumes the contract of `fix-transfer-mark-and-eb-config` (`kind_manual`, 503 detail for a
  missing Enable Banking configuration); nothing here depends on it at runtime.
- **Security surface**: unchanged.
- **Dependencies**: none new.

### Out of scope

- Other recorded observations (validation errors shown as «[object Object]», 500-transaction cap, negative days left,
  reconnect country, sync result, persistent query params, unused backend features, proxied API headers).
- A retry button (the chosen design shows the message only).
