# Features

What each screen of the Cheles web app does. The specs under `openspec/specs/` are the source of truth (every scenario
has a test); each section links to them. Copy is Spanish (Spain); quoted literals are what the user sees.

## Login — [login](../openspec/specs/login/spec.md)

Username, password and the 6-digit code from the authenticator app. «Datos incorrectos» for any wrong credential;
after 5 failures the API asks to wait.

## «Mi mes» — [monthly overview](../openspec/specs/monthly-overview/spec.md)

- The current month (local time), with previous/next navigation.
- «Ingresos», «Gastos», «Sobra» (green or red), «Enviado a ahorro» and «Saldo total ahora» with the day-to-day and
  savings balances.
- «La nómina repartida»: the month's money split into categories and what is left; «Últimos 12 meses»: income and expense bars.
- A note when amounts in other currencies were left out; load errors below the heading.

## «Movimientos» — [transactions](../openspec/specs/transactions/spec.md)

- The month's transactions grouped by day with the day's total, with search («Buscar…»), account and «pendiente»
  marks.
- Change a category (only those of the transaction's sign) and mark or unmark a transfer between your own accounts
  (⇄); load and edit errors below the search box.

## «Bancos» — [bank management](../openspec/specs/bank-management/spec.md), [history import](../openspec/specs/history-import/spec.md)

- Each connection's consent status («Al día», «Caduca en N días», «Hay que reconectar»), last read and last error.
- «Leer ahora», «Reconectar» (in the connection's country) and «Quitar» (with confirmation; accounts stay under
  «Cuentas sin banco»).
- Each account's role: «Día a día», «Ahorro» or «No cuenta».
- A summary on top: balance of the accounts that count and how many banks need attention.
- «Importar movimientos»: choose a MoneyLover CSV export, pick where each of its wallets goes (a new account, an
  existing one, or «No importar») seeing what would happen (rows to import, rows the bank already has, rows imported
  before, balance adjustments left out, categories without an equivalent), then import.
- «Conectar un banco», «Hazlo ahora» (reprocess) and «Salir».

## Everywhere — [app shell](../openspec/specs/app-shell/spec.md), [API access](../openspec/specs/api-access/spec.md), [locale formatting](../openspec/specs/locale-formatting/spec.md)

- Bottom tabs, a session guard that sends visitors without a session to the login, Spanish metadata.
- The browser only talks to the web app: `/api/*` is proxied to the API, an expired session goes back to the login,
  API errors are shown with their message.
- Euros and dates in es-ES («1234,50 €», «12.345,50 €», «3 oct»).
