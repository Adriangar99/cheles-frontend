# bank-management Specification

## Purpose

The «bancos» screen: shows where the transactions come from and the health of each bank connection, and lets the user
refresh data, reconnect or add banks, decide what each account is for, reprocess everything and log out.

## Requirements

### Requirement: Connection status
For each connection the screen SHALL show the bank name and a status line: «hay que reconectar» (red) when it is not
active or its consent date has passed, «caduca en <n> días» (red) when fewer than 14 days of consent remain, or «al día
· <n> días de permiso» (green) otherwise. It also shows when it was last read («leído el 23 oct, 19:00»; «Sincronizando…»
for an active connection never read yet; «sin leer aún» for an inactive one) and the first 120 characters of the last
error. While an active connection has never been read, the screen reloads every 5 seconds, for at most 10 minutes.

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
- **WHEN** an expired connection has no last sync time
- **THEN** it shows «sin leer aún»

#### Scenario: First sync in progress
- **WHEN** an active connection has no last sync time and its first sync ends a few seconds later
- **THEN** it shows «Sincronizando…», and after the next reload it shows when it was read

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

### Requirement: Connecting a new bank
Under «añadir un banco» the screen SHALL offer «conectar un banco», which loads the available banks and lists each with
a «conectar» button. Choosing one sends the browser to that bank's authorization page.

#### Scenario: Pick a bank
- **WHEN** the user taps «conectar un banco» and then «conectar» next to Revolut
- **THEN** the browser navigates to Revolut's authorization page

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

### Requirement: Accounts and their role
Under each connection the screen SHALL list its accounts with name, «·· <last 4 IBAN digits>» when known and balance,
and a selector with «día a día», «ahorro» and «no cuenta». Changing it saves the account's role and reloads the screen.
Hovering an account's name shows it in full, with its IBAN digits.

#### Scenario: Change role
- **WHEN** the user selects «ahorro» for an account
- **THEN** the role is saved as `savings` and the screen reloads

#### Scenario: Hover a long account name
- **WHEN** the user hovers the account «Cuenta Online Sin Comisiones» ending in 1234
- **THEN** its full text «Cuenta Online Sin Comisiones ·· 1234» is shown

### Requirement: Reprocess
Under «si algo no cuadra» the screen SHALL offer «hazlo ahora», which reprocesses every transaction, shows «…» while
busy and reloads the screen, explaining that it «recalcula categorías y transferencias; no cambia lo que has tocado a
mano».

#### Scenario: Reprocess
- **WHEN** the user taps «hazlo ahora»
- **THEN** the button shows «…» until the reprocess finishes and the screen reloads

### Requirement: Action errors
When loading the connections, syncing, reprocessing, changing a role, loading the bank list, connecting a bank or
logging out fails, the screen SHALL show the error message near the top. Starting a sync, a reprocess or a role
change clears the previous message; opening the bank list, connecting and logging out do not.

#### Scenario: Bank list unavailable
- **WHEN** loading the available banks fails with «Enable Banking: ...»
- **THEN** «Enable Banking: ...» is shown

#### Scenario: Message cleared by the next action
- **WHEN** an error is shown and the user taps «leer ahora»
- **THEN** the error disappears while the sync runs

#### Scenario: Connections unavailable
- **WHEN** loading the connections fails with «Error 500»
- **THEN** «Error 500» is shown

#### Scenario: Connecting fails
- **WHEN** the user taps «conectar» for a bank and the API answers 503 «Enable Banking no está configurado»
- **THEN** «Enable Banking no está configurado» is shown and the browser stays on the screen

#### Scenario: Logout fails
- **WHEN** the user taps «salir» and the API answers 500
- **THEN** «Error 500» is shown and the browser stays on the screen

### Requirement: Logout
The screen SHALL offer «salir», which closes the session and navigates to `/login`.

#### Scenario: Log out
- **WHEN** the user taps «salir»
- **THEN** the session is closed and the browser navigates to `/login`

### Requirement: Accounts without a bank
When the API returns accounts that no longer belong to any connection, the screen SHALL list them under «cuentas sin
banco», after the connections, with the same name, IBAN tail, balance and role selector as connection accounts. The
section is not shown when there are none.

#### Scenario: Detached account
- **WHEN** the API returns a detached account «Colchón» with IBAN ending 9876
- **THEN** «cuentas sin banco» lists «Colchón ·· 9876» with its balance and role selector

#### Scenario: Role of a detached account
- **WHEN** the user selects «ahorro» for a detached account
- **THEN** the role is saved as `savings` and the screen reloads

#### Scenario: No detached accounts
- **WHEN** every account belongs to a connection
- **THEN** «cuentas sin banco» is not shown

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

### Requirement: Summary of banks and accounts
Above the connections the screen SHALL show the total balance of the euro accounts that count («día a día» and
«ahorro», with or without a bank), «en 1 cuenta» or «en <n> cuentas», and how many connections need attention (those showing «hay que
reconectar» or «caduca en <n> días»): «1 banco necesita atención» or «<n> bancos necesitan atención» in stamp color,
or «todos los bancos al día» in credit color. It is not shown while there are no connections and no accounts.

#### Scenario: A bank needs attention
- **WHEN** BBVA is healthy with «Nómina» (día a día, 1000 €) and «Colchón» (ahorro, 500 €), and ING is expired with an
  account that does not count (12 €)
- **THEN** the summary shows «1500,00 €», «en 2 cuentas» and «1 banco necesita atención» in stamp color

#### Scenario: Every bank up to date
- **WHEN** every connection is healthy
- **THEN** the summary shows «todos los bancos al día» in credit color

#### Scenario: Nothing connected yet
- **WHEN** there are no connections and no accounts
- **THEN** no summary is shown
