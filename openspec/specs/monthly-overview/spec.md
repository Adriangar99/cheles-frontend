# monthly-overview Specification

## Purpose

The «mi mes» home screen: shows at a glance how much came in and went out in a month, where the money went, how much
was set aside, the current total balance and the trend over the last 12 months.

## Requirements

### Requirement: Month navigation
The screen SHALL open on the current month, show it as a heading (e.g. «Octubre De 2026») and offer previous/next
buttons. The next button is disabled on the current month.

#### Scenario: Default month
- **WHEN** the user opens `/` in October 2026
- **THEN** the heading reads «Octubre De 2026» and the next button is disabled

#### Scenario: Go to the previous month
- **WHEN** the user taps the previous button
- **THEN** the heading changes to the previous month and the figures are reloaded for it

#### Scenario: Year boundary
- **WHEN** the user goes back from January 2026
- **THEN** the month shown is December 2025

### Requirement: Monthly figures
For the selected month the screen SHALL show cards for «ingresos», «gastos», «sobra» (net, green when zero or
positive and red when negative) and «enviado a ahorro», plus a wide «saldo total ahora» card with the total balance
and the «día a día» and «ahorro» balances (0 when missing).

#### Scenario: Positive month
- **WHEN** the summary has income 2000, expenses 1200, net 800 and saved 300
- **THEN** the cards show «2000,00 €», «1200,00 €», «800,00 €» in green and «300,00 €»

#### Scenario: Negative month
- **WHEN** the net is -150
- **THEN** «sobra» shows «-150,00 €» in red

#### Scenario: No savings accounts
- **WHEN** the balances have no `savings` entry
- **THEN** the «saldo total ahora» card shows «ahorro 0,00 €»

### Requirement: Spending by category
Under «en qué se va» the screen SHALL list each category of the month's spending with its icon, name, amount and a bar
in the category's color whose length is proportional to the largest category. With no spending it shows
«sin gastos este mes».

#### Scenario: Spending breakdown
- **WHEN** the month has Supermercado 300 € and Restaurantes 120 €
- **THEN** Supermercado shows a full-width bar and Restaurantes a bar at 40%

#### Scenario: No spending
- **WHEN** the month has no counted debits
- **THEN** «sin gastos este mes» is shown

### Requirement: Twelve-month history chart
Under «últimos 12 meses» the screen SHALL show, for each month returned by the history (up to 12), a green income bar
and a red expense bar scaled to the largest value, the month number below, a tooltip with the month and both amounts,
and the legend «verde = ingresos · rojo = gastos». The history does not change with the selected month.

#### Scenario: History bars
- **WHEN** the history has September with income 2000 and expenses 1000 as the largest value
- **THEN** September's income bar is at full height (70 px) and its expense bar at half height, labeled «09»

#### Scenario: Month navigation does not reload history
- **WHEN** the user changes the selected month
- **THEN** the history chart stays the same and is not requested again

### Requirement: Load errors
When loading the selected month's summary or the history fails, the screen SHALL show the API's error message below
the month heading (the summary's first if both fail). The message disappears once the failed data loads, for example
after changing the month.

#### Scenario: Summary unavailable
- **WHEN** the summary request fails with «Error 500»
- **THEN** «Error 500» is shown below the heading and no figures are shown

#### Scenario: History unavailable
- **WHEN** the history request fails with «Error 503»
- **THEN** «Error 503» is shown below the heading and the month's figures are still shown

#### Scenario: Error cleared by changing the month
- **WHEN** the summary failed for the current month and the user goes to the previous month, which loads
- **THEN** the error disappears and that month's figures are shown
