## MODIFIED Requirements

### Requirement: Transaction list
The screen SHALL show the number of loaded transactions as «<n> movimientos» and group them by day, newest first.
Each day has a heading with its date (see locale-formatting) and the day's total, which adds up its non-transfer
amounts, in green when positive. Each transaction shows its title (or «—»), under it in grey the bank's description
when it differs from the title, its account, « · pendiente» for pending ones, and the signed amount, in green for
credits. With no results it shows «nada por aquí».

#### Scenario: Pending debit
- **WHEN** the list has a pending €12.50 debit titled MERCADONA on 3 October in account «Nómina»
- **THEN** the row shows «MERCADONA», «Nómina · pendiente» and «-12,50 €» under the heading «sábado, 3 de octubre»

#### Scenario: Day total
- **WHEN** 3 October has a €62.40 debit, a €2000 credit and a €300 transfer out
- **THEN** the heading of 3 October shows «1937,60 €» in green

#### Scenario: Empty month
- **WHEN** no transaction matches
- **THEN** the header reads «0 movimientos» and the list shows «nada por aquí»

#### Scenario: Bank detail under the title
- **WHEN** a transaction is titled «ACME FUEL» and its description is
  «PAGO CON TARJETA EN GASOLINERAS // PAGO CON TARJETA // ACME FUEL»
- **THEN** the row shows «ACME FUEL» and, under it, the description
- **AND** a transaction whose description is empty or equal to its title shows no detail line

## ADDED Requirements

### Requirement: Full text of truncated texts
Texts in a transaction row that may be cut with an ellipsis (its title, its bank detail and its category selector)
SHALL show their full text on hover.

#### Scenario: Hover a long transaction
- **WHEN** the user hovers the title, the detail or the category selector of a transaction in «Restaurantes»
- **THEN** each shows its full text: the title, the description and «🍽 Restaurantes»
