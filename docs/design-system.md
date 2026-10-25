# Design system

The look of the web app lives in two places, so a redesign changes them and not the features:

- **Tokens** (`src/shared/ui/tokens.css`): colors, radius and type scale as CSS variables. Rules and components use
  the tokens, never raw values.
- **Primitives** (`src/shared/ui/`, imported from `@/shared/ui`): `Button`, `Card`, `List`/`ListItem`, `Select`,
  `Message`, `Figures`/`Figure`, `Meter` and `Amount`. Features compose screens from them instead of writing markup
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

The accessibility panel (axe) runs on every story; keep it free of violations.

## Changing the look

1. Change tokens or a primitive and check it in Storybook.
2. Run `pnpm test` (roles and names must not change) and `pnpm e2e`, and compare the screenshots in
   `e2e/screenshots/` with the previous run.
