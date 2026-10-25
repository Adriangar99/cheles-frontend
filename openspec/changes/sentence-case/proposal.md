# Proposal

## Why

Block 8 of the roadmap. The owner noticed that some texts start with a capital and others do not: the interface is in
lowercase («los bancos», «leer ahora», «banco conectado ✓») while the API's messages («Categoría inexistente»,
«Demasiados intentos, espera unos minutos»), the currency note, the removal confirmation and «Sin categoría» in the
spending strip are capitalized, and bank names are forced to lowercase by CSS («bbva»). The owner chose sentence case
everywhere, with names shown as they come.

## What Changes

- Every text that starts a line of the interface starts with a capital: titles, section headings, buttons, labels,
  placeholders, selector options, statuses, notes, messages and accessible names («Mi mes», «Los bancos», «Leer
  ahora», «Día a día», «Banco conectado ✓», «Sin categoría», «Buscar…», «Cheles»).
- Headings show the month and the day with a capital («Octubre de 2026», «Sábado, 3 de octubre»); inside a sentence
  they stay lowercase («… menos que en septiembre»).
- Texts that continue a name or a figure stay as they are («Nómina · pendiente», «6996,80 € en 3 cuentas», «200,00 €
  más que en septiembre»).
- Names (banks, accounts, categories) are shown as they come: the CSS that lowercased section headings goes, so
  «BBVA» and «Revolut» keep their capitals.
- The API's messages already follow the convention; no backend change.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `app-shell`, `bank-management`, `history-import`, `locale-formatting`, `login`, `monthly-overview`, `transactions`:
  their quoted texts in sentence case (same words).

## Impact

- **Features affected**: every screen's copy; no behavior change.
- **Backend dependency**: none.
- **Tests**: characterization and e2e tests updated to the new texts.

### Out of scope

- Rewording any text; the API's messages.
