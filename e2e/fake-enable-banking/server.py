"""A fake Enable Banking for the end-to-end tests: only the routes the Cheles API calls, with deterministic data.

It ignores the API's JWT. Transactions are dated in the current month (never in the future), so «mi mes» shows them.
"""

import json
from datetime import UTC, date, datetime, timedelta
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlencode, urlparse

PUBLIC_URL = "http://127.0.0.1:3101"  # where the browser reaches this server (the authorization page)
CODE = "e2e-code"
MAIN_IBAN = "ES7600490000111122223333"
SAVINGS_IBAN = "ES7600490000444455556666"

redirects: dict[str, str] = {}  # authorization state -> the API's callback URL


def day(offset: int) -> str:
    """A day of the current month, `offset` days after the 1st, but never after today."""
    today = date.today()
    return (today.replace(day=1) + timedelta(days=min(offset, today.day - 1))).isoformat()


def tx(ref: str, amount: str, debit: bool, booking_date: str, **parties: object) -> dict[str, object]:
    return {
        "entry_reference": ref,
        "transaction_amount": {"amount": amount, "currency": "EUR"},
        "credit_debit_indicator": "DBIT" if debit else "CRDT",
        "booking_date": booking_date,
        "status": "BOOK",
        "remittance_information": [],
        **parties,
    }


def transactions(uid: str) -> list[dict[str, object]]:
    if uid == "acc-main":
        return [
            tx("salary", "2000.00", False, day(0), debtor={"name": "EMPRESA SL"}, remittance_information=["NOMINA"]),
            tx("groceries", "62.40", True, day(1), creditor={"name": "MERCADONA"}),
            tx("dinner", "24.90", True, day(2), creditor={"name": "RESTAURANTE LA PLAZA"}),
            tx("to-savings", "300.00", True, day(3), creditor_account={"iban": SAVINGS_IBAN}),
        ]
    if uid == "acc-savings":
        return [tx("from-main", "300.00", False, day(3), debtor_account={"iban": MAIN_IBAN})]
    return []


BALANCES = {"acc-main": "1612.70", "acc-savings": "5300.00"}

SESSION = {
    "session_id": "e2e-session",
    "accounts": [
        {"uid": "acc-main", "name": "Cuenta Online", "currency": "EUR", "identification_hash": "h-main",
         "account_id": {"iban": MAIN_IBAN}},
        {"uid": "acc-savings", "name": "Ahorro", "currency": "EUR", "identification_hash": "h-savings",
         "account_id": {"iban": SAVINGS_IBAN}},
    ],
}


class Handler(BaseHTTPRequestHandler):
    def _json(self, body: object, status: int = 200) -> None:
        data = json.dumps(body).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def _body(self) -> dict[str, object]:
        length = int(self.headers.get("Content-Length") or 0)
        return json.loads(self.rfile.read(length) or b"{}")

    def do_GET(self) -> None:
        url = urlparse(self.path)
        query = {k: v[0] for k, v in parse_qs(url.query).items()}
        if url.path == "/aspsps":
            self._json({"aspsps": [{"name": "Banco E2E", "country": query.get("country", "ES"), "logo": None}]})
        elif url.path == "/authorize":
            # The bank's page: authorize at once and send the browser back to the API
            target = f"{redirects.pop(query['state'])}?{urlencode({'code': CODE, 'state': query['state']})}"
            self.send_response(303)
            self.send_header("Location", target)
            self.end_headers()
        elif url.path.startswith("/accounts/") and url.path.endswith("/balances"):
            uid = url.path.split("/")[2]
            amount = {"amount": BALANCES.get(uid, "0.00"), "currency": "EUR"}
            self._json({"balances": [{"balance_type": "ITAV", "balance_amount": amount}]})
        elif url.path.startswith("/accounts/") and url.path.endswith("/transactions"):
            since = query.get("date_from", "0000-00-00")
            found = [t for t in transactions(url.path.split("/")[2]) if str(t["booking_date"]) >= since]
            self._json({"transactions": found, "continuation_key": None})
        else:
            self._json({"message": "not found"}, 404)

    def do_POST(self) -> None:
        body = self._body()
        if self.path == "/auth":
            state = str(body["state"])
            redirects[state] = str(body["redirect_url"])
            self._json({"url": f"{PUBLIC_URL}/authorize?{urlencode({'state': state})}"})
        elif self.path == "/sessions" and body.get("code") == CODE:
            valid_until = (datetime.now(UTC) + timedelta(days=180)).isoformat()
            self._json({**SESSION, "access": {"valid_until": valid_until}})
        else:
            self._json({"message": "invalid request"}, 422)

    def do_DELETE(self) -> None:
        self._json({}) if self.path.startswith("/sessions/") else self._json({"message": "not found"}, 404)


if __name__ == "__main__":
    ThreadingHTTPServer(("0.0.0.0", 8080), Handler).serve_forever()
