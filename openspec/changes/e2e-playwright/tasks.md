# Tasks

## 1. Stack

- [x] 1.1 Fake Enable Banking server and `e2e/compose.yaml`; verify by hand that the stack starts, the API reaches the fake (`/api/banks/available` through the web) and the authorization page redirects to the callback
- [x] 1.2 Playwright config, global setup/teardown (key pair, compose up/down, user and TOTP secret), `pnpm e2e`; verify an empty run starts and tears down the stack

## 2. Tests

- [x] 2.1 Session: login with TOTP, session guard redirect, logout
- [ ] 2.2 Banks: connect through the fake provider, accounts listed, transactions and «mi mes» figures, category edit kept after reload, remove the connection; screenshots of every screen
- [ ] 2.3 «API URL fixed at build time» and «Proxied API response» as e2e tests; the meta-test reads `e2e/*.spec.ts` and only exempts «Access from another device»

## 3. Docs and verification

- [ ] 3.1 Document `pnpm e2e` in `docs/development.md`; verify `pnpm check`, `pnpm typecheck`, `pnpm test`, `pnpm build`, CI, and two consecutive `pnpm e2e` runs pass and leave no containers, networks or volumes behind

## Workflow follow-up

- Archive (`/opsx:archive`; no spec sync). Next: block 5 (Storybook).
