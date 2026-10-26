# Proposal

## Why

- Rows in «movimientos» are labeled by the counterparty or the whole bank description, which for many BBVA movements
  is unreadable (`PAGO CON TARJETA EN GASOLINERAS // PAGO CON TARJETA // ACME FUEL …`). The API now sends a readable
  `title` for every transaction (cheles-backend #32).
- Texts cut with an ellipsis (transaction rows, account names, category names, the category selector) cannot be read
  in full anywhere: hovering them shows nothing.
- Connecting a bank now answers before its first sync (cheles-backend #30), so «bancos» shows a new connection as
  «Sin leer aún» while its history is still being read, and does not update when it ends.

## What Changes

- «movimientos»: each row is labeled by `title` (or «—»); under it, in grey, the bank's description when it differs
  from the title; then the account line as today.
- Every text cut with an ellipsis shows its full text on hover: the title and description of a transaction, its
  category selector, the account name in «bancos» and the category name in «mi mes».
- «bancos»: an active connection that has never been read shows «Sincronizando…», and the screen reloads every 5
  seconds until its first sync ends (for at most 10 minutes).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `transactions`: row title and bank detail; full text on hover.
- `bank-management`: «Sincronizando…» for the first sync; full account name on hover.
- `monthly-overview`: full category name on hover.

## Impact

- **Features affected**: transactions, banks, stats; a new shared UI component for truncated text.
- **API dependency**: the `title` field (cheles-backend #44, merged); `openapi/cheles-api.json` and the generated
  types are synced from it.
- **Security surface**: none.

### Out of scope

- A way to read the full text on touch screens (no hover there).
- Searching by title (the API still searches counterparty and description).
- Any change to the manual sync button («Leer ahora»).
