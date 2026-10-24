## ADDED Requirements

### Requirement: Load and edit errors
When loading the transactions or saving a category or ⇄ change fails, the screen SHALL show the API's error message
below the search box. A load error disappears once the list loads; an edit error disappears with the next edit.

#### Scenario: List unavailable
- **WHEN** the transactions request fails with «Error 500»
- **THEN** «Error 500» is shown below the search box

#### Scenario: Change rejected
- **WHEN** the user picks a category and the API answers 400 «Categoría inexistente»
- **THEN** «Categoría inexistente» is shown and the list is not reloaded

#### Scenario: Error cleared by the next edit
- **WHEN** an edit error is shown and the next edit succeeds
- **THEN** the error disappears
