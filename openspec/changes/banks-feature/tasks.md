# Tasks

Refactor note: characterization tests must stay green with unchanged expectations after every task. Commit before
any mutation check.

## 1. Domain and shared formatting

- [ ] 1.1 Add `dayMonthTime` to `src/shared/format.ts` and `src/features/banks/domain/banks.ts` (`consentStatus`, `lastReadLabel`, `errorExcerpt`, `ROLE_LABEL`, `authorizationMessage`) test-first for the cases screen tests leave out (exactly 14 days, revoked connection, both query parameters); verify the domain tests pass

## 2. Port, hooks and screen

- [ ] 2.1 Add the `BanksApi` port and HTTP adapter, `BanksApiProvider`/`useBanksApi`, and the hooks (`useBanks`, `useAvailableBanks`, `useConnectBank`, `useSyncConnection`, `useReprocess`, `useSetRole`, the action mutations awaiting the refetch), and wire the provider in `providers.tsx`; verify `pnpm typecheck` passes
- [ ] 2.2 Add `ConnectionCard`, `BankPicker`, `ReprocessCard` and `BanksScreen` (message rules, logout through `useLogout`), and make `src/app/(app)/bancos/page.tsx` a thin route; verify every characterization test passes and mutation-check the screen (busy until reload, message cleared on actions but not on the picker, authorization message, consent thresholds, connect URL, logout)

## 3. End of the transition

- [ ] 3.1 Delete `src/lib/api.ts`, drop `@/lib` from the Biome rules and the transitional notes from the README and `openspec/config.yaml`; verify `pnpm check`, `pnpm typecheck`, `pnpm test`, `pnpm build` and CI pass, and the banks endpoints answer through the proxy with a session on a throwaway stack (removed afterwards with its volume)

## Workflow follow-up

- Archive the change (`/opsx:archive`; no spec sync, `skip_specs: true`).
- The restructure is complete; next candidates are the behavior fixes recorded in `specs-base`.
