# Design

## Context

See proposal.md. auth, stats and transactions are features; `src/lib/api.ts` is only imported by the banks page.
bank-management has 14 scenario tests (consent states, read now, reconnect, pick a bank, authorization results,
role change, reprocess, errors, logout) and the missing-amount test in locale-formatting uses this screen; the api-access
error tests trigger a failing reprocess here.

## Goals / Non-Goals

**Goals:** «bancos» on the banks feature with unchanged behavior; `src/lib/api.ts` deleted; architecture docs final.

**Non-Goals:** behavior fixes (detached accounts, silent connect/logout failures); new account edits.

## Decisions

### Layout
```
src/features/banks/
  index.ts                       BanksScreen, BanksApiProvider, httpBanksApi, type BanksApi
  api.ts                         BanksApi port + httpBanksApi
  provider.tsx                   BanksApiProvider + useBanksApi()
  hooks.ts                       useBanks, useAvailableBanks, useConnectBank, useSyncConnection, useReprocess, useSetRole
  domain/banks.ts                consentStatus, lastReadLabel, errorExcerpt, ROLE_LABEL, authorizationMessage
  domain/banks.test.ts
  components/BanksScreen.tsx
  components/ConnectionCard.tsx
  components/BankPicker.tsx
  components/ReprocessCard.tsx
```

### Actions as mutations that wait for the reload
Today `run(key, fn)` sets the busy key, clears the message, awaits the action, then awaits `load()`, and only then
clears the busy key. Each action mutation (`useSyncConnection`, `useReprocess`, `useSetRole`) returns
`queryClient.invalidateQueries({ queryKey: ["banks"] })` from `onSuccess`, so `isPending` lasts until the list has
been refetched. The busy state per connection comes from `isPending && variables === connection.id`.

### The message stays in the screen
`BanksScreen` owns `message`: initialized from the authorization result (`authorizationMessage(location.search)`, read
in an effect as now), cleared when a sync, reprocess or role change starts, and set to the error message when one of
them or the picker fails. Opening the picker does not clear it. The mutations receive these as `onMutate`/`onError`
callbacks at call time.

### The picker is an on-demand mutation
`useAvailableBanks()` is a mutation (`mutationFn: api.available`): the list is fetched only when «conectar un banco»
is tapped, `isPending` disables the button, and its `data` replaces the button with the list, as now.

### Connect and logout keep their silent failures
`useConnectBank()` sets `window.location.href` to the returned URL on success and has no error handler, like the
current unhandled `async` click. «salir» calls `useLogout().mutate()` from the auth entry point.

### Domain
- `consentStatus(connection, now)`: `{ tone: "neg" | "pos", text }`; not active → «hay que reconectar»; otherwise
  `days = ceil((valid_until − now) / 1 day)`, «caduca en <days> días» when `days < 14`, else «al día · <days> días de
  permiso».
- `lastReadLabel(lastSyncedAt)`: «leído el <dayMonthTime>» or «sin leer aún».
- `errorExcerpt(error)`: first 120 characters.
- `ROLE_LABEL`: main «día a día», savings «ahorro», excluded «no cuenta».
- `authorizationMessage(search)`: «banco conectado ✓» for `connected`, «no se pudo conectar el banco» for `error`
  (the latter wins when both are present, as the current sequential `if`s do).

`domain/banks.test.ts` covers what screen tests leave out: exactly 14 days is healthy, a `revoked` connection needs
reconnecting, and both query parameters at once.

### Removing `src/lib/api.ts`
After the banks page stops importing it, nothing does; it is deleted and the Biome restriction messages drop `@/lib`.
The README architecture section loses the transitional note.

## Risks / Trade-offs

- [Mutation timing differs from `run()`] → «Read now», «Reprocess» and «Message cleared by the next action» assert the
  busy labels and reload counts; mutation-check `onSuccess` awaiting the refetch.
- [Error precedence for authorization results] → Unit-tested explicitly.

## Migration Plan

Code-only; rebuild the image. Rollback: revert the PR.
