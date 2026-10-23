# Design

## Context

The frontend is a small Next.js 15 app (about 870 lines): three client-component screens under `src/app/(app)/`, a
login page, a cookie-presence middleware and `src/lib/api.ts`, which mixes the fetch wrapper, hand-written API types
and formatting helpers. There are no tests. See proposal.md for why we document it before restructuring it. The specs
were derived by reading every file in `src/`, `next.config.ts`, `Dockerfile` and `docker-compose.yml`, and checking the
es-ES formatting output with Node.

## Goals / Non-Goals

**Goals:**
- A user-facing contract precise enough to write component and hook tests without reading the code again.
- Capabilities that map onto the planned features: `login` → auth, `monthly-overview` → stats, `transactions` →
  transactions, `bank-management` → banks; `api-access`, `app-shell` and `locale-formatting` → `src/shared/`.

**Non-Goals:**
- Placing new pieces in features or layers: this change adds none.
- Specifying backend behavior; screens are described in terms of what the user sees and which API action they trigger.

## Decisions

### Capabilities per screen or flow, flat layout
The frontend is organized by screen, so capabilities are flat (`transactions`, `bank-management`…) rather than grouped
by bounded context as in the backend. Cross-cutting behavior (proxy, session guard, formatting) gets its own capability
so each screen spec stays focused.

### Literal UI copy as the contract
Scenarios quote the exact Spanish copy («leer ahora», «nada por aquí»…), since it is what the user relies on and what
tests will query by. Formatting scenarios use the real `Intl` output (e.g. «1234,50 €», with no thousands separator
for four digits), verified with Node, not assumed.

### Visual details only where they carry meaning
Colors are specified only when they convey state (green/red for net, connection health, income/expense bars); layout
and spacing are left out.

## Observations (not specified as requirements, not fixed)

- **Current month computed in UTC**: `currentMonth()` uses `toISOString()`, so between 00:00 and 01:00/02:00 on the
  first day of a month (Madrid time) the app still opens on the previous month.
- **Month heading capitalizes every word** («Octubre De 2026») because of CSS `text-transform: capitalize`.
- **Proxied API responses lack the security headers**: `/api/*` responses (financial JSON included) are sent without
  `Cache-Control: no-store` or the other three headers, and expose `server: uvicorn`.
- **Validation errors render as «[object Object]»**: a 422 `detail` is an array, which the API client turns into an
  unreadable message.
- **Silent failures**: «mi mes» and «movimientos» do not handle API errors (the screen stays empty or stale); category
  and ⇄ changes, connecting a bank and logging out have no error feedback.
- **500-transaction cap**: «movimientos» loads at most 500 transactions per month and the count shows only the loaded
  ones, with no pagination.
- **Detached accounts are not shown**: the API returns `detached_accounts`, but the banks screen ignores them, so those
  accounts' roles cannot be changed.
- **Negative days left**: an `active` connection whose consent date has passed shows «caduca en -3 días» until a
  sync marks it expired.
- **Reconnect hardcodes country «ES»** instead of using the connection's country.
- **Sync result not shown**: the number of new transactions returned by «leer ahora» is discarded.
- **Feedback query params persist**: `?connected=1` / `?error=1` stay in the URL, so reloading shows the message again.
- **Unused backend features**: notes, user-created rules and «volver a automática» (`clear_category`) have no UI.
- **Category options by sign**: a zero amount is offered expense categories.
- **No lockfile**: `package-lock.json` is missing, so Docker builds install whatever versions resolve that day.
- **Middleware matcher** excludes `manifest.webmanifest` and `icon.svg`, which do not exist.
- **Hand-written API types** in `src/lib/api.ts` can drift from the backend (e.g. `Tx` lacks `currency`, `account_id`
  and `note`, which the API returns).

## Risks / Trade-offs

- [Specs describe the code as read and could misdescribe a path] → The characterization tests in the next change are
  written from these scenarios; any mismatch is fixed in the spec before archiving that change.
- [Exact copy in scenarios makes copy edits look like spec changes] → Intended: changing what the user reads is a
  behavior change and should go through a change proposal.
- [Formatting depends on the ICU data of the runtime] → Scenarios record today's Node 22/24 output; tests will run on
  the same Node version as the Docker image.
