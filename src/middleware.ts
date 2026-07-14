import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  const secretKey = request.nextUrl.searchParams.get("key");
  const hasValidKey = !!(secretKey && process.env.ADMIN_SECRET_TOKEN && secretKey === process.env.ADMIN_SECRET_TOKEN);

  if (pathname.includes("/admin")) {
    if (hasValidKey) {
      if (pathname.startsWith("/api/")) {
        const headers = new Headers(request.headers);
        headers.set("x-admin-secret", "true");
        return NextResponse.next({ request: { headers } });
      }
      const response = handleI18nRouting(request);
      response.cookies.set("admin_secret", secretKey, {
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24,
      });
      return response;
    }

    if (pathname.startsWith("/api/")) {
      return NextResponse.next();
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/", "/(ar|fr|en)/:path*", "/api/admin/:path*"],
};
