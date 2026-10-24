# Design

## Context

See proposal.md. Today: `src/lib/api.ts` (fetch wrapper, generated-type aliases, formatting and month helpers),
client-component pages under `src/app/`, `src/middleware.ts`, characterization tests in `tests/` that render pages
with `fetch` stubbed (61 tests, one per spec scenario plus two boundaries). No feature folders yet; Biome already
forbids deep imports into `@/features/<name>/…`.

## Goals / Non-Goals

**Goals:** shared kernel, QueryClient and port injection in place; auth migrated as the reference feature; boundaries
enforced by the linter; characterization tests green with unchanged expectations.

**Non-Goals:** migrating the other screens; behavior fixes.

## Decisions

### Layout
```
src/shared/api/http.ts        request<T>(path, { method, json }) — the current api() behavior
src/shared/api/schema.d.ts    generated (unchanged)
src/shared/format.ts          money, monthLabel
src/shared/month.ts           shiftMonth, currentMonth
src/shared/query.ts           createQueryClient()
src/features/auth/
  index.ts                    entry point: LoginForm, useLogout, AuthApiProvider, httpAuthApi, type AuthApi
  api.ts                      AuthApi port + httpAuthApi adapter
  provider.tsx                AuthApiProvider + useAuthApi()
  hooks.ts                    useLogin, useLogout (useMutation)
  components/LoginForm.tsx
src/app/providers.tsx         QueryClientProvider + feature providers with HTTP adapters
src/app/login/page.tsx        renders <LoginForm />
```
Features get no `domain/` folder until they have pure logic; auth has none.

### Ports through context, one provider per feature
A single shared registry of adapters would make `src/shared/` depend on every feature. Instead each feature owns its
context (`AuthApiProvider adapter={…}`) and `src/app/providers.tsx`, the composition root, wires the HTTP adapters.
`useAuthApi()` throws when the provider is missing, so a screen rendered without it fails loudly in tests.

### QueryClient defaults preserve behavior
`retry: false` for queries and mutations (today a failed request shows its error at once) and
`refetchOnWindowFocus: false`, `refetchOnReconnect: false` (today nothing refetches by itself). `staleTime` stays 0 so a
query refetches when its key changes, as the effects do now. The client is created once per browser session inside
`Providers` (`useState(createQueryClient)`), never at module level, so each test gets a fresh cache.

### Login with a mutation
`useLogin` wraps `AuthApi.login`; on success it sets `window.location.href = "/"` (full navigation, as now, so the
middleware sees the new cookie). `LoginForm` keeps the same markup and literals, disables «entrar» while
`isPending`, and shows `error.message`. HTML `required` validation is unchanged.

### Test harness and the test pyramid
- `tests/render.tsx` exports `renderScreen(ui)`, which wraps `ui` in the real `Providers`. Every characterization
  test switches from `render` to `renderScreen`; assertions stay the same. Middleware, config and layout tests are
  untouched.
- Characterization tests remain the behavior net. Feature-level tests with fake adapters are written only for logic a
  screen test cannot reach cheaply (pure domain rules, hook edge cases). Auth has no such logic, so this change adds
  none; the port and provider exist so later features can.
- Vitest also collects `src/**/*.test.{ts,tsx}` for colocated feature tests.

### Boundaries in Biome
`noRestrictedImports` overrides:
- `src/shared/**`: forbid `@/features/*`, `@/app/*`, `@/lib/*`.
- `src/features/**`: forbid `@/app/*` and `@/lib/api` (features use `@/shared/…`).
- Everywhere: forbid `@/features/*/**` (existing).

### Transitional `src/lib/api.ts`
It keeps exporting `api`, the type aliases and the helpers by re-exporting from `src/shared/`, so unmigrated screens
compile unchanged. The banks change removes it.

## Risks / Trade-offs

- [TanStack Query changes timing (an extra render before data)] → Characterization tests already wait with
  `findBy…`/`waitFor`; defaults disable retries and background refetches.
- [Two styles coexist during the migration] → Transitional by design; `src/lib/api.ts` is forbidden in features and
  removed in the last change.
- [Fake-adapter tests deferred] → Avoids duplicating screen tests; the port is exercised by the first feature with
  real logic (stats or banks).

## Migration Plan

Code-only; rebuild the image. Rollback: revert the PR.
