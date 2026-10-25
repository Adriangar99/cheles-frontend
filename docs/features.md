# Features

What each screen of the Cheles web app does. The specs under `openspec/specs/` are the source of truth (every scenario
has a test); each section links to them. Copy is Spanish (Spain); quoted literals are what the user sees.

## Login — [login](../openspec/specs/login/spec.md)

Username, password and the 6-digit code from the authenticator app. «Datos incorrectos» for any wrong credential;
after 5 failures the API asks to wait.

## «mi mes» — [monthly overview](../openspec/specs/monthly-overview/spec.md)

- The current month (local time), with previous/next navigation.
- «ingresos», «gastos», «sobra» (green or red), «enviado a ahorro» and «saldo total ahora» with the day-to-day and
  savings balances.
- «en qué se va»: spending by category with proportional bars; «últimos 12 meses»: income and expense bars.
- A note when amounts in other currencies were left out; load errors below the heading.

## «movimientos» — [transactions](../openspec/specs/transactions/spec.md)

- The month's transactions with search («buscar…»), date, account and «pendiente» marks.
- Change a category (only those of the transaction's sign) and mark or unmark a transfer between your own accounts
  (⇄); load and edit errors below the search box.

## «bancos» — [bank management](../openspec/specs/bank-management/spec.md), [history import](../openspec/specs/history-import/spec.md)

- Each connection's consent status («al día», «caduca en N días», «hay que reconectar»), last read and last error.
- «leer ahora», «reconectar» (in the connection's country) and «quitar» (with confirmation; accounts stay under
  «cuentas sin banco»).
- Each account's role: «día a día», «ahorro» or «no cuenta».
- A summary on top: balance of the accounts that count and how many banks need attention.
- «importar movimientos»: choose a MoneyLover CSV export, pick where each of its wallets goes (a new account, an
  existing one, or «no importar») seeing what would happen (rows to import, rows the bank already has, rows imported
  before, balance adjustments left out, categories without an equivalent), then import.
- «conectar un banco», «hazlo ahora» (reprocess) and «salir».

## Everywhere — [app shell](../openspec/specs/app-shell/spec.md), [API access](../openspec/specs/api-access/spec.md), [locale formatting](../openspec/specs/locale-formatting/spec.md)

- Bottom tabs, a session guard that sends visitors without a session to the login, Spanish metadata.
- The browser only talks to the web app: `/api/*` is proxied to the API, an expired session goes back to the login,
  API errors are shown with their message.
- Euros and dates in es-ES («1234,50 €», «12.345,50 €», «3 oct»).
