# Tasks

Characterization tests are updated first to the new texts (and seen failing), then the code. Commit before mutation
checks.

## 1. Texts

- [x] 1.1 Tests and e2e to the new texts; then components, domain labels (roles, statuses, comparisons, outcomes), placeholders, accessible names and tooltips; `capitalize()` for month and day headings; remove `text-transform: lowercase` from headings
- [ ] 1.2 Search for any lowercase-initial text left (JSX text, `aria-label`, `placeholder`, `title`, option labels, string literals shown to the user) and fix or justify each

## 2. Verification

- [ ] 2.1 Fakes and stories updated; Storybook screenshots of every screen in both themes reviewed; axe; docs quoting texts updated; `pnpm check`, `typecheck`, `test`, `build`, `build-storybook`, `pnpm e2e`, CI
