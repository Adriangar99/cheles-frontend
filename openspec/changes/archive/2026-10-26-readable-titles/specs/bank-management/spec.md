## MODIFIED Requirements

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
