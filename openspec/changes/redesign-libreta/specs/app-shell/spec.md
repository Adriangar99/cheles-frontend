## MODIFIED Requirements

### Requirement: Page metadata
The web app SHALL declare Spanish as the document language, the title «Cheles», a theme color that follows the
system's light or dark scheme, no indexing by search engines, and iOS home-screen web app support.

#### Scenario: Metadata
- **WHEN** any page is loaded
- **THEN** the document has `lang="es"`, title «Cheles», theme color `#E8ECF1` for the light scheme and `#0E1828` for
  the dark one, `robots` set to noindex/nofollow, `mobile-web-app-capable` and the iOS web app title «Cheles» with the
  `default` status bar
