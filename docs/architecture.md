# Architecture

Next.js 15 (App Router, client components) with TanStack Query, organized by feature. TypeScript strict; Biome for lint
and format; pnpm.

## Layout

    src/app/                 thin routes and layouts; providers.tsx is the composition root
    src/features/<feature>/  auth, stats, transactions, banks
      index.ts               entry point: the only module other code may import
      api.ts                 the feature's API port (an interface) and its HTTP adapter
      provider.tsx           <Feature>ApiProvider and use<Feature>Api(): the port, injected through React context
      hooks.ts               TanStack Query queries and mutations over the port
      components/            React components
      domain/                pure rules (no React, no fetch), with unit tests next to them
    src/shared/              typed API client and generated contract, es-ES formatting, month arithmetic, MonthNav,
                             query client, and the design system (ui/: tokens and primitives)
    src/middleware.ts        session guard (cookie presence)
    next.config.ts           /api/* rewrite to the API and security headers

## Rules

- **Routes only compose**: each page renders one feature screen.
- **Ports through context**: `src/app/providers.tsx` wires each feature's HTTP adapter; tests can pass others.
- **Typed API client**: adapters call `openapi-fetch` typed with `src/shared/api/schema.d.ts`, generated from the
  backend's contract, so `tsc` checks paths, parameters, bodies and responses. `call()` maps failures to the API's
  message (401 → `/login`).
- **Query defaults keep the app predictable**: no retries, no refetch on focus or reconnect; actions refetch the
  screen's data before finishing.
- **Semantic markup**: lists, labelled meters, a definition list for figures, alerts for errors; tests rely on roles
  and accessible names, not on CSS classes.

## Enforcement

Biome (`biome.json`, `noRestrictedImports`): another feature only through its entry point; `src/shared` imports no
feature or route; features import no route; test fixtures (`@tests/*`) only from tests.
