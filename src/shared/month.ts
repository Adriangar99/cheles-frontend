export const shiftMonth = (m: string, delta: number) => {
  const [y, mo] = m.split("-").map(Number);
  const d = new Date(y, mo - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export const currentMonth = () => shiftMonth(new Date().toISOString().slice(0, 7), 0);
