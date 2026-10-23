import { type NextRequest, NextResponse } from "next/server";

// Quick filter: no session cookie, straight to login. The API does the real session check.
export function middleware(req: NextRequest) {
  if (!req.cookies.has("cheles_session")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!login|api|_next|favicon.ico|manifest.webmanifest|icon.svg).*)"],
};
