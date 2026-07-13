"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  Star,
  Tag,
  Truck,
  BarChart3,
  Settings,
  LogOut,
  Loader2,
} from "lucide-react";
import { FaLogo } from "@/components/icons";

const menuItems = [
  { href: "/admin/dashboard", icon: LayoutDashboard, label: "لوحة التحكم" },
  { href: "/admin/products", icon: Package, label: "المنتجات" },
  { href: "/admin/orders", icon: ShoppingCart, label: "الطلبات" },
  { href: "/admin/pricing", icon: DollarSign, label: "التسعير" },
  { href: "/admin/customers", icon: Users, label: "العملاء" },
  { href: "/admin/reviews", icon: Star, label: "التقييمات" },
  { href: "/admin/coupons", icon: Tag, label: "الكوبونات" },
  { href: "/admin/shipping", icon: Truck, label: "الشحن" },
  { href: "/admin/analytics", icon: BarChart3, label: "التحليلات" },
  { href: "/admin/settings", icon: Settings, label: "الإعدادات" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(L("/login"));
    }
    if (status === "authenticated" && (session?.user as any)?.role !== "ADMIN") {
      router.push(L("/"));
    }
  }, [status, session, router, L]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Loader2 size={40} className="text-gold animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated" || (status === "authenticated" && (session?.user as any)?.role !== "ADMIN")) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">غير مصرح لك بالدخول</p>
          <Link href={L("/login")} className="bg-gold text-secondary px-6 py-2 rounded-lg font-medium">
            تسجيل الدخول
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-secondary text-white flex flex-col flex-shrink-0">
        <div className="p-6 border-b border-white/10">
          <Link href={L("/admin/dashboard")} className="flex items-center gap-2">
            <FaLogo size={28} className="text-gold" />
            <div className="flex flex-col">
              <span className="font-playfair text-gold font-bold tracking-wider text-sm">FILALI ADIBE</span>
              <span className="text-gold-light text-[10px] tracking-[3px]">ADMIN</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname.includes(item.href);
            return (
              <Link key={item.href} href={L(item.href)}
                className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                  isActive ? "bg-gold/20 text-gold border-r-2 border-gold" : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}>
                <item.icon size={20} />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link href={L("/")} className="flex items-center gap-3 px-4 py-2 text-gray-400 hover:text-gold transition-colors text-sm">
            <ShoppingCart size={18} /> العودة للمتجر
          </Link>
          <button onClick={() => signOut({ callbackUrl: L("/") })}
            className="flex items-center gap-3 px-4 py-2 w-full text-gray-400 hover:text-red-400 transition-colors">
            <LogOut size={18} /> <span className="text-sm">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
