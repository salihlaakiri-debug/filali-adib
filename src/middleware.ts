import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  if (pathname.includes("/admin")) {
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    if (!token || !["ADMIN", "SUPER_ADMIN"].includes(token.role as string)) {
      if (!pathname.startsWith("/api/")) {
        const locale = pathname.split("/")[1] || "ar";
        if (!token) {
          return NextResponse.redirect(new URL(`/${locale}/login`, request.url));
        }
        return NextResponse.redirect(new URL(`/${locale}`, request.url));
      }
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return handleI18nRouting(request);
}

export const config = {
  matcher: ["/", "/(ar|fr|en)/:path*"],
};
