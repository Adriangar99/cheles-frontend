# Cheles · frontend

Cheles web app (working name): mobile-first Next.js. It talks to the
[cheles-backend](https://github.com/Adriangar99/cheles-backend) API through an `/api/*` rewrite, so the browser only
knows about the web app.

## Getting started

Start the backend first (it creates the Docker network `cheles-net`), then:

    docker compose up -d --build        # http://localhost:3000

Without Docker: `pnpm install && API_URL=http://localhost:8000 pnpm dev` (with the API reachable at that URL).
pnpm is the package manager (version pinned in `package.json`, provided by Corepack); never npm or yarn.

`API_URL` is fixed **at build time** (Next resolves rewrites during the build); it defaults to `http://api:8000`.

Both repos share the Compose project name `cheles`, so `api`, `db` and `web` show up together. Never run
`docker compose down --remove-orphans` from one repo: it would also remove the other repo's containers.

## Development

| Command | What it does |
| --- | --- |
| `pnpm dev` | Development server |
| `pnpm check` | Biome lint and format check (`pnpm biome check --write .` fixes) |
| `pnpm typecheck` | TypeScript (`tsc --noEmit`) |
| `pnpm test` | Vitest characterization tests (`pnpm test:watch` while working) |
| `pnpm api:sync` | Copies `../cheles-backend/openapi.json` to `openapi/cheles-api.json` and regenerates the API types |
| `pnpm api:types` | Regenerates `src/shared/api/schema.d.ts` from the versioned contract |
| `pnpm build` | Production build |

CI (GitHub Actions) runs `check`, `typecheck`, `test`, verifies the generated API types match the versioned contract
and builds the app.

**Tests.** Every spec scenario has a test named after it in `tests/<capability>.test.tsx`; `tests/spec-coverage.test.ts`
fails when one is missing. Screens are rendered with `fetch` stubbed (`tests/fake-api.ts`), so tests describe what the
user sees and which requests are made, not how the code is organized. Three deployment scenarios (API URL fixed at
build time, proxied API headers, local-only port) are checked against the running containers instead.

**API contract.** The backend versions its OpenAPI document; when it changes, run `pnpm api:sync` and commit the copy
and the regenerated types together. Response types come from `src/shared/api/schema.d.ts`, never written by hand.

## Architecture

```
src/app/            thin Next.js routes and layouts; providers.tsx is the composition root
src/features/<f>/   one per area (auth, stats, transactions, banks)
  index.ts          entry point: the only module other code may import
  api.ts            the feature's API port (interface) and its HTTP adapter
  provider.tsx      <F>ApiProvider and use<F>Api(): the port, injected through React context
  hooks.ts          TanStack Query queries and mutations over the port
  components/       React components
  domain/           pure rules (no React, no fetch), only when the feature has any
src/shared/         HTTP client, generated API types, es-ES formatting, month arithmetic, MonthNav, query client
```

Biome enforces the boundaries: features are imported only through their entry point, `src/shared/` depends on
nothing above it, and features never import `src/app/`.

Tests: the characterization tests in `tests/` render screens inside the real providers with `fetch` stubbed, and
are the behavior net. Feature tests (colocated `*.test.ts(x)`) pass a fake adapter to the feature's provider and are
written for logic a screen test cannot reach cheaply, such as pure domain rules.

## Security

Port published only on `127.0.0.1`; `X-Frame-Options`, `nosniff`, `no-referrer` and `no-store` headers on the pages
it serves (proxied `/api/*` responses keep the API's own headers).

## Language

Code, specs and documentation are written in English. The app's user-facing copy is Spanish (Spain).

## Development with OpenSpec

Changes are planned with [OpenSpec](https://github.com/Fission-AI/OpenSpec) (`openspec/`), using the Claude Code
commands `/opsx:explore`, `/opsx:propose`, `/opsx:update`, `/opsx:apply`, `/opsx:sync` and `/opsx:archive`. Current
behavior is specified under `openspec/specs/`, one capability per screen or user flow.
