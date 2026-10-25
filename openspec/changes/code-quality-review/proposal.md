# Proposal

## Why

A review of the frontend for bad practices (non-null assertions, casts, `any`, lint ignores, fragile tests) found no
`!`, `any` or ignores, but four weak spots, two of which matter before the redesign:

- **Tests are coupled to CSS classes.** Characterization tests find rows, bars and the month header through
  `.row`, `.col`, `.b`, `.bar span` and `.month-nav`, plus 13 `as HTMLElement` casts on those lookups. The redesign
  will rename every class and break tests that describe behavior, not styling.
- **The HTTP boundary is untyped.** `request<T>(path)` returns whatever `T` the caller expects: paths, query
  parameters and bodies are free strings, so a renamed endpoint or field only fails at runtime, despite the generated
  contract.
- **Casts in production code**: `filter as TransactionFilter` (a query that only runs when enabled) and
  `e.target.value as Role` (an unchecked select value).
- **A real 400 ms sleep** in «Typing quickly», and feature tests importing fixtures from `../../../../tests/screens`.

## What Changes

- Semantic markup and accessible names for what the tests need to find: lists of transactions, accounts, categories and
  history months as `ul`/`li`, the history bars and category bars with accessible labels, figures as labelled
  elements. Tests query by role and name only; no CSS class selector and no `as HTMLElement` remain in tests.
- The adapters call the API through `openapi-fetch` typed with the generated `paths`, so paths, parameters, bodies and
  responses are checked by `tsc`; the 401 redirect and error messages stay in one middleware of that client.
- `skipToken` instead of `enabled` + cast in `useTransactions`; a `parseRole` domain guard for the role selector.
- Fake timers in «Typing quickly»; a `@tests/*` path alias for shared fixtures.
- Reviewed and kept: `fetch` stubbing at the HTTP boundary (now through the typed client, still `fetch` underneath),
  inline styles that the redesign will replace.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None (`skip_specs: true`): markup changes are not visible beyond assistive technologies, and behavior is unchanged.

## Impact

- **Features affected**: all screens (markup), all adapters (typed client), shared HTTP client.
- **Dependencies**: `openapi-fetch` (runtime, small).
- **Backend dependency**: none.
- **Security surface**: unchanged (same requests, same redirect).

### Out of scope

- Visual changes (block 6) and the fixes of block 2.
