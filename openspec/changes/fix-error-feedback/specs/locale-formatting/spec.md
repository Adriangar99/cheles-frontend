## MODIFIED Requirements

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
