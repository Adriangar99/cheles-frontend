"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Mi mes", icon: "◔" },
  { href: "/movimientos", label: "Movimientos", icon: "☰" },
  { href: "/bancos", label: "Bancos", icon: "⌂" },
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
