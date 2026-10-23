import { NextRequest, NextResponse } from "next/server";

// Filtro rápido: sin cookie de sesión, directo al login. La API valida la sesión de verdad.
export function middleware(req: NextRequest) {
  if (!req.cookies.has("cheles_session")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|api|_next|favicon.ico|manifest.webmanifest|icon.svg).*)"],
};
