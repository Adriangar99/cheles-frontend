## MODIFIED Requirements

### Requirement: Month label
A month (`YYYY-MM`) SHALL be labeled with its es-ES long name and year in lowercase («octubre de 2026»), also in
headings.

#### Scenario: Month heading
- **WHEN** the month `2026-10` is shown as a heading
- **THEN** the heading reads «octubre de 2026»

### Requirement: Short dates and timestamps
Transaction days SHALL be shown as weekday, day and month in es-ES (e.g. «sábado, 3 de octubre»), and sync timestamps
as day, short month, hour and minutes (e.g. «23 oct, 19:00»).

#### Scenario: Transaction date
- **WHEN** a transaction dated 2026-10-03 is listed
- **THEN** its day reads «sábado, 3 de octubre»
