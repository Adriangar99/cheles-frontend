# Proposal

## Why

The frontend has no lockfile, linter, tests, CI or generated API types: its response types in `src/lib/api.ts` are
written by hand and already drift from the backend (e.g. `Tx` lacks `currency`, `account_id` and `note`). Before
restructuring it into features (domain, API adapter, TanStack Query hooks, components) it needs the same safety net
the backend got: reproducible installs, static checks, a characterization test per spec scenario, and types generated
from the backend's versioned OpenAPI contract.

## What Changes

- **pnpm as the package manager** (project rule for all JavaScript): commit `pnpm-lock.yaml`, pin pnpm through the
  `packageManager` field (Corepack), and install with `pnpm install --frozen-lockfile` in Docker and CI. No npm.
- **Biome** for lint and format (replacing nothing: there was no linter), applied once in an isolated formatting
  commit. Feature-boundary rules (`noRestrictedImports`) are configured now with the `src/features/*` patterns so the
  restructure starts constrained.
- **Vitest + Testing Library + jsdom** with `pnpm test`; TypeScript checked with `tsc --noEmit`.
- **API types generated** with openapi-typescript: `pnpm api:sync` copies `../cheles-backend/openapi.json` into the
  versioned `openapi/cheles-api.json` and generates `src/shared/api/schema.d.ts`; `pnpm api:types` regenerates
  types from the versioned copy (used by CI to check they are up to date). The hand-written response types in
  `src/lib/api.ts` become aliases of the generated ones, so screens are type-checked against the real contract.
- **Characterization tests**: one test per scenario of the 7 frontend specs, at the HTTP boundary (`fetch` stubbed),
  so they survive the upcoming restructure; the middleware and `next.config.ts` are tested directly. A meta-test fails
  when a spec scenario has no test; three deployment-only scenarios are listed explicitly as verified in Docker.
- **GitHub Actions CI**: `pnpm install --frozen-lockfile`, Biome, `tsc`, Vitest, generated types up to date, `next build`.
- README: development workflow (scripts, tests, API types).

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None (`skip_specs: true`): no user-visible behavior changes.

## Impact

- **Features affected**: none restructured; screens keep their code, only their type imports change.
- **Backend dependency**: consumes `openapi.json` from cheles-backend (already versioned there, #14). No API change.
- **Security surface**: unchanged (headers, middleware and port binding are now covered by tests or the Docker check).
- **Dependencies**: dev only (Biome, Vitest, Testing Library, jsdom, openapi-typescript); runtime dependencies keep
  their current versions, now locked.

### Out of scope

- TanStack Query and the feature restructure (next change).
- Fixing the observations recorded in `specs-base` (UTC month, silent failures, detached accounts…).
- End-to-end browser tests.
