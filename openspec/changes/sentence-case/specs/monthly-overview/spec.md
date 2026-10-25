## MODIFIED Requirements

### Requirement: Month navigation
The screen SHALL open on the current month, show it as a heading with a capital first letter (e.g. «Octubre de 2026»)
and offer previous/next buttons. The next button is disabled on the current month.

#### Scenario: Default month
- **WHEN** the user opens `/` in October 2026
- **THEN** the heading reads «Octubre de 2026» and the next button is disabled

#### Scenario: Go to the previous month
- **WHEN** the user taps the previous button
- **THEN** the heading changes to the previous month and the figures are reloaded for it

#### Scenario: Year boundary
- **WHEN** the user goes back from January 2026
- **THEN** the month shown is December 2025

### Requirement: Monthly figures
For the selected month the screen SHALL show a sheet of figures, one line each, for «Ingresos», «Gastos», «Sobra»
(net, in credit color when zero or positive and in stamp color when negative) and «Enviado a ahorro», plus a line for
«Saldo total ahora» with the total balance and the «Día a día» and «Ahorro» balances (0 when missing).

#### Scenario: Positive month
- **WHEN** the summary has income 2000, expenses 1200, net 800 and saved 300
- **THEN** the figures show «2000,00 €», «1200,00 €», «800,00 €» in credit color and «300,00 €»

#### Scenario: Negative month
- **WHEN** the net is -150
- **THEN** «Sobra» shows «-150,00 €» in stamp color

#### Scenario: No savings accounts
- **WHEN** the balances have no `savings` entry
- **THEN** the «Saldo total ahora» line shows «ahorro 0,00 €»

### Requirement: Spending by category
Under «La nómina repartida» the screen SHALL show the month's money as one strip whose length is the income, or the
expenses when they are larger: one segment per spending category in its color, proportional to its amount, followed
by what is left. Below the strip, one line per category with its icon, name, amount and share of the strip, and a last
line for what is left («Sobra»). With no spending it shows «Sin gastos este mes».

#### Scenario: Spending breakdown
- **WHEN** the month has income 2000 €, Supermercado 300 € and Restaurantes 120 €
- **THEN** Supermercado takes 15 % of the strip, Restaurantes 6 %, and «Sobra» the remaining 79 %

#### Scenario: Spending over income
- **WHEN** the month has income 1000 € and Supermercado 1250 €
- **THEN** the strip's length is the expenses, Supermercado takes all of it and nothing is left

#### Scenario: No spending
- **WHEN** the month has no counted debits
- **THEN** «Sin gastos este mes» is shown

### Requirement: Twelve-month history chart
Under «Últimos 12 meses» the screen SHALL show, for each month returned by the history (up to 12), a green income bar
and a red expense bar scaled to the largest value, the month number below, a tooltip with the month and both amounts,
and the legend «Verde = ingresos · rojo = gastos». The history does not change with the selected month.

#### Scenario: History bars
- **WHEN** the history has September with income 2000 and expenses 1000 as the largest value
- **THEN** September's income bar is at full height (70 px) and its expense bar at half height, labeled «09»

#### Scenario: Month navigation does not reload history
- **WHEN** the user changes the selected month
- **THEN** the history chart stays the same and is not requested again

### Requirement: Comparison with the previous month
Under «Ingresos», «Gastos» and «Sobra» the screen SHALL show how each differs from the previous month, taken from the
twelve-month history: «<amount> más que en <month>», «<amount> menos que en <month>» or «Igual que en <month>», with
the previous month's long name. A rise is shown in credit color for «Ingresos» and «Sobra» and in stamp color for
«Gastos», a fall the other way round, and no change without color. Nothing is compared when the history has no entry
for the previous month.

#### Scenario: Spending rose
- **WHEN** October has income 2000, expenses 1200 and net 800, and the history has September with income 2000 and
  expenses 1000
- **THEN** «Ingresos» shows «Igual que en septiembre», «Gastos» shows «200,00 € más que en septiembre» in stamp color
  and «Sobra» shows «200,00 € menos que en septiembre» in stamp color

#### Scenario: No previous month in the history
- **WHEN** the history has no entry for the month before the one shown
- **THEN** no comparison is shown
