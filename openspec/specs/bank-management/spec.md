# bank-management Specification

## Purpose

The «bancos» screen: shows where the transactions come from and the health of each bank connection, and lets the user
refresh data, reconnect or add banks, decide what each account is for, reprocess everything and log out.

## Requirements

### Requirement: Connection status
For each connection the screen SHALL show the bank name and a status line: «hay que reconectar» (red) when it is not
active, «caduca en <n> días» (red) when fewer than 14 days of consent remain, or «al día · <n> días de permiso» (green)
otherwise. It also shows when it was last read («leído el 23 oct, 19:00», or «sin leer aún») and the first 120
characters of the last error.

#### Scenario: Healthy connection
- **WHEN** an active connection has 90 days of consent left
- **THEN** it shows «al día · 90 días de permiso» in green

#### Scenario: Consent about to expire
- **WHEN** an active connection has 10 days left
- **THEN** it shows «caduca en 10 días» in red

#### Scenario: Expired connection
- **WHEN** the connection status is `expired`
- **THEN** it shows «hay que reconectar» in red

#### Scenario: Never synced
- **WHEN** the connection has no last sync time
- **THEN** it shows «sin leer aún»

### Requirement: Manual sync and reconnect
An active connection SHALL offer «leer ahora», which syncs it, shows «leyendo…» while busy and reloads the screen. A
connection that is not active SHALL offer «reconectar», which starts a new authorization with that bank (country ES)
and sends the browser to the bank's page.

#### Scenario: Read now
- **WHEN** the user taps «leer ahora»
- **THEN** the button shows «leyendo…» and is disabled until the sync finishes, then the screen reloads

#### Scenario: Reconnect
- **WHEN** the user taps «reconectar» on an expired BBVA connection
- **THEN** the browser navigates to the BBVA authorization page

### Requirement: Connecting a new bank
Under «añadir un banco» the screen SHALL offer «conectar un banco», which loads the available banks and lists each with
a «conectar» button. Choosing one sends the browser to that bank's authorization page.

#### Scenario: Pick a bank
- **WHEN** the user taps «conectar un banco» and then «conectar» next to Revolut
- **THEN** the browser navigates to Revolut's authorization page

### Requirement: Result of the bank authorization
When the screen is opened with `?connected=1` it SHALL show «banco conectado ✓», and with `?error=1` it SHALL show «no
se pudo conectar el banco».

#### Scenario: Back from a successful authorization
- **WHEN** the API redirects to `/bancos?connected=1`
- **THEN** «banco conectado ✓» is shown

#### Scenario: Back from a failed authorization
- **WHEN** the API redirects to `/bancos?error=1`
- **THEN** «no se pudo conectar el banco» is shown

### Requirement: Accounts and their role
Under each connection the screen SHALL list its accounts with name, «·· <last 4 IBAN digits>» when known and balance,
and a selector with «día a día», «ahorro» and «no cuenta». Changing it saves the account's role and reloads the screen.

#### Scenario: Change role
- **WHEN** the user selects «ahorro» for an account
- **THEN** the role is saved as `savings` and the screen reloads

### Requirement: Reprocess
Under «si algo no cuadra» the screen SHALL offer «hazlo ahora», which reprocesses every transaction, shows «…» while
busy and reloads the screen, explaining that it «recalcula categorías y transferencias; no cambia lo que has tocado a
mano».

#### Scenario: Reprocess
- **WHEN** the user taps «hazlo ahora»
- **THEN** the button shows «…» until the reprocess finishes and the screen reloads

### Requirement: Action errors
When syncing, reprocessing, changing a role or loading the bank list fails, the screen SHALL show the error message
near the top. Starting a sync, a reprocess or a role change clears the previous message; opening the bank list does
not.

#### Scenario: Bank list unavailable
- **WHEN** loading the available banks fails with «Enable Banking: ...»
- **THEN** «Enable Banking: ...» is shown

#### Scenario: Message cleared by the next action
- **WHEN** an error is shown and the user taps «leer ahora»
- **THEN** the error disappears while the sync runs

### Requirement: Logout
The screen SHALL offer «salir», which closes the session and navigates to `/login`.

#### Scenario: Log out
- **WHEN** the user taps «salir»
- **THEN** the session is closed and the browser navigates to `/login`
