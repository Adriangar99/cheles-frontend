"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "mi mes", icon: "◔" },
  { href: "/movimientos", label: "movimientos", icon: "☰" },
  { href: "/bancos", label: "bancos", icon: "⌂" },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <>
      <main>{children}</main>
      <nav className="tabs">
        {tabs.map((t) => (
          <Link key={t.href} href={t.href} className={path === t.href ? "on" : ""}>
            <span className="i">{t.icon}</span>
            {t.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
