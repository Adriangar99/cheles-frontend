# transactions Specification

## Purpose

The «movimientos» screen: lets the user go through a month's transactions, search them, fix their category and mark
or unmark them as transfers between their own accounts.

## Requirements

### Requirement: Month navigation and search
The screen SHALL open on the current month with the same month navigation as «mi mes», plus a «buscar…» search box.
Changing the month or the search text reloads the list after 250 ms without further changes, requesting up to 500
transactions of that month that match the text.

#### Scenario: Search
- **WHEN** the user types «merca» and stops typing
- **THEN** after 250 ms the list shows the month's transactions whose counterparty or description contain «merca»

#### Scenario: Typing quickly
- **WHEN** the user types several characters within 250 ms
- **THEN** only one request is made, with the final text

### Requirement: Transaction list
The screen SHALL show the number of loaded transactions as «<n> movimientos» and, for each one, the counterparty (or
the description, or «—»), the date and account (e.g. «3 oct · Nómina»), « · pendiente» for pending ones, and the signed
amount, in green for credits. With no results it shows «nada por aquí».

#### Scenario: Pending debit
- **WHEN** the list has a pending €12.50 debit at MERCADONA on 3 October in account «Nómina»
- **THEN** the row shows «MERCADONA», «3 oct · Nómina · pendiente» and «-12,50 €»

#### Scenario: Empty month
- **WHEN** no transaction matches
- **THEN** the header reads «0 movimientos» and the list shows «nada por aquí»

### Requirement: Category selection
Each non-transfer transaction SHALL have a category selector listing the categories that match its sign (income
categories for credits, expense categories otherwise), plus its current category if it is of the other kind, and
«sin categoría» when it has none. Choosing a category assigns it manually and reloads the list.

#### Scenario: Change category
- **WHEN** the user picks «🍽 Restaurantes» for a debit
- **THEN** the category is saved as manual and the list reloads showing Restaurantes

#### Scenario: Categories offered for a credit
- **WHEN** the user opens the selector of a credit
- **THEN** only income categories are listed, plus the current one if it is an expense category

### Requirement: Transfer toggle (⇄)
Each non-transfer transaction SHALL have a ⇄ button that marks it as a transfer between own accounts. Transfers are
shown dimmed, without a category selector, and with a «⇄ entre mis cuentas (quitar)» button that marks them as normal
again. Each toggle reloads the list.

#### Scenario: Mark as transfer
- **WHEN** the user taps ⇄ on a normal transaction
- **THEN** it becomes a transfer, appears dimmed and shows «⇄ entre mis cuentas (quitar)»

#### Scenario: Unmark a transfer
- **WHEN** the user taps «⇄ entre mis cuentas (quitar)»
- **THEN** it becomes a normal transaction with its category selector
