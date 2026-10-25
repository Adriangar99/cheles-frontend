## ADDED Requirements

### Requirement: Choosing a file
Under «importar movimientos» the «bancos» screen SHALL offer «elegir fichero CSV». Choosing a file requests its
preview with every wallet going to a new account.

#### Scenario: Choose a file
- **WHEN** the user chooses a MoneyLover export with wallets «Cuenta Principal» and «Revolut»
- **THEN** a preview is requested with both wallets sent to `new` and both wallets are listed

#### Scenario: Unrecognized file
- **WHEN** the preview answers 422 «No reconozco este fichero: falta la columna Cuenta»
- **THEN** that message is shown and nothing can be imported

### Requirement: Preview per wallet
For each wallet the screen SHALL show its name, «<n> movimientos · <first date> – <last date>», a selector «dónde
van» with «nueva cuenta», every existing account and «no importar», and what would happen: «entran <n>», «<n> ya
los trajo el banco (desde <date>)» when some are skipped, «<n> ya importados» when some were imported before. Changing
a selector requests the preview again with the new targets. Categories without an equivalent are listed as «sin
equivalencia, irán por reglas: <name> (<rows>), …».

#### Scenario: Wallet onto a bank account
- **WHEN** the user sends «Cuenta Principal» to «Nómina» and the preview answers 300 to import and 120 skipped since
  2026-07-01
- **THEN** the preview was requested with «Cuenta Principal» going to Nómina's id and the wallet shows «entran 300» and
  «120 ya los trajo el banco (desde 1 jul 2026)»

#### Scenario: Not imported
- **WHEN** the user chooses «no importar» for «Revolut»
- **THEN** the preview is requested with «Revolut» going nowhere

#### Scenario: Categories without equivalent
- **WHEN** the preview lists «Ahorro» with 12 rows and «Invertir» with 3
- **THEN** «sin equivalencia, irán por reglas: Ahorro (12), Invertir (3)» is shown

### Requirement: Importing
The screen SHALL offer «importar <n> movimientos» with the total to import (disabled when it is 0) and «cancelar». On
import it shows «<n> movimientos importados ✓», hides the preview and reloads the banks, so new accounts appear under
«cuentas sin banco». «cancelar» hides the preview without importing.

#### Scenario: Import
- **WHEN** the user taps «importar 340 movimientos» and the API answers 340 imported
- **THEN** «340 movimientos importados ✓» is shown and the banks are requested again

#### Scenario: Nothing to import
- **WHEN** every wallet is «no importar»
- **THEN** «importar 0 movimientos» is disabled

#### Scenario: Cancel
- **WHEN** the user taps «cancelar»
- **THEN** the preview disappears and nothing is imported

#### Scenario: Import fails
- **WHEN** the import answers 500
- **THEN** «Error 500» is shown and the preview stays
