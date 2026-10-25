# Design system

The look is «Libreta de ahorros», the bank passbook: ruled sheets on cool paper with navy ink (light) or on the navy
cloth cover (dark), amounts in tabular figures that line up in columns, statuses as short labels. The one memorable
element is «la nómina repartida» in «mi mes»: the month's money as one strip split into categories and what is left.
Each screen opens with what matters most (the month compared with the previous one, the day totals, the bank summary),
and sections share one head (title left, quiet action or figure right) so new information has a place to go. It lives in two places, so a redesign changes them and not the features:

- **Tokens** (`src/shared/ui/tokens.css`): colors for light and dark, type (IBM Plex Sans, bundled with
  `@fontsource`; amounts use its tabular figures), a 4 px spacing scale and two radii
  (sheets 10 px, controls 6 px). The system's color scheme picks the theme; `data-theme` on `<html>` forces one.
  Rules and components use the tokens, never raw values.
- **Primitives** (`src/shared/ui/`, imported from `@/shared/ui`): `Button` (default, primary, quiet; small),
  `Card`, `List`/`ListItem` (a ruled sheet), `Select` (native control with a drawn chevron), `Message`,
  `Figures`/`Figure` (ledger lines; `total` closes the sheet), `Meter` (horizontal, vertical or a strip segment),
  `Amount` and `Stamp`. Features compose screens from them instead of writing markup
  and classes by hand. They render semantic HTML with the roles and names the tests rely on (list items named by
  their label, meters with a value, figures as a definition list, errors as alerts).

## Storybook

    pnpm storybook          # http://localhost:6006
    pnpm build-storybook    # static build (CI checks that it builds)

- **Design system / Tokens**: the palette, type scale and radius.
- **Design system / …**: each primitive and its variants.
- **Screens / …**: every screen in its states (loaded, empty, loading, failed), rendered with the in-memory adapter
  of its feature port (`fakeStatsApi()`, `fakeTransactionsApi()`, `fakeBanksApi()`, `fakeAuthApi()`), so no API is
  needed. In the login story, `123456` is the only valid code.

The toolbar switches the theme (system, light, dark). The accessibility panel (axe) runs on every story; keep it free
of violations in both themes. Motion: only the strip grows, once per month, and not with reduced motion.

## Changing the look

1. Change tokens or a primitive and check it in Storybook.
2. Run `pnpm test` (roles and names must not change) and `pnpm e2e`, and compare the screenshots in
   `e2e/screenshots/` with the previous run.
