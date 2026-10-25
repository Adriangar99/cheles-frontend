# Setup

The web app needs the [Cheles API](https://github.com/Adriangar99/cheles-backend): install and start it first
([backend setup](https://github.com/Adriangar99/cheles-backend/blob/main/docs/setup.md), including Enable Banking and
the user). It creates the Docker network `cheles-net` the web app joins.

## With Docker (normal use)

    docker compose up -d --build        # http://localhost:3000

The port is published only on `127.0.0.1`, so other devices on your network cannot reach it. `API_URL` (the API's
address inside the Docker network, `http://api:8000`) is fixed **at build time**, because Next.js resolves the `/api/*`
rewrite during the build; changing it needs a rebuild.

Both repos share the Compose project name `cheles`, so `api`, `db` and `web` show up together. Never run
`docker compose down --remove-orphans` from one repo: it would also remove the other repo's containers.

## Locally with `pnpm dev`

Requires Node 22+ and pnpm, which Corepack provides at the version pinned in `package.json` (`corepack enable`; never
npm or yarn).

The API publishes no port. To reach it from the Mac while developing, forward a local port into the Docker network
for as long as you need it:

    docker run -d --rm --name cheles-api-forward --network cheles-net -p 127.0.0.1:8000:8000 \
      alpine/socat tcp-listen:8000,fork,reuseaddr tcp-connect:api:8000

Then:

    pnpm install
    API_URL=http://localhost:8000 pnpm dev      # http://localhost:3000

Stop the forward with `docker stop cheles-api-forward` when you are done.
