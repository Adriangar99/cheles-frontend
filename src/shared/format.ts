const eur = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
export const money = (n: number | null | undefined) => (n == null ? "—" : eur.format(n));

export const monthLabel = (m: string) =>
  new Date(`${m}-01T00:00:00`).toLocaleDateString("es-ES", { month: "long", year: "numeric" });

export const dayMonth = (date: string) =>
  new Date(date).toLocaleDateString("es-ES", { day: "numeric", month: "short" });

export const dayMonthTime = (timestamp: string) =>
  new Date(timestamp).toLocaleString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
