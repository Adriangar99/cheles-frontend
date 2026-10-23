import type { components } from "@/shared/api/schema";

type Schemas = components["schemas"];

export type Account = Schemas["AccountOut"];
export type Connection = Schemas["ConnectionOut"];
export type Category = Schemas["CategoryOut"];
export type Tx = Schemas["TransactionOut"];
export type Summary = Schemas["SummaryOut"];
export type HistoryPoint = Schemas["MonthTotalsOut"];

export async function api<T = unknown>(path: string, init?: RequestInit & { json?: unknown }): Promise<T> {
  const res = await fetch(`/api${path}`, {
    ...init,
    headers: init?.json ? { "Content-Type": "application/json" } : undefined,
    body: init?.json ? JSON.stringify(init.json) : init?.body,
  });
  if (res.status === 401 && !path.startsWith("/auth/login")) {
    window.location.href = "/login";
    throw new Error("No autenticado");
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail ?? `Error ${res.status}`);
  }
  return res.json();
}

const eur = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
export const money = (n: number | null | undefined) => (n == null ? "—" : eur.format(n));

export const monthLabel = (m: string) =>
  new Date(`${m}-01T00:00:00`).toLocaleDateString("es-ES", { month: "long", year: "numeric" });

export const shiftMonth = (m: string, delta: number) => {
  const [y, mo] = m.split("-").map(Number);
  const d = new Date(y, mo - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export const currentMonth = () => shiftMonth(new Date().toISOString().slice(0, 7), 0);
