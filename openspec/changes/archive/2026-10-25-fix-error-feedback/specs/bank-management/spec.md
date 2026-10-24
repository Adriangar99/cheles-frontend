## MODIFIED Requirements

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

## ADDED Requirements

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
