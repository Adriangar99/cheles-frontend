export type Account = {
  id: number;
  name: string;
  iban_tail: string | null;
  currency: string;
  role: "main" | "savings" | "excluded";
  balance: number | null;
  balance_at: string | null;
  connection_id: number | null;
};

export type Connection = {
  id: number;
  bank: string;
  status: "active" | "expired" | "revoked";
  valid_until: string;
  last_synced_at: string | null;
  last_error: string | null;
  accounts: Account[];
};

export type Category = { id: number; name: string; kind: "expense" | "income"; icon: string; color: string };

export type Tx = {
  id: number;
  date: string;
  amount: number;
  status: string;
  counterparty: string | null;
  description: string;
  kind: "normal" | "transfer";
  category_id: number | null;
  category_manual: boolean;
  account: string;
};

export type Summary = {
  month: string;
  income: number;
  expenses: number;
  net: number;
  saved: number;
  by_category: { id: number | null; name: string; icon: string; color: string; amount: number }[];
  balances: Record<string, number>;
};

export type HistoryPoint = { month: string; income: number; expenses: number };

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
