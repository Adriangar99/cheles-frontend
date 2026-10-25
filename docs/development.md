# Development

## Commands

| Command | What it does |
| --- | --- |
| `pnpm dev` | Development server (see [setup](setup.md#locally-with-pnpm-dev)) |
| `pnpm check` | Biome lint and format check (`pnpm biome check --write .` fixes) |
| `pnpm typecheck` | TypeScript (`tsc --noEmit`) |
| `pnpm test` | Vitest (`pnpm test:watch` while working) |
| `pnpm api:sync` | Copies `../cheles-backend/openapi.json` to `openapi/cheles-api.json` and regenerates the API types |
| `pnpm api:types` | Regenerates `src/shared/api/schema.d.ts` from the versioned contract |
| `pnpm build` | Production build |
| `pnpm e2e` | End-to-end tests against a throwaway stack (see below) |

CI (GitHub Actions) runs `check`, `typecheck`, `test`, verifies the generated API types match the versioned contract,
and builds the app.

## Tests

- **One test per spec scenario.** Each scenario of `openspec/specs/<capability>/spec.md` has a test named after it in
  `tests/<capability>.test.tsx`; `tests/spec-coverage.test.ts` fails when one is missing.
- **Screens through the HTTP boundary.** Characterization tests render a screen inside the real providers
  (`renderScreen`) with `fetch` stubbed per route (`tests/fake-api.ts`), and query by role and accessible name only.
  Location, history and the clock are stubbed in `tests/location.ts`.
- **Domain rules** have unit tests next to them (`src/features/*/domain/*.test.ts`), for what screen tests cannot
  reach cheaply.
- **Tests first**, then the code; after committing, **mutation checks**: break the code on purpose and check a test
  fails.
- **No ceremonial tests**: no tests of test helpers, one-off checks or trivial code.

## End-to-end tests

`pnpm e2e` runs Playwright against a throwaway stack (`e2e/compose.yaml`, Compose project `cheles-e2e`, nothing shared
with your real one): Postgres on tmpfs, the API built from `../cheles-backend` (it must be checked out next to this
repo), this web app, and a fake Enable Banking (`e2e/fake-enable-banking/server.py`) that lets the tests connect a bank
and sync it. The global setup builds and starts the stack and creates the user; the teardown removes everything.

    pnpm exec playwright install chromium   # once
    pnpm e2e                                # ~40 s once the images are cached
    E2E_KEEP=1 pnpm e2e                     # keep the stack to debug; docker compose -f e2e/compose.yaml down -v after

The tests cover the session, the whole bank journey (connect, roles, figures, a category change, removing the
connection) and two deployment scenarios of `api-access`. Each run saves screenshots of every screen in
`e2e/screenshots/` (git-ignored). They run only locally: both repos are private, so CI does not build the API.

## API contract

The backend versions its OpenAPI document. When it changes, run `pnpm api:sync` and commit the copy and the
regenerated types together; response types are never written by hand. Request bodies are generated with defaulted
fields optional (`--default-non-nullable false`).

## Workflow

Changes are planned with [OpenSpec](https://github.com/Fission-AI/OpenSpec) (`openspec/`) and the Claude Code commands
`/opsx:propose` → `/opsx:apply` → pull request → `/opsx:archive`. Work happens on branches, never on `main`. Code,
specs and documentation are in English; the app's copy is Spanish (Spain).
