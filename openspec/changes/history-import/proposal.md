# Proposal

## Why

Block 7 of the roadmap, frontend half. The backend change `history-import` reads a MoneyLover export and offers a
preview and an import; the owner chose to do it from «bancos», seeing what will happen before confirming.

## What Changes

- A new feature `imports` (port, HTTP adapter, provider, hooks, fake adapter, components) for
  `POST /api/imports/preview` and `POST /api/imports`.
- In «bancos», a section «importar movimientos»: choose a CSV, see one line per MoneyLover wallet with a selector of
  where it goes (a new account named after it, an existing account, or «no importar») and what would happen (rows to
  import, rows the bank already has since a date, rows imported before), the categories without an equivalent, and
  confirm.
- After importing, the screen reloads its banks (new accounts appear under «cuentas sin banco») and shows the result.

## Capabilities

### New Capabilities

- `history-import`: the import section of «bancos».

### Modified Capabilities

None.

## Impact

- **Features affected**: `banks` composes the new section through `@/features/imports`.
- **Backend dependency**: the backend change `history-import` (endpoints and `openapi.json`).
- **Security surface**: the file is read in the browser and sent as base64 to the API; nothing is kept.

### Out of scope

- Other formats; editing category equivalences.
