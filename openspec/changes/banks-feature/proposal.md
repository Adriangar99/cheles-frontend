# Proposal

## Why

«bancos» (`src/app/(app)/bancos/page.tsx`) is the last screen on the transitional `src/lib/api.ts`. It runs every
action through a hand-written `run()` that tracks a busy key, clears and sets a message and reloads the screen, and
it computes the consent status, the last-read label and the authorization result inline. Migrating it to a `banks`
feature finishes the restructure that started with `feature-skeleton`: every screen is then a feature behind its
port, and `src/lib/api.ts` can be deleted.

## What Changes

- **banks feature** (`src/features/banks/`):
  - `BanksApi` port (`list`, `available`, `connect`, `sync`, `reprocess`, `setRole`) with an HTTP adapter,
    `BanksApiProvider`/`useBanksApi`, wired in `src/app/providers.tsx`.
  - Hooks: `useBanks()` and mutations for sync, reprocess and role change that refetch the screen's data before they
    finish (so «leyendo…» and «…» last until the reload, as now), `useAvailableBanks()` loaded on demand, and
    `useConnectBank()` that sends the browser to the authorization URL.
  - `domain/`: the consent status of a connection («hay que reconectar» / «caduca en <n> días» / «al día · <n> días de
    permiso», with whole days rounded up), the last-read label («leído el 23 oct, 19:00» / «sin leer aún»), the error
    excerpt (120 characters), the role labels, and the message for an authorization result (`?connected=1` /
    `?error=1`).
  - Components for a connection (status, read now or reconnect, accounts with their role selector), the bank picker,
    the reprocess card and `BanksScreen`, which keeps the message rules (sync, reprocess and role change clear it;
    opening the picker does not).
- **Logout through the auth feature**: «salir» uses `useLogout` from `@/features/auth`.
- **Shared formatting**: the sync timestamp format («23 oct, 19:00») joins `src/shared/format.ts` as `dayMonthTime`.
- `src/app/(app)/bancos/page.tsx` renders `BanksScreen`.
- **End of the transition**: `src/lib/api.ts` is deleted, the Biome rules stop mentioning `@/lib`, and the README and
  `openspec/config.yaml` describe the finished architecture.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None (`skip_specs: true`): no user-visible behavior changes.

## Impact

- **Features affected**: banks screen; logout now goes through auth.
- **Backend dependency**: none; same endpoints.
- **Security surface**: unchanged (same authorization redirect and logout).
- **Dependencies**: none new.

### Out of scope

- Behavior fixes from the `specs-base` observations: detached accounts stay hidden, and a failed connect or logout
  stays silent (today the rejection is swallowed; the mutation keeps it so).
- Editing account alias or IBAN (`AccountPatch` allows it; the screen does not offer it).
