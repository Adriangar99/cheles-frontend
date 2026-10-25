## ADDED Requirements

### Requirement: Other currencies warning
When the summary reports currencies left out of the figures, the screen SHALL show below the figures «No se cuentan
importes en <monedas>» with the currency codes joined by commas. Nothing is shown when every amount is in euros.

#### Scenario: Dollars left out
- **WHEN** the summary has `other_currencies` `["USD"]`
- **THEN** «No se cuentan importes en USD» is shown

#### Scenario: Only euros
- **WHEN** `other_currencies` is empty
- **THEN** no currency warning is shown
