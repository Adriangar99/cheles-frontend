## MODIFIED Requirements

### Requirement: Bottom tab navigation
Every app page SHALL show a fixed bottom tab bar with «Mi mes» (`/`), «Movimientos» (`/movimientos`) and «Bancos»
(`/bancos`), highlighting the tab whose path exactly matches the current path.

#### Scenario: Navigate between screens
- **WHEN** the user taps «Movimientos»
- **THEN** the transactions screen opens and the «Movimientos» tab is highlighted

#### Scenario: Login has no tabs
- **WHEN** the login page is shown
- **THEN** no tab bar is displayed
