import { dayMonthTime } from "@/shared/format";
import type { Banks, Connection, Role } from "../api";

const DAY_MS = 86_400_000;
const EXPIRY_WARNING_DAYS = 14;
const ERROR_EXCERPT_LENGTH = 120;

export const ROLE_LABEL: Record<Role, string> = { main: "Día a día", savings: "Ahorro", excluded: "No cuenta" };

// Part of a day of consent counts as a whole one.
// A consent whose date has passed needs reconnecting even before a sync marks the connection expired.
export function consentStatus(connection: Connection, now: number) {
  const days = Math.ceil((new Date(connection.valid_until).getTime() - now) / DAY_MS);
  if (connection.status !== "active" || days <= 0) {
    return { tone: "neg", text: "Hay que reconectar", needsReconnect: true } as const;
  }
  return days < EXPIRY_WARNING_DAYS
    ? ({ tone: "neg", text: `Caduca en ${days} días`, needsReconnect: false } as const)
    : ({ tone: "pos", text: `Al día · ${days} días de permiso`, needsReconnect: false } as const);
}

// A new connection is answered before its first sync, which goes on in the background until it records a time
const firstSyncRunning = (connection: Connection) => connection.status === "active" && !connection.last_synced_at;

export function lastReadLabel(connection: Connection) {
  if (connection.last_synced_at) return `Leído el ${dayMonthTime(connection.last_synced_at)}`;
  return firstSyncRunning(connection) ? "Sincronizando…" : "Sin leer aún";
}

export const firstSyncPending = (banks: Banks) => banks.connections.some(firstSyncRunning);

export const errorExcerpt = (error: string) => error.slice(0, ERROR_EXCERPT_LENGTH);

// The bank authorization redirects back with ?connected=1 or ?error=1; the error wins if both are present.
export function authorizationMessage(search: string) {
  const params = new URLSearchParams(search);
  if (params.get("error")) return "No se pudo conectar el banco";
  if (params.get("connected")) return "Banco conectado ✓";
  return null;
}

// A value from the role selector, checked against the known roles
export function parseRole(value: string): Role {
  const role = Object.keys(ROLE_LABEL).find((r): r is Role => r === value);
  if (!role) throw new Error(`Unknown account role: ${value}`);
  return role;
}

// The top of the screen: what the euro accounts that count add up to, and how many banks need attention
export function banksSummary(banks: Banks, now: number) {
  const accounts = [...banks.connections.flatMap((c) => c.accounts), ...banks.detached_accounts];
  if (accounts.length === 0 && banks.connections.length === 0) return null;
  const counted = accounts.filter((a) => a.role !== "excluded" && a.currency === "EUR");
  const attention = banks.connections.filter((c) => consentStatus(c, now).tone === "neg").length;
  return {
    total: counted.reduce((sum, a) => Math.round((sum + (a.balance ?? 0)) * 100) / 100, 0),
    accounts: counted.length === 1 ? "en 1 cuenta" : `en ${counted.length} cuentas`,
    attention:
      attention === 0
        ? ({ tone: "pos", text: "Todos los bancos al día" } as const)
        : ({
            tone: "neg",
            text: attention === 1 ? "1 banco necesita atención" : `${attention} bancos necesitan atención`,
          } as const),
  };
}
