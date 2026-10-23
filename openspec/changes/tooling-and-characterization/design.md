# Design

## Context

See proposal.md. Current state: Next.js 15 / React 19 client-component screens (`src/app/(app)/*`, `src/app/login`),
`src/lib/api.ts` (fetch wrapper, hand-written types, formatting helpers), `src/middleware.ts` (cookie-presence guard),
`next.config.ts` (`/api/*` rewrite to `API_URL`, security headers). No lockfile, no tests, no CI. Docker builds with
`npm install` when no lockfile exists. Node 22 in the image; local Node 24 with pnpm 12.

## Goals / Non-Goals

**Goals:** reproducible tooling; a characterization test per spec scenario that survives the restructure; generated
API types in use.

**Non-Goals:** restructuring code, TanStack Query, behavior fixes.

## Decisions

### Characterization at the HTTP boundary
Screen tests render the page components with Testing Library and stub `global.fetch` with a small router
(`tests/fake-api.ts`: method + path → JSON response, recording requests). They assert what the user sees and which
requests were made. Because they do not reach into `src/lib/api.ts` or component internals, they keep passing when the
next change moves screens to features, API adapters and TanStack Query. The fake API adapter (no MSW) from the project
conventions is for the feature-level hook/component tests of that next change.
- Navigation (`window.location.href = …`) is observed through a stubbed `window.location`.
- Time-dependent scenarios (current month, days left) use Vitest fake timers.
- `src/middleware.ts` is called with `NextRequest` objects; `next.config.ts` is imported and its `rewrites()` /
  `headers()` evaluated; `src/app/layout.tsx`'s `metadata`/`viewport` exports are asserted directly.

### Scenarios verified only in Docker
«API URL fixed at build time», «Proxied API response» and «Access from another device» depend on the built image and
the port binding, not on code a unit test can run. The meta-test lists them explicitly (with that reason) instead of
faking a test; the verification task checks them against the running containers.

### Meta-test
`tests/spec-coverage.test.ts` reads `openspec/specs/<capability>/spec.md` (and active change deltas), and requires each
`#### Scenario:` title to appear as a test name in `tests/<capability>.test.tsx` (same convention as the backend, where
docstrings carry the titles). Repeated titles must be covered as many times as they appear.

### Generated API types
- `openapi/cheles-api.json`: versioned copy of the backend contract. `pnpm api:sync` copies it from
  `../cheles-backend/openapi.json` and regenerates types; `pnpm api:types` only regenerates from the copy.
- `src/shared/api/schema.d.ts`: openapi-typescript output (committed, so `tsc` and the build need no generation step).
- `src/lib/api.ts`: `Account`, `Connection`, `Category`, `Tx`, `Summary`, `HistoryPoint` become aliases of
  `components["schemas"][…]`. Where the generated type is wider (e.g. extra fields) screens keep compiling; where it is
  stricter, the compiler shows real drift to fix in types only (no behavior change).
- CI runs `pnpm api:types` and fails if `git diff` shows changes.

### Biome
`biome.json`: formatter (2 spaces, line width 120, double quotes, matching the current code), recommended lint rules,
and `noRestrictedImports` patterns forbidding `@/features/*/…` deep imports across features (no effect until features
exist). Formatting applied in its own commit.

### pnpm, lockfile and Docker
pnpm is the package manager for every JavaScript project (project rule). `package.json` declares
`"packageManager": "pnpm@<version>"`, so Corepack provides the same pnpm locally, in the Docker image
and in CI (`corepack enable` in both). `pnpm-lock.yaml` is committed; Docker and CI
install with `pnpm install --frozen-lockfile`. The Dockerfile copies `pnpm-lock.yaml` instead of
`package-lock.json*`, and its build stage runs `pnpm build`. The standalone Next.js output is unaffected by pnpm's
symlinked `node_modules` (Next traces the real files).

## Risks / Trade-offs

- [Page-level tests are slower than unit tests] → Few screens and a stubbed fetch keep them fast.
- [jsdom differences (navigation, `Intl`)] → Navigation is stubbed; `Intl` output is asserted as Node produces it,
  the same engine the scenarios were verified with.
- [The versioned contract copy can lag the backend] → Updating it is an explicit `api:sync` step reviewed in a PR;
  the backend's own drift test guarantees its `openapi.json` matches the API.

## Migration Plan

Tooling only; rebuild the image (now installed with pnpm). No runtime change.
