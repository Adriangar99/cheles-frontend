## MODIFIED Requirements

### Requirement: API error messages
When an API call fails with a status other than 401, the app SHALL surface the API's `detail` message when it is a
text, «Datos no válidos» when the API rejects the request's data (a list of validation errors), or «Error <status>»
when the response has no `detail`.

#### Scenario: Error with detail
- **WHEN** the API responds 502 with `{"detail": "Enable Banking: ..."}`
- **THEN** the error message is «Enable Banking: ...»

#### Scenario: Error without detail
- **WHEN** the API responds 500 without a JSON body
- **THEN** the error message is «Error 500»

#### Scenario: Validation error
- **WHEN** the API responds 422 with a list of validation errors in `detail`
- **THEN** the error message is «Datos no válidos»
