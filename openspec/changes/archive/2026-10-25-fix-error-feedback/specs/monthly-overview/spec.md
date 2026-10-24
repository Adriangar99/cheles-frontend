## ADDED Requirements

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
