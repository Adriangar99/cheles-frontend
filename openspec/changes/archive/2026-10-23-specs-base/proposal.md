# Proposal

## Why

`openspec/specs/` is empty: the frontend's behavior only exists in code, with no tests. Before restructuring it into
features (domain, API adapter, TanStack Query hooks, components) we need an explicit contract of what each screen does
today, to drive the characterization tests and to review every step of the migration.

## What Changes

- Document the **current** frontend behavior as-is, one capability per screen or user flow.
- Write scenarios from the user's point of view so each maps to a component or hook test in the next change.
- Record oddities and gaps found while reading the code as observations in `design.md`, without fixing them.
- Translate `README.md` and every Spanish code comment (`Dockerfile`, `.env.example`, `next.config.ts`,
  `src/middleware.ts`, `src/app/globals.css`) to English. UI copy stays in Spanish.
- No behavior changes; no dependency changes.

## Capabilities

### New Capabilities

- `api-access`: how the browser reaches the API (same-origin `/api/*` proxy), how API errors and expired sessions are
  surfaced, and the security headers the web app sends.
- `app-shell`: session guard for app pages, bottom tab navigation and page metadata.
- `login`: login form with username, password and TOTP code.
- `monthly-overview`: the «mi mes» screen with month navigation, monthly figures, spending by category and the
  12-month history chart.
- `transactions`: the «movimientos» screen with month navigation, search, category selection and the ⇄ transfer toggle.
- `bank-management`: the «bancos» screen with connection status, manual sync, reconnecting, connecting a new bank,
  account roles, reprocessing and logout.
- `locale-formatting`: es-ES money, month and date formatting shared by every screen.

### Modified Capabilities

None (there are no existing specs).

## Impact

- Only `openspec/`, `README.md` and code comments change.
- **Features affected**: all of them (auth, stats, transactions, banks), documentation only.
- **API dependency**: none. The specs describe how the frontend uses the current cheles-backend API, whose contract is
  specified in cheles-backend's `openspec/specs/`.
- **Security**: the security surface does not change. The current session guard and security headers become a
  verifiable contract.

### Out of scope

- Fixing any behavior or gap listed in `design.md`.
- Tests, Biome, Vitest, TanStack Query, openapi-typescript and the feature restructuring (next changes).
- Visual design details (colors, spacing) beyond what the user relies on to understand the screen.
- Backend behavior (already specified in cheles-backend).
