# Tasks

TDD: write the scenario test first and see it fail for the right reason. Commit before any mutation check.

## 1. Contract

- [x] 1.1 After `connection-lifecycle` and `stats-accuracy` are merged in cheles-backend, run `pnpm api:sync`; verify `pnpm typecheck` and the tests pass (fixtures gain `country` and `other_currencies`)

## 2. Fixes

- [x] 2.1 «Validation error»: test, then map a list `detail` to «Datos no válidos» in `call()`
- [x] 2.2 «Consent date already passed» and «Reconnect in the connection's country»: tests, then `needsReconnect` and the connection's country
- [x] 2.3 «Reloading after the result»: test with a `history` stub, then `replaceState` after reading the result

## 3. New capabilities

- [ ] 3.1 «Remove a connection» and «Cancel removing»: tests, then `remove()` in the port, `useRemoveConnection()` and the «quitar» button with confirmation
- [ ] 3.2 «Dollars left out» and «Only euros»: tests, then the warning in «mi mes»

## 4. Verification

- [ ] 4.1 `pnpm check`, `pnpm typecheck`, `pnpm test` (spec-coverage included), `pnpm build`, mutation check of the new branches, CI, and an end-to-end check on a throwaway stack (remove a connection, reconnect country, 422 message)

## Workflow follow-up

- Archive with spec sync. Next: block 3 (docs).
