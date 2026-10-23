# api-access Specification

## Purpose

Defines how the browser talks to the Cheles API without ever knowing its address, how API errors and expired sessions
reach the user, and which security headers protect every page.

## Requirements

### Requirement: Same-origin API proxy
The web app SHALL forward every request under `/api/*` to the same path on the API, whose internal URL is fixed at
build time (`API_URL`, `http://api:8000` in Docker). The browser only talks to the web app's own origin.

#### Scenario: Proxied request
- **WHEN** the browser requests `/api/stats/summary?month=2026-10`
- **THEN** the web app forwards it to `<API_URL>/api/stats/summary?month=2026-10` and returns the API's response

#### Scenario: API URL fixed at build time
- **WHEN** the image is built with `API_URL=http://api:8000` and run with a different `API_URL`
- **THEN** requests are still forwarded to `http://api:8000`

### Requirement: JSON requests to the API
Client requests to the API SHALL send JSON bodies with `Content-Type: application/json` when a JSON payload is given,
and SHALL parse every successful response as JSON.

#### Scenario: JSON payload
- **WHEN** a screen sends a payload to the API
- **THEN** the request body is the JSON-encoded payload with `Content-Type: application/json`

### Requirement: Expired session redirects to login
When any API call other than the login itself returns 401, the app SHALL navigate the browser to `/login`.

#### Scenario: Session expired while browsing
- **WHEN** a screen calls the API and the response is 401
- **THEN** the browser navigates to `/login`

#### Scenario: Failed login is not redirected
- **WHEN** the login call returns 401
- **THEN** the browser stays on the login page and the error is shown there

### Requirement: API error messages
When an API call fails with a status other than 401, the app SHALL surface the API's `detail` message, or
«Error <status>» when the response has no `detail`.

#### Scenario: Error with detail
- **WHEN** the API responds 502 with `{"detail": "Enable Banking: ..."}`
- **THEN** the error message is «Enable Banking: ...»

#### Scenario: Error without detail
- **WHEN** the API responds 500 without a JSON body
- **THEN** the error message is «Error 500»

### Requirement: Security headers
The web app SHALL send `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: no-referrer`
and `Cache-Control: no-store` on the pages and assets it serves, and SHALL NOT send `X-Powered-By`. Responses proxied
from `/api/*` are passed through with the API's own headers, without these four.

#### Scenario: Headers on a page
- **WHEN** a page such as `/login` is requested
- **THEN** the response has the four security headers and no `X-Powered-By` header

#### Scenario: Proxied API response
- **WHEN** `/api/health` is requested
- **THEN** the response carries the API's headers (including `server: uvicorn`) and none of the four security headers

### Requirement: Local-only exposure
The web app SHALL only be published on `127.0.0.1:3000`, so it is unreachable from other devices on the network.

#### Scenario: Access from another device
- **WHEN** another device on the LAN requests port 3000 of the Mac
- **THEN** the connection is refused
