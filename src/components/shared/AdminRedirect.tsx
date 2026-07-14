"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

export function AdminRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const redirected = useRef(false);

  useEffect(() => {
    if (redirected.current) return;
    if (status !== "authenticated") return;

    const role = (session?.user as any)?.role;
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") return;

    const locale = pathname.split("/")[1] || "ar";
    const isAdminPage = pathname.includes("/admin");
    const isLoginPage = pathname.includes("/login");

    if (!isAdminPage && !isLoginPage) {
      redirected.current = true;
      window.location.href = `/${locale}/admin/dashboard`;
    }
  }, [session, status, pathname]);

  return null;
}
