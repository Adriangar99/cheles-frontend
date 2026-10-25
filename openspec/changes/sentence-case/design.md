# Design

## Context

An inventory of the frontend's texts (JSX text, string literals, accessible names) and of the API messages it shows:
about 70 interface texts in lowercase, and capitals in the API's messages, «Error <status>», «Datos no válidos», «No
se cuentan importes en …», «¿Quitar …?» and the backend's «Sin categoría» (the selector says «sin categoría»). Section
headings were lowercased by `h2 { text-transform: lowercase }`, which also turned bank names into «bbva».

## Decisions

### The rule
A text that starts a line (or an accessible name, placeholder, option or tooltip) starts with a capital, like a
sentence; the rest of it is unchanged. A leading symbol does not count: «⇄ Entre mis cuentas (quitar)».

### Exceptions
- Continuations of a name or a figure keep their case: «Nómina · pendiente», «en 3 cuentas» after the total,
  comparisons that start with an amount.
- Dates and months inside a sentence stay lowercase («leído el 23 oct» becomes «Leído el 23 oct, 19:00», but «… que
  en septiembre» keeps «septiembre»). `monthLabel` and `dayLabel` keep returning lowercase; headings capitalize the
  first letter with a shared `capitalize()` helper, so the sentence uses stay right.
- Names are data: shown as the bank, the user or the catalog wrote them.

### How
One pass over `src` (components, domain labels, fakes, stories), tests and e2e, guided by the delta specs; then a
search for any lowercase-initial text left (JSX text, `aria-label`, `placeholder`, `title`, `label`), reviewed by hand.
Remove `text-transform: lowercase` from `h2`.

### Spec deltas
Generated from the main specs with the same rule (only quoted texts change; requirement wording is kept), and the
month requirements reworded by hand for the heading/sentence distinction.

## Risks / Trade-offs

- [A text missed in a rarely seen state] → the final search covers JSX text and every text attribute; Storybook
  screenshots of every screen and state are reviewed.

## Migration Plan

Code-only. Rollback: revert the PR.
