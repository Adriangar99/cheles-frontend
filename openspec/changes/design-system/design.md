# Design

## Context

See proposal.md. The tests find elements by role and accessible name (code-quality-review), so markup can move into
primitives freely as long as roles, names and the classes the CSS targets stay the same. Feature ports are injected
through context, which lets stories pass in-memory adapters.

## Goals / Non-Goals

**Goals:** one place for tokens and primitives; a browsable catalog of components and screen states; identical look.

**Non-Goals:** new visual design; component library packaging.

## Decisions

### Tokens
`src/shared/ui/tokens.css`: colors (`--color-bg`, `--color-surface`, `--color-surface-raised`, `--color-line`,
`--color-text`, `--color-muted`, `--color-positive`, `--color-negative`), `--radius`, the font sizes in use
(`--text-xs` 10px … `--text-xl` 22px) and spacing steps in use. The old short names (`--bg`, `--accent`…) are replaced
everywhere, including inline styles.

### Primitives keep today's DOM
Each primitive renders exactly the element, classes and ARIA the features use now (for example `Meter` renders the
`role="meter"` element with its label and value, `Figure` renders `dt`/`dd` with `data-tone`). Moving markup into them
is a refactor: the characterization tests must pass unchanged, and the e2e screenshots must be pixel-identical before
and after.

### Storybook
- `@storybook/react-vite` (no Next.js server needed: screens are client components; the only Next.js import,
  `next/link` in the tab layout, is not part of the stories), `@storybook/addon-docs` and `@storybook/addon-a11y`.
- `.storybook/preview.tsx` loads `globals.css`, the dark background and a fresh `QueryClient` per story.
- **Fake adapters** per feature (`src/features/<feature>/fake.ts`, exported for stories and future feature tests):
  in-memory implementations of `StatsApi`, `TransactionsApi`, `BanksApi`, `AuthApi`, with ready-made data sets and
  options for empty, pending (never resolving) and failing states.
- Stories live next to what they show (`*.stories.tsx`); a `Tokens.mdx` page shows the palette, type scale, spacing
  and radius.

### CI
`pnpm build-storybook` after the existing checks; the output is not kept.

## Risks / Trade-offs

- [Primitives that only wrap classes look thin] → They are the seam the redesign will change; their props (variant,
  tone, orientation) are the design system's vocabulary.
- [Pixel comparison sensitive to fonts and dates] → Same machine, same day, same e2e data; compared with the e2e run
  just before and just after.

## Migration Plan

Code-only. Rollback: revert the PR.
