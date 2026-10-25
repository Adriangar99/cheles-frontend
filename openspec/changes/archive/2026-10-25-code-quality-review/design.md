# Design

## Context

See proposal.md. Review results: 0 non-null assertions, 0 `any`, 0 lint/TS ignores; 2 casts in `src/`, 13
`as HTMLElement` and 13 class-selector lookups in `tests/`; one `setTimeout(400)` in a test; two feature tests import
`tests/screens.ts` by relative path.

## Goals / Non-Goals

**Goals:** tests that survive a full restyle; a type-checked HTTP boundary; no casts in `src/`.

**Non-Goals:** visual changes; behavior changes.

## Decisions

### Semantics the tests can rely on
- Transactions, accounts (per connection and detached), spending categories and history months render as `ul`/`li`
  (`role="list"` kept explicitly because Safari drops list semantics when `list-style: none`).
- Each transaction `li` is labelled by its row label; category bars expose `aria-label="<name> <percent>%"`; history
  months are `li` with `aria-label="<YYYY-MM>: ingresos <x> / gastos <y>"`, and the bars inside are `meter`-like
  elements with `aria-valuenow` in pixels of the 70 px scale (the scale stays a domain rule).
- Monthly figures become a `dl` (`dt` label, `dd` value) so a figure is found by its term.
- The month heading region is a `nav` labelled «mes»; errors render with `role="alert"`.
- Tests switch to `within(getByRole("listitem", { name }))`, `getByRole("definition")`… and assert values through
  accessible attributes instead of inline styles where an attribute exists; inline style checks remain only for
  colors, read from `style` of elements found by role.

### Typed client
`src/shared/api/client.ts` creates `createClient<paths>({ baseUrl: "/api" })` with a middleware that: sets
`Content-Type` only when there is a body (as now), redirects a 401 outside `/auth/login` and throws «No autenticado»,
and turns any other non-OK response into `Error(detail ?? "Error <status>")`. Adapters call `client.GET("/api/...",
{ params: { query } })`, so `tsc` checks every request against `schema.d.ts`. `request()` is removed.

### Small fixes
- `useTransactions(filter)`: `queryFn: filter ? () => api.list(filter) : skipToken`.
- `parseRole(value): Role` in `features/banks/domain`, throwing on an unknown value.
- «Typing quickly»: `vi.useFakeTimers({ shouldAdvanceTime: true })` and `advanceTimersByTime(400)`.
- `tsconfig`/Vitest alias `@tests/*` → `tests/*`; Biome forbids `@tests/*` outside test files.

## Risks / Trade-offs

- [Markup changes could alter layout] → `ul`/`li`/`dl` get the same classes and a CSS reset for lists; checked in
  Docker before and after (screenshots by hand until Playwright arrives in block 4).
- [openapi-fetch error handling differs from fetch] → The middleware reproduces today's messages; the api-access and
  error tests cover 401, detail, no detail and JSON bodies.

## Migration Plan

Code-only; rebuild the image. Rollback: revert the PR.
