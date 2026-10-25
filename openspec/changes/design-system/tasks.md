# Tasks

Refactor note: characterization and e2e tests stay green unchanged after every task; commit before mutation checks.

## 1. Baseline and tokens

- [x] 1.1 Run `pnpm e2e` on `main` and keep its screenshots as the "before"; move the colors, radius and type sizes to `src/shared/ui/tokens.css` with the new names; verify tests pass

## 2. Primitives

- [x] 2.1 `Button`, `Card`, `List`/`ListItem`, `Select`, `Message` in `src/shared/ui/`, used by every feature; verify tests pass
- [ ] 2.2 `Figures`/`Figure`, `Meter`, `Amount`, used by stats, transactions and banks; verify tests pass and the e2e screenshots are pixel-identical to the baseline

## 3. Storybook

- [ ] 3.1 Storybook 10 (react-vite, docs, a11y), preview with styles and a query client, `pnpm storybook` / `pnpm build-storybook`, a tokens page and stories for every primitive; verify it builds and the a11y panel shows no violations on the primitives
- [ ] 3.2 Fake adapters for the four feature ports and stories for every screen in its states (loaded, empty, loading, error); verify they render in Storybook

## 4. Docs and verification

- [ ] 4.1 `docs/design-system.md`, CI step `pnpm build-storybook`; verify `pnpm check`, `pnpm typecheck`, `pnpm test`, `pnpm build`, `pnpm e2e` and CI

## Workflow follow-up

- Archive (`/opsx:archive`; no spec sync). Next: block 6 (redesign with the frontend-design skill).
