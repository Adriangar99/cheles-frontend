## MODIFIED Requirements

### Requirement: Spending by category
Under «la nómina repartida» the screen SHALL show the month's money as one strip whose length is the income, or the
expenses when they are larger: one segment per spending category in its color, proportional to its amount, followed
by what is left. Below the strip, one line per category with its icon, name, amount and share of the strip, and a last
line for what is left («sobra»); hovering a category's name shows it in full. With no spending it shows «sin gastos
este mes».

#### Scenario: Spending breakdown
- **WHEN** the month has income 2000 €, Supermercado 300 € and Restaurantes 120 €
- **THEN** Supermercado takes 15 % of the strip, Restaurantes 6 %, and «sobra» the remaining 79 %

#### Scenario: Spending over income
- **WHEN** the month has income 1000 € and Supermercado 1250 €
- **THEN** the strip's length is the expenses, Supermercado takes all of it and nothing is left

#### Scenario: No spending
- **WHEN** the month has no counted debits
- **THEN** «sin gastos este mes» is shown

#### Scenario: Hover a long category name
- **WHEN** the user hovers the category «Hogar, muebles y decoración» in the breakdown
- **THEN** its full name is shown
