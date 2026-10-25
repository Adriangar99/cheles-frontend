# Cheles · frontend

The web app of Cheles, a personal finance tool for a single user: see your month at a glance, go through your
transactions and manage your bank connections. Mobile-first Next.js, run with Docker Compose next to the
[Cheles API](https://github.com/Adriangar99/cheles-backend), which it reaches through an `/api/*` rewrite so the browser
only talks to the web app.

- «mi mes»: income, expenses, savings, spending by category and the last 12 months.
- «movimientos»: search, categories and transfers between your own accounts.
- «bancos»: connections, reconnecting and removing banks, account roles.

## Quick start

Install and start the [backend](https://github.com/Adriangar99/cheles-backend) first, then:

    docker compose up -d --build        # http://localhost:3000

## Documentation

| Document | Contents |
| --- | --- |
| [Setup](docs/setup.md) | Docker, local development with `pnpm dev`, `API_URL` |
| [Features](docs/features.md) | What each screen does, with links to the specs |
| [Architecture](docs/architecture.md) | Features, ports, typed API client, enforced boundaries |
| [Development](docs/development.md) | Commands, tests, API contract, workflow |
| [Design system](docs/design-system.md) | Tokens, primitives, Storybook |

Behavior is specified in [`openspec/specs/`](openspec/specs/), one capability per screen or user flow. Installation,
Enable Banking and operations are documented in the [backend](https://github.com/Adriangar99/cheles-backend#documentation).

## Security

Published only on `127.0.0.1`; `X-Frame-Options`, `nosniff`, `no-referrer` and `no-store` headers on the pages it
serves; the session cookie is `HttpOnly` and set by the API.
