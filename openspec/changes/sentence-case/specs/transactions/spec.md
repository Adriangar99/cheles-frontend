## MODIFIED Requirements

### Requirement: Month navigation and search
The screen SHALL open on the current month with the same month navigation as «Mi mes», plus a «Buscar…» search box.
Changing the month or the search text reloads the list after 250 ms without further changes, requesting up to 500
transactions of that month that match the text.

#### Scenario: Search
- **WHEN** the user types «merca» and stops typing
- **THEN** after 250 ms the list shows the month's transactions whose counterparty or description contain «merca»

#### Scenario: Typing quickly
- **WHEN** the user types several characters within 250 ms
- **THEN** only one request is made, with the final text

### Requirement: Transaction list
The screen SHALL show the number of loaded transactions as «<n> movimientos» and group them by day, newest first.
Each day has a heading with its date (see locale-formatting) and the day's total, which adds up its non-transfer
amounts, in green when positive. Each transaction shows the counterparty (or the description, or «—»), its account,
« · pendiente» for pending ones, and the signed amount, in green for credits. With no results it shows «Nada por
aquí».

#### Scenario: Pending debit
- **WHEN** the list has a pending €12.50 debit at MERCADONA on 3 October in account «Nómina»
- **THEN** the row shows «MERCADONA», «Nómina · pendiente» and «-12,50 €» under the heading «Sábado, 3 de octubre»

#### Scenario: Day total
- **WHEN** 3 October has a €62.40 debit, a €2000 credit and a €300 transfer out
- **THEN** the heading of 3 October shows «1937,60 €» in green

#### Scenario: Empty month
- **WHEN** no transaction matches
- **THEN** the header reads «0 movimientos» and the list shows «Nada por aquí»

### Requirement: Category selection
Each non-transfer transaction SHALL have a category selector listing the categories that match its sign (income
categories for credits, expense categories otherwise), plus its current category if it is of the other kind, and
«Sin categoría» when it has none. Choosing a category assigns it manually and reloads the list.

#### Scenario: Change category
- **WHEN** the user picks «🍽 Restaurantes» for a debit
- **THEN** the category is saved as manual and the list reloads showing Restaurantes

#### Scenario: Categories offered for a credit
- **WHEN** the user opens the selector of a credit
- **THEN** only income categories are listed, plus the current one if it is an expense category

### Requirement: Transfer toggle (⇄)
Each non-transfer transaction SHALL have a ⇄ button that marks it as a transfer between own accounts. Transfers are
shown dimmed, without a category selector, and with a «⇄ Entre mis cuentas (quitar)» button that marks them as normal
again. Each toggle reloads the list.

#### Scenario: Mark as transfer
- **WHEN** the user taps ⇄ on a normal transaction
- **THEN** it becomes a transfer, appears dimmed and shows «⇄ Entre mis cuentas (quitar)»

#### Scenario: Unmark a transfer
- **WHEN** the user taps «⇄ Entre mis cuentas (quitar)»
- **THEN** it becomes a normal transaction with its category selector
