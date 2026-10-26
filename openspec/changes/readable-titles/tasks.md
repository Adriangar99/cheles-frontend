# Tasks

TDD: write the scenario test first and see it fail for the right reason.

## 1. Transactions

- [x] 1.1 Sync the API copy (`pnpm api:sync`) and add `title` to the `tx` fixture
- [x] 1.2 Tests «Pending debit» (by title), «Bank detail under the title» and «Hover a long transaction», then add `Truncated` to `src/shared/ui`, `rowLabel`/`rowDetail` in the transactions domain and use them in `TransactionRow` (with the selected category as the selector's `title`)

## 2. Banks and monthly overview

- [x] 2.1 Tests «Never synced», «First sync in progress» and «Hover a long account name», then add the syncing label and `firstSyncPending` to the banks domain, poll from `useBanks`, and use `Truncated` in `AccountRow`
- [x] 2.2 Test «Hover a long category name», then use `Truncated` in `SpendingByCategory`

## 3. Verification

- [x] 3.1 Typecheck, Biome, Vitest (spec-coverage included), Storybook build; `docker compose up -d --build` and check the three screens; open the PR and verify CI

## Workflow follow-up

- Archive with spec sync. Then rebuild the local containers of both repos from `main`.
