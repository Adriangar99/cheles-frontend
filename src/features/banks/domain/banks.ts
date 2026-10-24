import { dayMonthTime } from "@/shared/format";
import type { Connection, Role } from "../api";

const DAY_MS = 86_400_000;
const EXPIRY_WARNING_DAYS = 14;
const ERROR_EXCERPT_LENGTH = 120;

export const ROLE_LABEL: Record<Role, string> = { main: "día a día", savings: "ahorro", excluded: "no cuenta" };

// Part of a day of consent counts as a whole one.
export function consentStatus(connection: Connection, now: number) {
  if (connection.status !== "active") return { tone: "neg", text: "hay que reconectar" } as const;
  const days = Math.ceil((new Date(connection.valid_until).getTime() - now) / DAY_MS);
  return days < EXPIRY_WARNING_DAYS
    ? ({ tone: "neg", text: `caduca en ${days} días` } as const)
    : ({ tone: "pos", text: `al día · ${days} días de permiso` } as const);
}

export const lastReadLabel = (lastSyncedAt: string | null) =>
  lastSyncedAt ? `leído el ${dayMonthTime(lastSyncedAt)}` : "sin leer aún";

export const errorExcerpt = (error: string) => error.slice(0, ERROR_EXCERPT_LENGTH);

// The bank authorization redirects back with ?connected=1 or ?error=1; the error wins if both are present.
export function authorizationMessage(search: string) {
  const params = new URLSearchParams(search);
  if (params.get("error")) return "no se pudo conectar el banco";
  if (params.get("connected")) return "banco conectado ✓";
  return null;
}
