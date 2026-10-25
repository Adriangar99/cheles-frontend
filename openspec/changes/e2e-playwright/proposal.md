# Proposal

## Why

Block 4 of the roadmap. The characterization tests stub `fetch`, so nothing automated checks the real chain: browser →
Next.js proxy → API → Postgres, the session cookie across the proxy, the middleware, or the Enable Banking flow. Those
were verified by hand on throwaway stacks in every change. Three `api-access` scenarios («API URL fixed at build time»,
«Proxied API response», «Access from another device») are exempted from the spec-coverage meta-test because they need
the deployment. The redesign (block 6) also needs before/after screenshots of every screen.

## What Changes

- **Playwright** end-to-end tests, run locally with `pnpm e2e` (both repos are private: no CI job, by decision).
- **A throwaway stack** for the tests (`e2e/compose.yaml`, Compose project `cheles-e2e`, isolated from the real one):
  Postgres on tmpfs, the API built from `../cheles-backend`, the web app built from this repo, and a **fake Enable
  Banking** that implements the provider routes the API uses (banks, authorization with a redirect back, sessions,
  balances, transactions) with deterministic data relative to today.
- **Flows**: login with a computed TOTP and the session guard; connecting a bank through the fake provider, then seeing
  its transactions, figures and balances; editing a category; removing the connection; logout.
- **Deployment scenarios as tests**: «API URL fixed at build time» (the web container runs with a different `API_URL`
  and still proxies to the build-time one) and «Proxied API response» (the API's headers pass through, without the
  page security headers) move from the meta-test exemptions to e2e tests, which the meta-test now reads too. «Access
  from another device» stays exempt (it needs a second device on the LAN).
- **Screenshots** of every screen saved by the run (git-ignored), for the redesign's before/after comparison.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None (`skip_specs: true`): tests and tooling only.

## Impact

- **Dependencies**: `@playwright/test` and `otpauth` (dev). Chromium is installed by Playwright on first use.
- **Backend dependency**: needs `../cheles-backend` checked out next to this repo; no backend change.
- **Security surface**: none; the e2e stack publishes only on `127.0.0.1` and uses throwaway credentials and keys.

### Out of scope

- Running e2e in CI; visual regression assertions (screenshots are saved, not compared).
