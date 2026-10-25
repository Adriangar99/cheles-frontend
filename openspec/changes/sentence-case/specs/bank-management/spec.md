## MODIFIED Requirements

### Requirement: Connection status
For each connection the screen SHALL show the bank name and a status line: «Hay que reconectar» (red) when it is not
active or its consent date has passed, «Caduca en <n> días» (red) when fewer than 14 days of consent remain, or «Al día
· <n> días de permiso» (green) otherwise. It also shows when it was last read («Leído el 23 oct, 19:00», or «Sin leer
aún») and the first 120 characters of the last error.

#### Scenario: Healthy connection
- **WHEN** an active connection has 90 days of consent left
- **THEN** it shows «Al día · 90 días de permiso» in green

#### Scenario: Consent about to expire
- **WHEN** an active connection has 10 days left
- **THEN** it shows «Caduca en 10 días» in red

#### Scenario: Expired connection
- **WHEN** the connection status is `expired`
- **THEN** it shows «Hay que reconectar» in red

#### Scenario: Never synced
- **WHEN** the connection has no last sync time
- **THEN** it shows «Sin leer aún»

#### Scenario: Consent date already passed
- **WHEN** an active connection's consent ended 3 days ago and no sync has marked it expired yet
- **THEN** it shows «Hay que reconectar» in red and offers «Reconectar»

### Requirement: Manual sync and reconnect
An active connection SHALL offer «Leer ahora», which syncs it, shows «Leyendo…» while busy and reloads the screen. A
connection that needs reconnecting SHALL offer «Reconectar», which starts a new authorization with that bank in the
connection's country and sends the browser to the bank's page.

#### Scenario: Read now
- **WHEN** the user taps «Leer ahora»
- **THEN** the button shows «Leyendo…» and is disabled until the sync finishes, then the screen reloads

#### Scenario: Reconnect
- **WHEN** the user taps «Reconectar» on an expired BBVA connection
- **THEN** the browser navigates to the BBVA authorization page

#### Scenario: Reconnect in the connection's country
- **WHEN** the user taps «Reconectar» on an expired Revolut connection whose country is `LT`
- **THEN** the authorization is started for Revolut in `LT`

### Requirement: Connecting a new bank
Under «Añadir un banco» the screen SHALL offer «Conectar un banco», which loads the available banks and lists each with
a «Conectar» button. Choosing one sends the browser to that bank's authorization page.

#### Scenario: Pick a bank
- **WHEN** the user taps «Conectar un banco» and then «Conectar» next to Revolut
- **THEN** the browser navigates to Revolut's authorization page

### Requirement: Result of the bank authorization
When the screen is opened with `?connected=1` it SHALL show «Banco conectado ✓», and with `?error=1` it SHALL show «No
se pudo conectar el banco». The parameter is then removed from the address, so reloading the screen does not show the
message again.

#### Scenario: Back from a successful authorization
- **WHEN** the API redirects to `/bancos?connected=1`
- **THEN** «Banco conectado ✓» is shown

#### Scenario: Back from a failed authorization
- **WHEN** the API redirects to `/bancos?error=1`
- **THEN** «No se pudo conectar el banco» is shown

#### Scenario: Reloading after the result
- **WHEN** «Banco conectado ✓» was shown
- **THEN** the address is `/bancos` without parameters

### Requirement: Accounts and their role
Under each connection the screen SHALL list its accounts with name, «·· <last 4 IBAN digits>» when known and balance,
and a selector with «Día a día», «Ahorro» and «No cuenta». Changing it saves the account's role and reloads the screen.

#### Scenario: Change role
- **WHEN** the user selects «Ahorro» for an account
- **THEN** the role is saved as `savings` and the screen reloads

### Requirement: Reprocess
Under «Si algo no cuadra» the screen SHALL offer «Hazlo ahora», which reprocesses every transaction, shows «…» while
busy and reloads the screen, explaining that it «Recalcula categorías y transferencias; no cambia lo que has tocado a
mano».

#### Scenario: Reprocess
- **WHEN** the user taps «Hazlo ahora»
- **THEN** the button shows «…» until the reprocess finishes and the screen reloads

### Requirement: Action errors
When loading the connections, syncing, reprocessing, changing a role, loading the bank list, connecting a bank or
logging out fails, the screen SHALL show the error message near the top. Starting a sync, a reprocess or a role
change clears the previous message; opening the bank list, connecting and logging out do not.

#### Scenario: Bank list unavailable
- **WHEN** loading the available banks fails with «Enable Banking: ...»
- **THEN** «Enable Banking: ...» is shown

#### Scenario: Message cleared by the next action
- **WHEN** an error is shown and the user taps «Leer ahora»
- **THEN** the error disappears while the sync runs

#### Scenario: Connections unavailable
- **WHEN** loading the connections fails with «Error 500»
- **THEN** «Error 500» is shown

#### Scenario: Connecting fails
- **WHEN** the user taps «Conectar» for a bank and the API answers 503 «Enable Banking no está configurado»
- **THEN** «Enable Banking no está configurado» is shown and the browser stays on the screen

#### Scenario: Logout fails
- **WHEN** the user taps «Salir» and the API answers 500
- **THEN** «Error 500» is shown and the browser stays on the screen

### Requirement: Logout
The screen SHALL offer «Salir», which closes the session and navigates to `/login`.

#### Scenario: Log out
- **WHEN** the user taps «Salir»
- **THEN** the session is closed and the browser navigates to `/login`

### Requirement: Accounts without a bank
When the API returns accounts that no longer belong to any connection, the screen SHALL list them under «Cuentas sin
banco», after the connections, with the same name, IBAN tail, balance and role selector as connection accounts. The
section is not shown when there are none.

#### Scenario: Detached account
- **WHEN** the API returns a detached account «Colchón» with IBAN ending 9876
- **THEN** «Cuentas sin banco» lists «Colchón ·· 9876» with its balance and role selector

#### Scenario: Role of a detached account
- **WHEN** the user selects «Ahorro» for a detached account
- **THEN** the role is saved as `savings` and the screen reloads

#### Scenario: No detached accounts
- **WHEN** every account belongs to a connection
- **THEN** «Cuentas sin banco» is not shown

### Requirement: Removing a connection
Each connection SHALL offer «Quitar», which asks for confirmation («¿Quitar <banco>? Sus cuentas y movimientos se
quedan en "cuentas sin banco".») and then removes it and reloads the screen; its accounts then appear under «Cuentas
sin banco». Cancelling does nothing. Like the other actions, removing clears the previous message and shows its error
if it fails.

#### Scenario: Remove a connection
- **WHEN** the user taps «Quitar» on BBVA and confirms
- **THEN** the connection is removed and the screen reloads

#### Scenario: Cancel removing
- **WHEN** the user taps «Quitar» and cancels
- **THEN** nothing is requested

#### Scenario: Removing fails
- **WHEN** the user confirms removing a connection and the API answers 500
- **THEN** «Error 500» is shown and the connection stays listed

### Requirement: Summary of banks and accounts
Above the connections the screen SHALL show the total balance of the euro accounts that count («Día a día» and
«Ahorro», with or without a bank), «en 1 cuenta» or «en <n> cuentas», and how many connections need attention (those showing «Hay que
reconectar» or «Caduca en <n> días»): «1 banco necesita atención» or «<n> bancos necesitan atención» in stamp color,
or «Todos los bancos al día» in credit color. It is not shown while there are no connections and no accounts.

#### Scenario: A bank needs attention
- **WHEN** BBVA is healthy with «Nómina» (día a día, 1000 €) and «Colchón» (ahorro, 500 €), and ING is expired with an
  account that does not count (12 €)
- **THEN** the summary shows «1500,00 €», «en 2 cuentas» and «1 banco necesita atención» in stamp color

#### Scenario: Every bank up to date
- **WHEN** every connection is healthy
- **THEN** the summary shows «Todos los bancos al día» in credit color

#### Scenario: Nothing connected yet
- **WHEN** there are no connections and no accounts
- **THEN** no summary is shown
