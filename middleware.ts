import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { routing } from "./lib/i18n-routing";
import { getToken } from "next-auth/jwt";

const intlMiddleware = createIntlMiddleware(routing);

const ADMIN_PATHS = ["/dashboard", "/commandes", "/tarifs", "/voyageurs", "/chauffeurs", "/rapports", "/parametres"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Admin routes: check auth
  if (ADMIN_PATHS.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET || "sirexe-dev-secret-change-in-prod" });
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Login page: pass through
  if (pathname === "/login") {
    return NextResponse.next();
  }

  // API routes: pass through
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Everything else: i18n middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|assets|uploads|.*\\..*).*)"],
};
