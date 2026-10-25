# Proposal

## Why

Block 6 of the roadmap. The app looks like a generic dark dashboard (near-black with one green accent, a grid of
identical cards), the native selects look broken (misaligned chevron, a pill shape unlike the rows), and the «quitar»
row in each bank card looks orphaned. The user chose a direction grounded in the subject: **«Libreta de ahorros»**,
the bank passbook, with light and dark themes following the system.

## What Changes

- **Tokens**: a cool paper palette with navy ink (light) and a navy cloth cover (dark), credit and stamp inks, a type
  scale on a 4 px baseline, and spacing tokens; `color-scheme: light dark`.
- **Type**: IBM Plex Sans for the interface and IBM Plex Mono for printed figures (amounts, dates, stamps),
  self-hosted with `@fontsource`.
- **Primitives restyled**: sheets with ruled lines instead of cards, ledger figure lines, controls with a 6 px radius,
  a **custom `Select`** (aligned chevron, same height and shape as buttons), a **`Stamp`** for connection status.
- **«mi mes»**: figures as ledger lines; **«la nómina repartida»**, the month's income as one strip split into spending
  categories and what is left, with legend lines; lowercase month heading.
- **«movimientos»**: printed lines (date, concept, amount) with the category select and ⇄ on a second line.
- **«bancos»**: «quitar» in the connection header; status as a stamp; accounts as printed lines.
- **Login**: the passbook cover.
- Storybook stories in both themes; docs updated.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

- `monthly-overview`: figures as a sheet of lines, spending as «la nómina repartida», lowercase month heading.
- `locale-formatting`: headings show the lowercase month label.

## Impact

- **Features affected**: every screen's look; behavior unchanged except the spending presentation.
- **Dependencies**: `@fontsource/ibm-plex-sans`, `@fontsource/ibm-plex-mono`.
- **Backend dependency**: none.
- **Security surface**: none (fonts are bundled, no third-party requests).

### Out of scope

- New features or copy changes beyond the spending section's title; the CSV import (block 7).
