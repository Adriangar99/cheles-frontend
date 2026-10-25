import type { Metadata, Viewport } from "next";
import "@fontsource/ibm-plex-sans/latin-400.css";
import "@fontsource/ibm-plex-sans/latin-600.css";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Cheles",
  description: "Mis cuentas",
  robots: { index: false, follow: false },
  appleWebApp: { capable: true, title: "Cheles", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#E8ECF1" },
    { media: "(prefers-color-scheme: dark)", color: "#0E1828" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
