# Tasks

TDD: each scenario's characterization test first (`tests/history-import.test.tsx`), seen failing. Commit before
mutation checks. Starts after the backend change `history-import` is merged.

## 1. Contract

- [ ] 1.1 `pnpm api:sync` with the backend's `openapi.json`; feature `imports` (port, HTTP adapter, provider, hooks, fake adapter)

## 2. Screen

- [ ] 2.1 Choosing a file and the preview per wallet with its selector («Choose a file», «Unrecognized file», «Wallet onto a bank account», «Not imported», «Categories without equivalent»)
- [ ] 2.2 Importing, nothing to import, cancel, failure («Import», «Nothing to import», «Cancel», «Import fails»)

## 3. Look and verification

- [ ] 3.1 Stories for the section (preview, nothing to import, error) in both themes with axe; e2e: import an invented export through the fake stack and see its month in «mi mes»; docs; `pnpm check`, `typecheck`, `test`, `build`, `build-storybook`, `pnpm e2e`, CI; preview of the owner's export checked by hand against the running app
