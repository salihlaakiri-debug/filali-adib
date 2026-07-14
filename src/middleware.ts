import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const handleI18nRouting = createMiddleware(routing);

async function getAdminRole(request: NextRequest): Promise<string | null> {
  try {
    const { jwtVerify } = await import("jose");
    const cookie = request.cookies.get("__Secure-authjs.session-token")?.value
      || request.cookies.get("authjs.session-token")?.value;
    if (!cookie || !process.env.AUTH_SECRET) return null;
    const key = new TextEncoder().encode(process.env.AUTH_SECRET);
    const { payload } = await jwtVerify(cookie, key, { algorithms: ["HS256"] });
    return typeof (payload as any).role === "string" ? (payload as any).role : null;
  } catch {
    return null;
  }
}

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

    const role = await getAdminRole(request);

    if (!role || !["ADMIN", "SUPER_ADMIN"].includes(role)) {
      if (!pathname.startsWith("/api/")) {
        const locale = pathname.split("/")[1] || "ar";
        if (!role) {
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
  matcher: ["/", "/(ar|fr|en)/:path*", "/api/admin/:path*"],
};
