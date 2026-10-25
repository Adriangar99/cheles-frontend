# Proposal

## Why

Block 5 of the roadmap: a design system the user can browse and the redesign (block 6) can change in one place. Today
the look lives in `src/app/globals.css` (9 color variables and a radius, plus ~25 class rules) and each feature
component repeats the same markup by hand (`btn`, `card`, `row`, `stat`, `bar`, inline styles). There is no catalog of
components or states.

## What Changes

- **Tokens**: the current colors and radius, plus the type sizes and spacing already in use, move to
  `src/shared/ui/tokens.css` as named CSS variables; `globals.css` uses them.
- **Primitives** in `src/shared/ui/` that render today's markup and classes: `Button`, `Card`, `List`/`ListItem`,
  `Figures`/`Figure`, `Select`, `Message` (alert, status, note), `Meter` (horizontal and vertical bars), `Amount`
  (signed money with tone). The features use them instead of hand-written markup. **The look does not change**: the
  e2e screenshots before and after are compared pixel by pixel.
- **Storybook** (React + Vite, with the docs and accessibility addons): a tokens page, stories for every primitive and
  its variants, and stories for every screen in its states (loaded, empty, loading, error) rendered with **fake
  adapters** of the feature ports, so no API is needed.
- `pnpm storybook` and `pnpm build-storybook`; CI only checks that Storybook builds.
- `docs/design-system.md`.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None (`skip_specs: true`): no user-visible change.

## Impact

- **Features affected**: every screen's components (markup through primitives), no behavior change; characterization
  and e2e tests stay green unchanged.
- **Dependencies**: Storybook 10 packages (dev).
- **Backend dependency**: none.

### Out of scope

- The redesign itself (block 6), visual regression tests, publishing Storybook.
