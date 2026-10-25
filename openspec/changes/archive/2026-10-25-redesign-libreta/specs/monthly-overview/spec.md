## MODIFIED Requirements

### Requirement: Month navigation
The screen SHALL open on the current month, show it as a heading with its lowercase label (e.g. «octubre de 2026»)
and offer previous/next buttons. The next button is disabled on the current month.

#### Scenario: Default month
- **WHEN** the user opens `/` in October 2026
- **THEN** the heading reads «octubre de 2026» and the next button is disabled

#### Scenario: Go to the previous month
- **WHEN** the user taps the previous button
- **THEN** the heading changes to the previous month and the figures are reloaded for it

#### Scenario: Year boundary
- **WHEN** the user goes back from January 2026
- **THEN** the month shown is December 2025

### Requirement: Monthly figures
For the selected month the screen SHALL show a sheet of figures, one line each, for «ingresos», «gastos», «sobra»
(net, in credit color when zero or positive and in stamp color when negative) and «enviado a ahorro», plus a line for
«saldo total ahora» with the total balance and the «día a día» and «ahorro» balances (0 when missing).

#### Scenario: Positive month
- **WHEN** the summary has income 2000, expenses 1200, net 800 and saved 300
- **THEN** the figures show «2000,00 €», «1200,00 €», «800,00 €» in credit color and «300,00 €»

#### Scenario: Negative month
- **WHEN** the net is -150
- **THEN** «sobra» shows «-150,00 €» in stamp color

#### Scenario: No savings accounts
- **WHEN** the balances have no `savings` entry
- **THEN** the «saldo total ahora» line shows «ahorro 0,00 €»

### Requirement: Spending by category
Under «la nómina repartida» the screen SHALL show the month's money as one strip whose length is the income, or the
expenses when they are larger: one segment per spending category in its color, proportional to its amount, followed
by what is left. Below the strip, one line per category with its icon, name, amount and share of the strip, and a last
line for what is left («sobra»). With no spending it shows «sin gastos este mes».

#### Scenario: Spending breakdown
- **WHEN** the month has income 2000 €, Supermercado 300 € and Restaurantes 120 €
- **THEN** Supermercado takes 15 % of the strip, Restaurantes 6 %, and «sobra» the remaining 79 %

#### Scenario: Spending over income
- **WHEN** the month has income 1000 € and Supermercado 1250 €
- **THEN** the strip's length is the expenses, Supermercado takes all of it and nothing is left

#### Scenario: No spending
- **WHEN** the month has no counted debits
- **THEN** «sin gastos este mes» is shown

## ADDED Requirements

### Requirement: Comparison with the previous month
Under «ingresos», «gastos» and «sobra» the screen SHALL show how each differs from the previous month, taken from the
twelve-month history: «<amount> más que en <month>», «<amount> menos que en <month>» or «igual que en <month>», with
the previous month's long name. A rise is shown in credit color for «ingresos» and «sobra» and in stamp color for
«gastos», a fall the other way round, and no change without color. Nothing is compared when the history has no entry
for the previous month.

#### Scenario: Spending rose
- **WHEN** October has income 2000, expenses 1200 and net 800, and the history has September with income 2000 and
  expenses 1000
- **THEN** «ingresos» shows «igual que en septiembre», «gastos» shows «200,00 € más que en septiembre» in stamp color
  and «sobra» shows «200,00 € menos que en septiembre» in stamp color

#### Scenario: No previous month in the history
- **WHEN** the history has no entry for the month before the one shown
- **THEN** no comparison is shown
