# Cheles · frontend

Cheles web app (working name): mobile-first Next.js. It talks to the
[cheles-backend](https://github.com/Adriangar99/cheles-backend) API through an `/api/*` rewrite, so the browser only
knows about the web app.

## Getting started

Start the backend first (it creates the Docker network `cheles-net`), then:

    docker compose up -d --build        # http://localhost:3000

Without Docker: `npm install && API_URL=http://localhost:8000 npm run dev` (with the API reachable at that URL).

`API_URL` is fixed **at build time** (Next resolves rewrites during the build); it defaults to `http://api:8000`.

Both repos share the Compose project name `cheles`, so `api`, `db` and `web` show up together. Never run
`docker compose down --remove-orphans` from one repo: it would also remove the other repo's containers.

## Security

Port published only on `127.0.0.1`; `X-Frame-Options`, `nosniff`, `no-referrer` and `no-store` headers on the pages
it serves (proxied `/api/*` responses keep the API's own headers).

## Language

Code, specs and documentation are written in English. The app's user-facing copy is Spanish (Spain).

## Development with OpenSpec

Changes are planned with [OpenSpec](https://github.com/Fission-AI/OpenSpec) (`openspec/`), using the Claude Code
commands `/opsx:explore`, `/opsx:propose`, `/opsx:update`, `/opsx:apply`, `/opsx:sync` and `/opsx:archive`. Current
behavior is specified under `openspec/specs/`, one capability per screen or user flow.
