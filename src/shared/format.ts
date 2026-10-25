const eur = new Intl.NumberFormat("es-ES", { style: "currency", currency: "EUR" });
export const money = (n: number | null | undefined) => (n == null ? "—" : eur.format(n));

// A text that starts a line: its first letter in capital («octubre de 2026» → «Octubre de 2026»)
export const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export const monthLabel = (m: string) =>
  new Date(`${m}-01T00:00:00`).toLocaleDateString("es-ES", { month: "long", year: "numeric" });

export const monthName = (m: string) => new Date(`${m}-01T00:00:00`).toLocaleDateString("es-ES", { month: "long" });

export const dayLabel = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });

export const shortDate = (date: string) =>
  new Date(`${date}T00:00:00`).toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });

export const dayMonthTime = (timestamp: string) =>
  new Date(timestamp).toLocaleString("es-ES", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });
