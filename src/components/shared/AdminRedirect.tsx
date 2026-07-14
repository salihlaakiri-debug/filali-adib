"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function AdminRedirect() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status !== "authenticated") return;
    const role = (session?.user as any)?.role;
    if (role === "ADMIN" || role === "SUPER_ADMIN") {
      const locale = pathname.split("/")[1] || "ar";
      const isAdminPage = pathname.includes("/admin");
      const isAuthPage = pathname.includes("/login") || pathname.includes("/register") || pathname.includes("/forgot-password") || pathname.includes("/reset-password");
      if (!isAdminPage && !isAuthPage) {
        router.replace(`/${locale}/admin/dashboard`);
      }
    }
  }, [session, status, pathname, router]);

  return null;
}
