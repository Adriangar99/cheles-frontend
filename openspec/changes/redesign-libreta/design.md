# Design

## Context

Block 6 of the roadmap. Tokens and primitives live in `src/shared/ui` (design-system), tests find elements by role
and name, e2e saves screenshots of every screen, and Storybook shows every primitive and screen state. The user chose
the «Libreta de ahorros» direction and light/dark following the system. Known defects: native selects look odd
(misaligned chevron, pill shape unlike the rows) and the «quitar» row in bank cards looks orphaned.

## Subject

A private account book for one person in Spain. Its job: open it on the phone and know, at a glance, what came in this
month, where it went and what is left. Its vernacular: la nómina, la libreta de ahorros, el recibo, la hucha. The
reference object is the **bank passbook** (libreta): a stiff cover, ruled pages, lines printed by a passbook printer
with the date, the concept and the amount aligned in columns, and stamps from the branch.

## Design plan

### Color (light: the page of a passbook; dark: its cloth cover)

| Token | Light | Dark | Role |
| --- | --- | --- | --- |
| paper | `#E8ECF1` | `#0E1828` | page background (cool, never cream or black) |
| sheet | `#F8F9FB` | `#152238` | ruled sheets that hold lines |
| ink | `#1B2A47` | `#E4E9F1` | text, printed figures |
| faded ink | `#5B6A84` | `#93A0B6` | dates, secondary text |
| rule | `#CBD4E0` | `#24334E` | ruling between lines |
| cover | `#24427A` | `#8FB0F0` | primary actions, focus, the cover |
| credit | `#276D4D` | `#71C99E` | money in, healthy states |
| stamp | `#B23A31` | `#F08A80` | money out over income, states that need action |

All text/background pairs meet WCAG AA in both themes (checked with axe on every story).

### Type

- **IBM Plex Sans** for everything: a banking-era grotesk, regular and semibold. Amounts use its tabular figures
  (`font-variant-numeric: tabular-nums`) so they align in columns and stay as easy to read as the text.
- Self-hosted with `@fontsource` (no requests to Google at runtime, works in Next.js and Storybook).
- *Review round*: the first pass printed amounts and statuses in IBM Plex Mono; the owner found it harder to read and
  the tilted stamps odd, so mono was dropped.
- Scale from 13 to 32 px on a 4 px baseline; titles in sentence case and lowercase month names, no all-caps anywhere.

### Layout

One column, left aligned, 560 px max, 16 px gutters. Sheets have a 10 px radius; controls 6 px (hierarchy, not one
radius everywhere). No shadows: sheets sit on the paper with a 1 px rule.

    octubre de 2026                    [‹] [›]
    ┌ sheet ─────────────────────────────────────┐
    │ ingresos                          2000,00 € │   ledger lines: label left,
    │ gastos                            1287,30 € │   mono amount right
    │ sobra                              712,70 € │
    └─────────────────────────────────────────────┘
    la nómina repartida
    ██████████▓▓▓▓▓▒▒░░░░░░░░░░░░░░░░░░░░░░░░░░░░  one strip = what came in
    🏠 Vivienda       750,00 €   38 %              legend lines in the same order
    🛒 Supermercado   312,40 €   16 %
    sobra             712,70 €   36 %

Movements are grouped by day (heading with the date and the day's total) on sheets, one line per movement (concept
and account | amount). Bank status is a **status label**: straight, a soft tint of its color with a dot, in credit or
stamp color. «quitar» moves into the connection's header, next to the bank name.

### Principles

- **One memorable thing**: «la nómina repartida», the month's income as one strip split into what each category took
  and what is left. Everything else stays quiet.
- **Readable figures**: every amount right aligned with tabular figures; credits in credit ink, overspending in
  stamp ink.
- **Information that grows**: each screen opens with what matters most (the month's figures with how they compare to
  the previous month, the bank summary, the day totals); sections share one head pattern (title left, quiet action
  right) so new figures and actions have a place.
- **Paper, not cards**: content sits on ruled sheets; no card grids, no gradients, no shadows.
- **One motion**: the strip's segments grow once when a month loads (none with reduced motion).

### Review against the generic defaults

- *Near-black with one bright accent* (today's look): replaced by cool paper and navy ink; the dark theme is a navy
  cloth cover, not black.
- *Cream with a serif display*: rejected; the paper is cool blue-grey and the type is a grotesk.
- *Broadsheet hairlines everywhere*: ruling only inside sheets, sheets keep a radius.
- *Monospace for small labels*: no mono at all after the review round.
- *Middle-dot meta strings*: kept only where the specs fix the copy («al día · 90 días de permiso»); new copy avoids
  them.

## Decisions

### Selects
`Select` drops the native look (`appearance: none`), takes the control height and 6 px radius, and draws its chevron
as an inline SVG positioned in the padding, so it aligns in every browser. Focus ring in cover color.

### «quitar»
Moves into the connection header (`h2` row: bank name left, «quitar» as a quiet text button right). The card keeps
only the status line and the accounts.

### Theme
Tokens defined for light under `:root` and dark under `@media (prefers-color-scheme: dark)`; `color-scheme: light
dark`. The theme color meta follows the scheme.

### Review round (owner feedback)
Tilted mono stamps read as decoration and mono amounts were harder to read: `Stamp` becomes a straight status label
(tinted background, dot, sans) and amounts use Plex Sans tabular figures; `@fontsource/ibm-plex-mono` is removed. The
owner asked for more information that can grow later, and chose three additions: the comparison with the previous
month in «mi mes» (from the history already loaded, no new request), movements grouped by day with day totals, and a
summary at the top of «bancos». All three are computed in the frontend from data the screens already load.

### Spec changes
- `monthly-overview`: figures as ledger lines instead of cards (same literals and tones); spending as «la nómina
  repartida»; the month heading shows the lowercase label.
- `locale-formatting`: headings show the lowercase label («octubre de 2026»); transaction days read «sábado, 3 de
  octubre».
- `monthly-overview` (added): comparison with the previous month.
- `transactions`: grouped by day with day totals; rows show the account instead of the date.
- `bank-management` (added): summary of banks and accounts.
- `app-shell`: theme color per scheme.
Everything else keeps its copy and behavior.

### Verification
Storybook first (every primitive and screen state in both themes), axe on every story in both themes, characterization
and e2e tests (updated only where the specs change), and screenshots shown to the user for review.

## Risks / Trade-offs

- [Category colors come from the API and may clash with the paper] → They are used only for strip segments and legend
  dots; checked against both themes.
- [Two webfonts add weight] → Two families, Latin subset, two weights each (~100 KB).

## Migration Plan

Code-only; rebuild the image. Rollback: revert the PR.
