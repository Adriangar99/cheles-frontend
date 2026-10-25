## ADDED Requirements

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
