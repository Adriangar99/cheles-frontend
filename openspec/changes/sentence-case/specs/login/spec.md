## MODIFIED Requirements

### Requirement: Login form
The login page SHALL show the heading «Cheles», the subtitle «Entra para ver tus cuentas», three required fields
(«Usuario», «Contraseña» and «Código de 6 dígitos») and an «Entrar» button. The code field accepts at most 6
characters, opens a numeric keyboard and supports one-time-code autofill.

#### Scenario: Empty field
- **WHEN** the user submits with any field empty
- **THEN** the browser blocks the submission and no request is sent

#### Scenario: Code autofill
- **WHEN** the device offers a one-time code
- **THEN** it can be filled into the code field

### Requirement: Failed login feedback
While the login request is in progress the «Entrar» button SHALL be disabled. If the login fails, the app SHALL show
the API's error message below the fields and re-enable the button.

#### Scenario: Wrong credentials
- **WHEN** the API rejects the login with «Datos incorrectos»
- **THEN** «Datos incorrectos» is shown and the button is enabled again

#### Scenario: Too many attempts
- **WHEN** the API responds «Demasiados intentos, espera unos minutos»
- **THEN** that message is shown

#### Scenario: Request in progress
- **WHEN** the user has submitted and the API has not answered yet
- **THEN** the «Entrar» button is disabled
