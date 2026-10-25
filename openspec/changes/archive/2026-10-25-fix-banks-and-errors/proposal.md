# Proposal

## Why

Frontend fixes for block 2 of the roadmap, recorded in `specs-base`, plus the screens for the new backend capabilities
of `connection-lifecycle` and `stats-accuracy`:

- **Validation errors render as «[object Object]»**: a 422 `detail` is a list.
- **Negative days left**: an active connection whose consent date has passed shows «caduca en -3 días».
- **Reconnect hardcodes country «ES»** (a Revolut connection from `LT` would be re-authorized in the wrong country).
- **`?connected=1` / `?error=1` stay in the address**, so reloading shows the message again.
- New: removing a connection (`DELETE /api/banks/{id}`) and the warning for amounts in other currencies
  (`other_currencies`).

## What Changes

- `call()` maps a list `detail` to «Datos no válidos».
- The consent status treats a passed consent date as «hay que reconectar» and offers «reconectar».
- «reconectar» uses the connection's `country`.
- The authorization result parameter is removed with `history.replaceState` after reading it.
- «quitar» per connection, with a confirmation dialog.
- «mi mes» shows «No se cuentan importes en USD» when the summary reports other currencies.
- `pnpm api:sync` after both backend changes are merged.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `api-access`: validation errors get a readable message.
- `bank-management`: passed consent dates, reconnect country, clean address after the result, removing a connection.
- `monthly-overview`: other currencies warning.

## Impact

- **Features affected**: banks, stats, shared API client.
- **Backend dependency**: `connection-lifecycle` (`country`, `DELETE /api/banks/{id}`) and `stats-accuracy`
  (`other_currencies`) must be merged first; this change syncs the contract.
- **Security surface**: unchanged.

### Out of scope

- Blocks 3–7.
