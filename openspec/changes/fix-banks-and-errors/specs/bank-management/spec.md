## MODIFIED Requirements

### Requirement: Connection status
For each connection the screen SHALL show the bank name and a status line: «hay que reconectar» (red) when it is not
active or its consent date has passed, «caduca en <n> días» (red) when fewer than 14 days of consent remain, or «al día
· <n> días de permiso» (green) otherwise. It also shows when it was last read («leído el 23 oct, 19:00», or «sin leer
aún») and the first 120 characters of the last error.

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

#### Scenario: Consent date already passed
- **WHEN** an active connection's consent ended 3 days ago and no sync has marked it expired yet
- **THEN** it shows «hay que reconectar» in red and offers «reconectar»

### Requirement: Manual sync and reconnect
An active connection SHALL offer «leer ahora», which syncs it, shows «leyendo…» while busy and reloads the screen. A
connection that needs reconnecting SHALL offer «reconectar», which starts a new authorization with that bank in the
connection's country and sends the browser to the bank's page.

#### Scenario: Read now
- **WHEN** the user taps «leer ahora»
- **THEN** the button shows «leyendo…» and is disabled until the sync finishes, then the screen reloads

#### Scenario: Reconnect
- **WHEN** the user taps «reconectar» on an expired BBVA connection
- **THEN** the browser navigates to the BBVA authorization page

#### Scenario: Reconnect in the connection's country
- **WHEN** the user taps «reconectar» on an expired Revolut connection whose country is `LT`
- **THEN** the authorization is started for Revolut in `LT`

### Requirement: Result of the bank authorization
When the screen is opened with `?connected=1` it SHALL show «banco conectado ✓», and with `?error=1` it SHALL show «no
se pudo conectar el banco». The parameter is then removed from the address, so reloading the screen does not show the
message again.

#### Scenario: Back from a successful authorization
- **WHEN** the API redirects to `/bancos?connected=1`
- **THEN** «banco conectado ✓» is shown

#### Scenario: Back from a failed authorization
- **WHEN** the API redirects to `/bancos?error=1`
- **THEN** «no se pudo conectar el banco» is shown

#### Scenario: Reloading after the result
- **WHEN** «banco conectado ✓» was shown
- **THEN** the address is `/bancos` without parameters

## ADDED Requirements

### Requirement: Removing a connection
Each connection SHALL offer «quitar», which asks for confirmation («¿Quitar <banco>? Sus cuentas y movimientos se
quedan en "cuentas sin banco".») and then removes it and reloads the screen; its accounts then appear under «cuentas
sin banco». Cancelling does nothing. Like the other actions, removing clears the previous message and shows its error
if it fails.

#### Scenario: Remove a connection
- **WHEN** the user taps «quitar» on BBVA and confirms
- **THEN** the connection is removed and the screen reloads

#### Scenario: Cancel removing
- **WHEN** the user taps «quitar» and cancels
- **THEN** nothing is requested

#### Scenario: Removing fails
- **WHEN** the user confirms removing a connection and the API answers 500
- **THEN** «Error 500» is shown and the connection stays listed
