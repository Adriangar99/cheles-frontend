# Tasks

TDD: write the scenario test first, see it fail for the right reason, then implement. Commit before any mutation
check.

## 1. Local current month

- [x] 1.1 Test «Just after midnight on the first day» in `tests/locale-formatting.test.tsx`, then make `currentMonth()` use the local date; verify the locale and monthly-overview tests pass

## 2. Visible errors

- [ ] 2.1 Tests for «Summary unavailable», «History unavailable» and «Error cleared by changing the month», then show the stats error under `MonthNav` (skipping «No autenticado»); verify the monthly-overview, api-access and app-shell tests pass
- [ ] 2.2 Tests for «List unavailable», «Change rejected» and «Error cleared by the next edit», then show the transactions load and edit errors under the search box; verify the transactions tests pass
- [ ] 2.3 Tests for «Connections unavailable», «Connecting fails» and «Logout fails», then route those errors to the banks message (connect and logout without clearing it); verify the bank-management tests pass and mutation-check the three screens' error rendering

## 3. Accounts without a bank

- [ ] 3.1 Tests for «Detached account», «Role of a detached account» and «No detached accounts», then extract `AccountRow` and add the «cuentas sin banco» section; verify the bank-management tests pass

## 4. Contract and verification

- [ ] 4.1 After the backend change is merged, run `pnpm api:sync` and commit the copy and regenerated types; verify `pnpm check`, `pnpm typecheck`, `pnpm test` (spec-coverage meta-test included), `pnpm build` and CI pass, and on a throwaway stack without `EB_APPLICATION_ID` «conectar un banco» shows «Enable Banking no está configurado» through the proxy (removed afterwards with its volume)

## Workflow follow-up

- Archive the change with spec sync (`/opsx:archive`).
