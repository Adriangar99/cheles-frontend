import { connection } from "@tests/screens";
import { expect, test } from "vitest";
import { authorizationMessage, consentStatus } from "./banks";

// Screen tests cover 90, 10 and expired; these cover the threshold, revoked consents and conflicting results.

const DAY = 86_400_000;
const now = Date.parse("2026-10-15T10:00:00Z");
const validFor = (days: number) => new Date(now + days * DAY).toISOString();

test("exactly 14 days of consent is still healthy", () => {
  expect(consentStatus(connection({ valid_until: validFor(14) }), now)).toEqual({
    tone: "pos",
    text: "al día · 14 días de permiso",
  });
});

test("a revoked connection needs reconnecting", () => {
  expect(consentStatus(connection({ status: "revoked", valid_until: validFor(90) }), now)).toEqual({
    tone: "neg",
    text: "hay que reconectar",
  });
});

test("a failed authorization wins over a successful one", () => {
  expect(authorizationMessage("?connected=1&error=1")).toBe("no se pudo conectar el banco");
});
