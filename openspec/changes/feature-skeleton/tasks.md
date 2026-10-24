# Tasks

Refactor note: characterization tests must stay green with unchanged expectations after every task; only the render
helper changes. Commit before any mutation check.

## 1. Shared kernel

- [x] 1.1 Move the HTTP client to `src/shared/api/http.ts`, formatting to `src/shared/format.ts` and month arithmetic to `src/shared/month.ts`; `src/lib/api.ts` re-exports them; verify `pnpm typecheck` and `pnpm test` pass

## 2. Query and providers

- [x] 2.1 Add `@tanstack/react-query` (exact version), `src/shared/query.ts` (`createQueryClient` with no retries and no focus/reconnect refetch) and `src/app/providers.tsx` in the root layout; add `tests/render.tsx` (`renderScreen`) and switch every characterization test to it; verify `pnpm test` passes unchanged

## 3. auth feature

- [x] 3.1 Create `src/features/auth/` (port and HTTP adapter in `api.ts`, `AuthApiProvider`/`useAuthApi`, `useLogin`/`useLogout`, `LoginForm`, entry point `index.ts`), wire `AuthApiProvider` in `providers.tsx` and make `src/app/login/page.tsx` a thin route; verify the login and api-access characterization tests pass and mutation-check `LoginForm` (busy state, error message, navigation to `/`)

## 4. Boundaries, docs and verification

- [ ] 4.1 Add the Biome boundary overrides (shared, features) and include `src/**/*.test.{ts,tsx}` in Vitest; verify `pnpm check` passes and a probe import from `src/shared` into a feature is rejected
- [ ] 4.2 Document the architecture in the README (layout, ports through context, test pyramid) and mark the migration progress in `openspec/config.yaml`; verify `pnpm check`, `pnpm typecheck`, `pnpm test`, `pnpm build` and CI pass, and the login flow works in Docker (`/login` 200, wrong code shows the error)

## Workflow follow-up

- Archive the change (`/opsx:archive`; no spec sync, `skip_specs: true`).
- Next changes: `stats-feature`, `transactions-feature`, `banks-feature` (removes `src/lib/api.ts`).
