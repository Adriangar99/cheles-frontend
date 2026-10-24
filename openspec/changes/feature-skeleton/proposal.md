# Proposal

## Why

Every screen fetches through `src/lib/api.ts`, keeps server data in `useState`/`useEffect`, and mixes formatting,
business rules and markup in one page file. The project conventions call for feature modules (pure domain, an API
adapter behind a port, TanStack Query hooks, components) with shared code in `src/shared/`. As in the backend, the
migration starts with a skeleton that sets the shared pieces up and migrates the smallest feature (auth), so the
following changes (stats, transactions, banks) only move one screen each.

## What Changes

- **Shared kernel** in `src/shared/`: the HTTP client (JSON bodies, 401 redirect to `/login`, `detail`/«Error
  <status>» messages) in `src/shared/api/http.ts`, es-ES formatting (`money`, `monthLabel`) in
  `src/shared/format.ts`, and month arithmetic (`shiftMonth`, `currentMonth`) in `src/shared/month.ts`.
  `src/lib/api.ts` re-exports them for the screens not migrated yet and disappears with the last feature change.
- **TanStack Query** (`@tanstack/react-query`, pinned) with a `QueryClient` whose defaults keep today's behavior: no
  retries and no refetch on window focus or reconnect.
- **API ports injected through React context**: each feature declares its port (an interface) and an HTTP adapter in
  `api.ts`, plus a provider and a `use<Feature>Api()` hook. `src/app/providers.tsx` (client component in the root
  layout) composes the QueryClient and the features' providers with their HTTP adapters; tests can pass other
  adapters.
- **auth feature** (`src/features/auth/`): `AuthApi` port (`login`, `logout`), HTTP adapter, `useLogin` and
  `useLogout` mutation hooks and the `LoginForm` component. `src/app/login/page.tsx` becomes a thin route.
  `useLogout` is exported for the banks screen, which keeps its direct call until its own change.
- **Boundaries enforced by Biome**: `src/shared/` cannot import features or `src/app/`; features cannot import
  `src/app/` or `@/lib/api`; another feature only through its entry point (rule already in place).
- **Test harness**: characterization tests render screens inside the app's providers (real HTTP adapters, a fresh
  QueryClient per test). Expected values do not change.
- README and `openspec/config.yaml`: architecture section and migration progress.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None (`skip_specs: true`): no user-visible behavior changes.

## Impact

- **Features affected**: auth (login page) migrated; other screens only change their import source.
- **Backend dependency**: none; same endpoints and generated types.
- **Security surface**: unchanged (same requests, cookie handling and redirects).
- **Dependencies**: `@tanstack/react-query` (runtime).

### Out of scope

- Migrating stats («mi mes»), transactions and banks (one change each, next).
- Fixing the observations recorded in `specs-base` (UTC current month, silent failures, detached accounts…). The
  unhandled rejection after a 401 on «mi mes» stays until the stats change.
