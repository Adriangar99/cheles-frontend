import { answer, type FakeState } from "@/shared/fakeState";
import type { Account, Banks, BanksApi } from "./api";

const DAY = 86_400_000;
const inDays = (days: number) => new Date(Date.now() + days * DAY).toISOString();
const account = (
  id: number,
  name: string,
  role: Account["role"],
  balance: number,
  connection: number | null,
): Account => ({
  id,
  name,
  role,
  balance,
  currency: "EUR",
  iban_tail: String(1000 + id * 1111).slice(-4),
  balance_at: inDays(0),
  connection_id: connection,
});

const BANKS: Banks = {
  connections: [
    {
      id: 1,
      bank: "BBVA",
      country: "ES",
      status: "active",
      valid_until: inDays(80),
      last_synced_at: inDays(-0.2),
      last_error: null,
      accounts: [account(1, "Nómina", "main", 1612.7, 1), account(2, "Colchón", "savings", 5300, 1)],
    },
    {
      id: 2,
      bank: "Revolut",
      country: "LT",
      status: "active",
      valid_until: inDays(9),
      last_synced_at: null,
      last_error: null,
      accounts: [account(3, "Revolut EUR", "main", 84.1, 2)],
    },
    {
      id: 3,
      bank: "ING",
      country: "ES",
      status: "expired",
      valid_until: inDays(-3),
      last_synced_at: inDays(-40),
      last_error: "Enable Banking 401: consent expired",
      accounts: [account(4, "Cuenta Naranja", "excluded", 12, 3)],
    },
  ],
  detached_accounts: [account(5, "Cuenta antigua", "excluded", 0, null)],
};

// An in-memory BanksApi for stories and feature tests
export function fakeBanksApi(state: FakeState = "loaded"): BanksApi {
  return {
    list: () => answer(state, BANKS, { connections: [], detached_accounts: [] }),
    available: () =>
      answer(
        "loaded",
        [
          { name: "BBVA", country: "ES", logo: null },
          { name: "Revolut", country: "LT", logo: null },
        ],
        [],
      ),
    // The bank's page would open here; a story stays where it is
    connect: async () => "#autorizar",
    sync: () => answer("loaded", undefined, undefined),
    remove: () => answer("loaded", undefined, undefined),
    reprocess: () => answer("loaded", undefined, undefined),
    setRole: () => answer("loaded", undefined, undefined),
  };
}
