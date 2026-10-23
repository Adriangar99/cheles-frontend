# Tasks

TDD note: characterization tests describe existing behavior and must pass against the current code; a failing one
means the spec misdescribes the code, so the spec is corrected (never the code) and the mismatch reported. Commit
before any mutation check.

## 1. Toolchain

- [x] 1.1 Adopt pnpm: `packageManager` field, generate and commit `pnpm-lock.yaml`, switch the Dockerfile to Corepack + `pnpm install --frozen-lockfile` / `pnpm build`, and replace npm in the README; verify `pnpm install --frozen-lockfile` succeeds and `docker compose build web` works
- [x] 1.2 Add Biome (`biome.json` with formatter settings, recommended rules and the feature-boundary `noRestrictedImports` patterns) and apply formatting in an isolated commit; verify `pnpm biome check .` passes
- [x] 1.3 Add Vitest + Testing Library + jsdom (`vitest.config.ts`, setup file, `pnpm test`) and a `typecheck` script (`tsc --noEmit`); verify both run (Vitest with no tests yet exits cleanly with `--passWithNoTests`)

## 2. Generated API types

- [x] 2.1 Add openapi-typescript, `pnpm api:sync` and `pnpm api:types`, copy the backend contract to `openapi/cheles-api.json` and generate `src/shared/api/schema.d.ts`; verify `pnpm api:types` produces no diff
- [x] 2.2 Replace the hand-written response types in `src/lib/api.ts` with aliases of the generated ones and fix any type-only drift; verify `pnpm typecheck` and `pnpm build` pass

## 3. Characterization tests

- [ ] 3.1 Add the test harness (`tests/fake-api.ts` stubbing `fetch`, location stub, render helpers) and the meta-test listing the three Docker-only scenarios; verify the meta-test runs and reports the missing scenarios
- [ ] 3.2 `tests/api-access.test.tsx`, `tests/app-shell.test.tsx` and `tests/login.test.tsx`: one test per scenario (middleware, next.config, layout metadata, API client behavior, login form); verify they pass
- [ ] 3.3 `tests/locale-formatting.test.tsx`, `tests/monthly-overview.test.tsx` and `tests/transactions.test.tsx`: one test per scenario; verify they pass
- [ ] 3.4 `tests/bank-management.test.tsx`: one test per scenario; verify they pass and the meta-test reports no missing scenario

## 4. CI, docs and verification

- [ ] 4.1 Add `.github/workflows/ci.yml` (pnpm install --frozen-lockfile, biome check, typecheck, test, api types up to date, build) and document the scripts in the README; verify the workflow passes on the pull request
- [ ] 4.2 Run `docker compose up -d --build` (backend already up); verify `/login` returns 200, `/api/health` returns `{"ok":true}` through the proxy, a proxied `/api/*` response lacks the page security headers, and port 3000 is bound only to `127.0.0.1`

## Workflow follow-up

- Archive the change (`/opsx:archive`; no spec sync, `skip_specs: true`).
- Next change: restructure into features with TanStack Query (screens keep passing these characterization tests).
