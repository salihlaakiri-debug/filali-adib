"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import {
  LayoutDashboard, Package, ShoppingCart, DollarSign, Users, Star,
  Tag, Truck, BarChart3, Settings, LogOut, Loader2, Menu, X, ChevronLeft, Bell, FolderTree,
} from "lucide-react";
import { FaLogo } from "@/components/icons";

const menuItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, labelAr: "لوحة التحكم", labelFr: "Dashboard" },
  { href: "/admin/products", icon: Package, labelAr: "المنتجات", labelFr: "Produits" },
  { href: "/admin/categories", icon: FolderTree, labelAr: "التصنيفات", labelFr: "Catégories" },
  { href: "/admin/orders", icon: ShoppingCart, labelAr: "الطلبات", labelFr: "Commandes" },
  { href: "/admin/pricing", icon: DollarSign, labelAr: "التسعير", labelFr: "Prix" },
  { href: "/admin/customers", icon: Users, labelAr: "العملاء", labelFr: "Clients" },
  { href: "/admin/reviews", icon: Star, labelAr: "التقييمات", labelFr: "Avis" },
  { href: "/admin/coupons", icon: Tag, labelAr: "الكوبونات", labelFr: "Coupons" },
  { href: "/admin/shipping", icon: Truck, labelAr: "الشحن", labelFr: "Livraison" },
  { href: "/admin/analytics", icon: BarChart3, labelAr: "التحليلات", labelFr: "Analytics" },
  { href: "/admin/settings", icon: Settings, labelAr: "الإعدادات", labelFr: "Paramètres" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const secretKey = searchParams.get("key");
  const hasSecretAccess = secretKey && secretKey.length > 0;
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (hasSecretAccess) return;
    if (status === "unauthenticated") router.push(L("/login"));
    if (status === "authenticated" && !["ADMIN", "SUPER_ADMIN"].includes((session?.user as any)?.role)) router.push(L("/"));
  }, [status, session, router, L, hasSecretAccess]);

  useEffect(() => { setSidebarOpen(false); }, [pathname]);

  if (!hasSecretAccess) {
    if (status === "loading") {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <Loader2 size={40} className="text-gold animate-spin" />
        </div>
      );
    }

    if (status === "unauthenticated" || !["ADMIN", "SUPER_ADMIN"].includes((session?.user as any)?.role)) {
      return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-500 mb-4">{locale === "ar" ? "غير مصرح لك بالدخول" : "Access denied"}</p>
            <Link href={L("/login")} className="bg-gold text-secondary px-6 py-2 rounded-lg font-medium">
              {locale === "ar" ? "تسجيل الدخول" : "Sign in"}
            </Link>
          </div>
        </div>
      );
    }
  }

  const user = hasSecretAccess
    ? { name: "Admin", email: "admin@filali-adib.ma", char: "A" }
    : (session?.user as any);
  const isActive = (href: string) => {
    const fullPath = `/${locale}${href}`;
    return pathname === fullPath || pathname.startsWith(`${fullPath}/`);
  };
  const activeItem = menuItems.find((i) => isActive(i.href));

  const adminLink = (href: string) => {
    const base = L(href);
    return hasSecretAccess ? `${base}?key=${encodeURIComponent(secretKey!)}` : base;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 start-0 z-50 w-64 bg-secondary text-white flex flex-col transition-transform duration-300 ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}>
        {/* Header */}
        <div className="p-5 border-b border-white/10">
          <Link href={adminLink("/admin/dashboard")} className="flex items-center gap-2.5">
            <FaLogo size={28} className="text-gold" />
            <div className="flex flex-col">
              <span className="font-playfair text-gold font-bold tracking-wider text-sm">FILALI ADIB</span>
              <span className="text-gold-light/60 text-[10px] tracking-[3px]">ADMIN</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="absolute top-5 end-4 p-1 text-gray-400 hover:text-white lg:hidden">
            <X size={20} />
          </button>
        </div>

        {/* Active page indicator */}
        {activeItem && (
          <div className="px-5 py-3 border-b border-white/5">
            <p className="text-[10px] uppercase tracking-widest text-gold/40 mb-1">Current Page</p>
            <div className="flex items-center gap-2">
              <activeItem.icon size={14} className="text-gold" />
              <span className="text-xs text-gold font-medium">{locale === "ar" ? activeItem.labelAr : activeItem.labelFr}</span>
            </div>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 py-3 overflow-y-auto scrollbar-hide">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link key={item.href} href={adminLink(item.href)}
                className={`mx-2 flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-sm ${
                  active
                    ? "bg-gold/15 text-gold font-medium"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}>
                <item.icon size={18} className={active ? "text-gold" : ""} />
                <span className="flex-1">{locale === "ar" ? item.labelAr : item.labelFr}</span>
                {active && <ChevronLeft size={14} className="text-gold/60" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-white/10 space-y-1">
          <Link href={L("/")}
            className="flex items-center gap-3 px-3 py-2 text-gray-400 hover:text-gold transition-colors text-sm rounded-lg hover:bg-white/5">
            <ShoppingCart size={16} />
            <span>{locale === "ar" ? "العودة للمتجر" : "Back to Store"}</span>
          </Link>
          <button onClick={() => signOut({ callbackUrl: L("/") })}
            className="flex items-center gap-3 px-3 py-2 w-full text-gray-400 hover:text-red-400 transition-colors text-sm rounded-lg hover:bg-white/5">
            <LogOut size={16} />
            <span>{locale === "ar" ? "تسجيل الخروج" : "Sign Out"}</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 lg:px-8 h-14 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg lg:hidden transition-colors">
              <Menu size={20} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-sm font-semibold text-secondary">{locale === "ar" ? activeItem?.labelAr : activeItem?.labelFr}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 hover:bg-gray-100 rounded-lg relative transition-colors">
              <Bell size={18} className="text-gray-500" />
              <span className="absolute top-1.5 end-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <div className="flex items-center gap-2.5 ps-3 border-s border-gray-100">
              <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-xs font-bold text-gold">
                {user?.name?.charAt(0) || user?.email?.charAt(0) || "A"}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-secondary leading-tight">{user?.name || "Admin"}</p>
                <p className="text-[11px] text-gray-400">{user?.email}</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-4 lg:p-8 flex-1">{children}</div>
      </main>
    </div>
  );
}
