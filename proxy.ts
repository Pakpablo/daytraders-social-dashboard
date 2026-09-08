import { NextRequest, NextResponse } from "next/server";
import { verifySessionToken, SESSION_COOKIE_NAME } from "./lib/auth";

// Place this file at the project ROOT (same level as package.json),
// not inside app/ or lib/ — Next.js requires that exact location.
// (Next.js 16 renamed the "middleware" file convention to "proxy" —
// migrated via `npx @next/codemod middleware-to-proxy`.)

export const config = {
  matcher: [
    /*
     * Run on every route except:
     * - /login (the login page itself)
     * - /api/auth/* (login/logout endpoints)
     * - static assets and Next internals
     */
    "/((?!login|api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};

export async function proxy(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (!session) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("from", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
