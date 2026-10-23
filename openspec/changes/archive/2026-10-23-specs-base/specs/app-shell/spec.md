# Spec Delta

## Purpose

Provides the frame around every authenticated screen: keeps visitors without a session out of the app pages, offers
the bottom tab navigation between the three screens, and sets the page metadata for a private, installable web app.

## ADDED Requirements

### Requirement: Session guard for app pages
The web app SHALL redirect to `/login` any page request that carries no `cheles_session` cookie, except `/login`,
`/api/*`, Next.js assets, `favicon.ico`, `manifest.webmanifest` and `icon.svg`. It only checks that the cookie exists;
the API validates the session.

#### Scenario: No session cookie
- **WHEN** a browser without the `cheles_session` cookie opens `/movimientos`
- **THEN** it is redirected to `/login`

#### Scenario: Stale session cookie
- **WHEN** the browser has a `cheles_session` cookie that the API no longer accepts and opens `/`
- **THEN** the page loads and its first API call returns 401, which navigates to `/login`

#### Scenario: Login page is reachable
- **WHEN** a browser without a session opens `/login`
- **THEN** the login page is shown

### Requirement: Bottom tab navigation
Every app page SHALL show a fixed bottom tab bar with «mi mes» (`/`), «movimientos» (`/movimientos`) and «bancos»
(`/bancos`), highlighting the tab whose path exactly matches the current path.

#### Scenario: Navigate between screens
- **WHEN** the user taps «movimientos»
- **THEN** the transactions screen opens and the «movimientos» tab is highlighted

#### Scenario: Login has no tabs
- **WHEN** the login page is shown
- **THEN** no tab bar is displayed

### Requirement: Page metadata
The web app SHALL declare Spanish as the document language, the title «Cheles», a dark theme color, no indexing by
search engines, and iOS home-screen web app support.

#### Scenario: Metadata
- **WHEN** any page is loaded
- **THEN** the document has `lang="es"`, title «Cheles», theme color `#121212`, `robots` set to noindex/nofollow,
  `mobile-web-app-capable` and the iOS web app title «Cheles» with a `black-translucent` status bar
