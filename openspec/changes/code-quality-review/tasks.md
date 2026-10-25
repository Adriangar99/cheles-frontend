# Tasks

Refactor note: characterization expectations stay the same; only how tests find elements changes. Commit before any
mutation check.

## 1. Typed HTTP boundary

- [x] 1.1 Add `openapi-fetch` (exact version) and `src/shared/api/client.ts` with the error middleware; move every adapter to it and remove `request()`; verify `pnpm typecheck` and every characterization test pass, and mutation-check the middleware (401 redirect, login exception, detail, «Error <status>», JSON content type)

## 2. Markup and tests

- [x] 2.1 Semantic lists, labelled bars, figures as `dl`, labelled month `nav` and `role="alert"` errors across the three screens and login; keep classes so the current styles still apply
- [x] 2.2 Rewrite the test lookups to roles and accessible names (no CSS selectors, no `as HTMLElement`); verify every test passes and a grep finds no class selector in `tests/`

## 3. Small fixes

- [x] 3.1 `skipToken` in `useTransactions`, `parseRole` for the role selector, fake timers in «Typing quickly», `@tests/*` alias with its Biome restriction; verify `pnpm check`, `pnpm typecheck`, `pnpm test`, `pnpm build` and CI pass, and the screens look unchanged in Docker (throwaway stack)

## Workflow follow-up

- Archive the change (`/opsx:archive`; no spec sync, `skip_specs: true`).
- Next: block 2 (fixes).
