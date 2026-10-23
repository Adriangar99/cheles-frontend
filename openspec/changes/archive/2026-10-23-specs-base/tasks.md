# Tasks

This change adds no behavior, so there are no TDD tasks; the scenarios become characterization tests in the next
change.

## 1. Review specs against the code

- [x] 1.1 Re-check `api-access`, `app-shell` and `login` against `next.config.ts`, `src/middleware.ts`, `src/lib/api.ts`, `src/app/layout.tsx`, `src/app/(app)/layout.tsx` and `src/app/login/page.tsx`; verify every scenario matches the code (fix the spec, not the code)
- [x] 1.2 Re-check `monthly-overview`, `transactions` and `locale-formatting` against `src/app/(app)/page.tsx`, `src/app/(app)/movimientos/page.tsx` and the helpers in `src/lib/api.ts`; verify every scenario matches the code
- [x] 1.3 Re-check `bank-management` against `src/app/(app)/bancos/page.tsx`; verify every scenario matches the code
- [x] 1.4 Run `openspec validate specs-base --strict` and verify it reports the change as valid

## 2. Documentation

- [x] 2.1 Translate `README.md` to English keeping its content (setup, `API_URL` build-time note, security, OpenSpec workflow) and add a short "Language" note (code and docs in English, UI in Spanish); verify the documented commands are unchanged
- [x] 2.2 Translate the Spanish comments in `Dockerfile`, `.env.example`, `next.config.ts`, `src/middleware.ts` and `src/app/globals.css` to English without touching UI copy; verify with `git diff` that only comment lines changed

## 3. Verification

- [x] 3.1 Run `git diff --stat` and verify only `openspec/`, `README.md` and the files from 2.2 changed
- [x] 3.2 Run `docker compose up -d --build` (backend already up) and verify `http://127.0.0.1:3000/login` returns 200 and `http://127.0.0.1:3000/api/health` returns `{"ok":true}`

## Workflow follow-up

- Archive the change (`/opsx:archive`) so the specs move to `openspec/specs/`.
- Next change: `tooling-and-characterization` (lockfile, Biome, Vitest + Testing Library, characterization tests from these scenarios).
