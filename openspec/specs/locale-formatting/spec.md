# locale-formatting Specification

## Purpose

Keeps amounts, months and dates consistent across every screen, using the conventions of Spanish (Spain) users.

## Requirements

### Requirement: Money format
Amounts SHALL be formatted as euros with the es-ES locale: decimal comma, «€» after the number, and a «.» thousands
separator only from five integer digits up (es-ES does not group four-digit numbers). A missing amount is shown as «—».

#### Scenario: Four digits are not grouped
- **WHEN** the amount 1234.5 is shown
- **THEN** it reads «1234,50 €»

#### Scenario: Five digits are grouped
- **WHEN** the amount 12345.5 is shown
- **THEN** it reads «12.345,50 €»

#### Scenario: Negative amount
- **WHEN** the amount -12.5 is shown
- **THEN** it reads «-12,50 €»

#### Scenario: Missing amount
- **WHEN** the amount is null
- **THEN** it reads «—»

### Requirement: Month label
A month (`YYYY-MM`) SHALL be labeled with its es-ES long name and year in lowercase («octubre de 2026»). Headings
display it with every word capitalized («Octubre De 2026»).

#### Scenario: Month heading
- **WHEN** the month `2026-10` is shown as a heading
- **THEN** the label is «octubre de 2026» and the heading displays «Octubre De 2026»

### Requirement: Month arithmetic
Moving a month forward or backward SHALL produce a valid `YYYY-MM` across year boundaries, and the current month SHALL
be derived from the current date in the user's local time zone.

#### Scenario: Forward across the year
- **WHEN** moving one month forward from `2026-12`
- **THEN** the result is `2027-01`

#### Scenario: Backward across the year
- **WHEN** moving one month back from `2026-01`
- **THEN** the result is `2025-12`

#### Scenario: Just after midnight on the first day
- **WHEN** a screen opens at 00:30 on 1 November 2026 in Madrid (still 31 October in UTC)
- **THEN** the current month is `2026-11`

### Requirement: Short dates and timestamps
Transaction dates SHALL be shown as day and short month in es-ES (e.g. «3 oct»), and sync timestamps as day, short
month, hour and minutes (e.g. «23 oct, 19:00»).

#### Scenario: Transaction date
- **WHEN** a transaction dated 2026-10-03 is listed
- **THEN** its date reads «3 oct»
