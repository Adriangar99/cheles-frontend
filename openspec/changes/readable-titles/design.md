# Design

## Context

See proposal.md. Truncation is the global `.ellipsis` class (overflow hidden, ellipsis, no wrap), used in
`TransactionRow`, `AccountRow` and `SpendingByCategory`; the native category `<select>` also truncates its value with
`text-overflow`. `rowLabel` (transactions domain) picks counterparty, description or «—». `lastReadLabel` (banks
domain) shows «Sin leer aún» when `last_synced_at` is null. `useBanks` is a plain TanStack Query.

## Goals / Non-Goals

**Goals:** readable rows; the full text of any truncated text on hover; a new connection that tells it is syncing and
updates itself.

**Non-Goals:** custom tooltips (the native `title` attribute is enough on the Mac the app runs on); touch support.

## Decisions

### `Truncated` in `src/shared/ui`
A small component that renders its text (or children) with the `ellipsis` class and the full text in `title`, as a
`div` or a `span`. It always sets `title`, not only when the text overflows: measuring would need a resize observer for
no visible gain, and a tooltip equal to the visible text is harmless. Used in `TransactionRow`, `AccountRow` and
`SpendingByCategory`. `Select` already forwards props, so the transaction row passes the selected category's label as
its `title`.

### Row label and detail in the transactions domain
`rowLabel(tx)` becomes `tx.title || "—"`. `rowDetail(tx)` returns the description when it is non-empty and differs
from the title, otherwise null; the row shows it as a grey `sub` line above the account line.

### Syncing state in the banks domain
`lastReadLabel(connection)` returns «Sincronizando…» for an active connection without `last_synced_at`, «Sin leer aún»
for an inactive one, and «Leído el …» otherwise. `firstSyncPending(banks)` tells whether any connection is in that
state; `useBanks` uses it as `refetchInterval` (5 s), and stops after 120 reloads (10 minutes) so a first sync that
failed without recording anything does not poll forever.

## Risks / Trade-offs

- [The first sync fails without setting `last_synced_at`] → «Sincronizando…» stays until the next scheduled sync
  updates the connection; polling stops after 10 minutes.

## Migration Plan

No data changes. Sync the API copy (`pnpm api:sync`). Rollback: revert the PR.
