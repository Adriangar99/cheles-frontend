# Tasks

TDD: changed scenarios get their tests first. Commit before mutation checks. Show screenshots to the user before
marking the redesign done.

## 1. Foundations

- [x] 1.1 Fonts (`@fontsource` Plex Sans and Mono) and the light/dark token set (colors, type scale, spacing, radii); `color-scheme` and the theme color meta; Storybook toolbar to switch themes; verify axe on every story in both themes

## 2. Primitives

- [ ] 2.1 Restyle `Button`, `Card`/`List`/`ListItem` as ruled sheets, `Figures`/`Figure` as ledger lines, `Message`, `Amount` in mono; custom `Select` with an aligned chevron; new `Stamp`; verify Storybook, axe, and the characterization tests

## 3. Screens

- [ ] 3.1 «mi mes»: tests first for the modified scenarios (lowercase heading, ledger figures, «la nómina repartida» shares, spending over income), then the strip with its one-time grow motion (respecting reduced motion) and legend lines
- [ ] 3.2 «movimientos» and «bancos» (printed lines, «quitar» in the header, stamps) and the login cover; verify every characterization test

## 4. Review and verification

- [ ] 4.1 Screenshots of every screen in both themes (e2e and Storybook) reviewed with the user; `docs/design-system.md` updated; `pnpm check`, `typecheck`, `test`, `build`, `build-storybook`, `pnpm e2e` and CI pass

## Workflow follow-up

- Archive with spec sync. Next: block 7 (CSV import).
