# Proposal

## Why

Block 3 of the roadmap, frontend side: the README holds scripts, architecture and conventions in one page and does
not explain what each screen does or how to run the web app against the backend step by step.

## What Changes

- `README.md` becomes a short entry point: what the web app is, its screens in a few lines, a quick start, and links
  (including the backend docs for installation and Enable Banking).
- New `docs/`:
  - `features.md`: each screen («mi mes», «movimientos», «bancos», login) and what the user can do, linking to its spec.
  - `setup.md`: running with Docker after the backend, running locally with `pnpm dev` against the API, `API_URL` at
    build time, the shared Compose project.
  - `architecture.md`: routes, features (domain, port, provider, hooks, components), shared kernel, typed API client,
    boundaries enforced by Biome.
  - `development.md`: pnpm scripts, characterization and feature tests (roles and names only, fake API), the
    spec-coverage meta-test, mutation checks, the API contract (`api:sync`), CI, the OpenSpec workflow.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None (`skip_specs: true`): documentation only.

## Impact

- Docs only.

### Out of scope

- Storybook and Playwright (blocks 4 and 5 add their own docs).
