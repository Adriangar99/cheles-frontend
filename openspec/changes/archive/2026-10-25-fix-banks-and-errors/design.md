# Design

## Context

See proposal.md. Banks domain: `consentStatus(connection, now)` returns the tone and text; `ConnectionCard` decides
«reconectar» vs «leer ahora» from `status !== "active"`. `BanksScreen` reads `authorizationMessage(location.search)`
once. `call()` turns any non-string `detail` into `String(detail)`.

## Goals / Non-Goals

**Goals:** the four fixes and the two new backend capabilities on screen.

**Non-Goals:** redesign (block 6).

## Decisions

### Needs reconnecting
`consentStatus` returns `{ tone, text, needsReconnect }`; `needsReconnect` is true when the status is not active or
`days <= 0`, and drives both the text and the button. A zero-day consent (expires today, already past) counts as
passed.

### Validation errors
In `call()`: `typeof detail === "string" ? detail : Array.isArray(detail) ? "Datos no válidos" : "Error <status>"`.

### Clean address
After reading the result, `window.history.replaceState(null, "", window.location.pathname)`; the test location stub
gains a `history` stub that records the replaced URL.

### Removing a connection
`BanksApi.remove(id)`, `useRemoveConnection()` (refetches like the other actions), and a «quitar» button using
`window.confirm` with the message from the spec. It clears the screen message like the other actions.

### Other currencies
`MonthlyFigures` renders `<p role="note">` with «No se cuentan importes en USD, GBP» when `other_currencies` is not
empty.

## Risks / Trade-offs

- [`window.confirm` is plain] → Enough for a single-user app; the redesign can replace it with a dialog component.

## Migration Plan

Code-only; rebuild the image after the backend is deployed. Rollback: revert the PR.
