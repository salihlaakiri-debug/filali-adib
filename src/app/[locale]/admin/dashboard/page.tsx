"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DollarSign, ShoppingCart, Package, Users, TrendingUp, Clock, Eye,
  ArrowUpRight, Loader2, Star, Tag,
} from "lucide-react";
import { AdminStatsCard, AdminBadge, AdminLoading } from "@/components/admin";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";

interface Stats {
  revenue: number;
  orders: number;
  products: number;
  customers: number;
  pendingOrders: number;
  pendingReviews: number;
  activeCoupons: number;
  lowStockProducts: number;
  recentOrders: any[];
  topProducts: any[];
  dailyRevenue: { date: string; total: number }[];
}

const statusLabels: Record<string, { ar: string; fr: string }> = {
  PENDING: { ar: "قيد الانتظار", fr: "En attente" },
  CONFIRMED: { ar: "مؤكد", fr: "Confirmé" },
  PROCESSING: { ar: "قيد التجهيز", fr: "En cours" },
  SHIPPED: { ar: "تم الشحن", fr: "Expédié" },
  DELIVERED: { ar: "تم التوصيل", fr: "Livré" },
  CANCELLED: { ar: "ملغي", fr: "Annulé" },
};

export default function DashboardPage() {
  const locale = useLocale();
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/orders?limit=8").then((r) => r.json()),
      fetch("/api/admin/analytics").then((r) => r.json()),
    ])
      .then(([statsData, ordersData, analyticsData]) => {
        setStats({
          revenue: statsData.revenue || 0,
          orders: statsData.orders || 0,
          products: statsData.products || 0,
          customers: statsData.customers || 0,
          pendingOrders: statsData.pendingOrders || 0,
          pendingReviews: statsData.pendingReviews || 0,
          activeCoupons: statsData.activeCoupons || 0,
          lowStockProducts: statsData.lowStockProducts || 0,
          recentOrders: ordersData.orders || [],
          topProducts: analyticsData.topProducts || [],
          dailyRevenue: analyticsData.dailyRevenue || [],
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <AdminLoading />;
  if (!stats) return <AdminLoading text="Error loading data" />;

  const maxDailyRevenue = Math.max(...(stats.dailyRevenue.map((d) => d.total) || [1]), 1);

  return (
    <div className="space-y-6">
      {/* Stats cards */}
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4" staggerDelay={0.05}>
        <StaggerItem>
          <AdminStatsCard icon={<DollarSign size={20} />} label={locale === "ar" ? "الإيرادات" : "Revenue"} value={`${stats.revenue.toLocaleString()} د.م`} />
        </StaggerItem>
        <StaggerItem>
          <AdminStatsCard icon={<ShoppingCart size={20} />} label={locale === "ar" ? "الطلبات" : "Orders"} value={stats.orders} />
        </StaggerItem>
        <StaggerItem>
          <AdminStatsCard icon={<Package size={20} />} label={locale === "ar" ? "المنتجات" : "Products"} value={stats.products} />
        </StaggerItem>
        <StaggerItem>
          <AdminStatsCard icon={<Users size={20} />} label={locale === "ar" ? "العملاء" : "Customers"} value={stats.customers} />
        </StaggerItem>
      </StaggerContainer>

      {/* Quick actions row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { icon: Clock, label: locale === "ar" ? "طلبات معلقة" : "Pending", count: stats.pendingOrders, href: "/admin/orders", color: "text-yellow-500" },
          { icon: Star, label: locale === "ar" ? "تقييمات معلقة" : "Reviews", count: stats.pendingReviews, href: "/admin/reviews", color: "text-purple-500" },
          { icon: Tag, label: locale === "ar" ? "كوبونات نشطة" : "Coupons", count: stats.activeCoupons, href: "/admin/coupons", color: "text-blue-500" },
          { icon: Package, label: locale === "ar" ? "مخزون منخفض" : "Low Stock", count: stats.lowStockProducts, href: "/admin/products", color: "text-red-500" },
          { icon: TrendingUp, label: locale === "ar" ? "التحليلات" : "Analytics", count: null, href: "/admin/analytics", color: "text-gold" },
          { icon: DollarSign, label: locale === "ar" ? "التسعير" : "Pricing", count: null, href: "/admin/pricing", color: "text-green-500" },
        ].map((item) => (
          <Link key={item.href} href={L(item.href)}
            className="bg-white rounded-xl p-3.5 shadow-sm border border-gray-50 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-2">
              <item.icon size={18} className={item.color} />
              {item.count !== null && item.count > 0 && (
                <span className="text-xs font-bold bg-red-50 text-red-500 px-2 py-0.5 rounded-full">{item.count}</span>
              )}
            </div>
            <p className="text-xs font-medium text-secondary group-hover:text-gold transition-colors">{item.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue chart (CSS-based bar chart) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-secondary">{locale === "ar" ? "إيرادات آخر 7 أيام" : "Last 7 Days Revenue"}</h3>
            <Link href={L("/admin/analytics")} className="text-xs text-gold hover:text-gold-dark transition-colors flex items-center gap-1">
              {locale === "ar" ? "التفاصيل" : "Details"} <ArrowUpRight size={12} />
            </Link>
          </div>
          {stats.dailyRevenue.length > 0 ? (
            <div className="flex items-end gap-2 h-40">
              {stats.dailyRevenue.slice(-7).map((day, i) => {
                const height = Math.max((day.total / maxDailyRevenue) * 100, 4);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-[10px] text-gray-400">{day.total > 0 ? day.total.toLocaleString() : ""}</span>
                    <div className="w-full relative group">
                      <div
                        className="w-full bg-gold/20 hover:bg-gold/40 rounded-t-lg transition-colors cursor-pointer"
                        style={{ height: `${height}%`, minHeight: "4px" }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-400">
                      {new Date(day.date).toLocaleDateString(locale === "ar" ? "ar" : "fr", { weekday: "short" })}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-400 text-sm">
              {locale === "ar" ? "لا توجد بيانات بعد" : "No data yet"}
            </div>
          )}
        </div>

        {/* Top products */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-secondary">{locale === "ar" ? "المنتجات الأكثر مبيعاً" : "Top Products"}</h3>
            <Eye size={16} className="text-gray-400" />
          </div>
          <div className="space-y-3">
            {stats.topProducts.length > 0 ? stats.topProducts.slice(0, 5).map((p: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-6 h-6 bg-gold/10 rounded-full flex items-center justify-center text-[10px] font-bold text-gold">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary truncate">{p.name}</p>
                  <p className="text-[11px] text-gray-400">{p._count?.orderItems || 0} {locale === "ar" ? "مبيعة" : "sales"}</p>
                </div>
                <span className="text-xs font-medium text-gold">{(p.totalRevenue || 0).toLocaleString()} د.م</span>
              </div>
            )) : (
              <p className="text-sm text-gray-400 text-center py-4">{locale === "ar" ? "لا توجد بيانات بعد" : "No data yet"}</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
        <div className="flex items-center justify-between p-5 pb-0">
          <h3 className="font-semibold text-secondary">{locale === "ar" ? "آخر الطلبات" : "Recent Orders"}</h3>
          <Link href={L("/admin/orders")} className="text-xs text-gold hover:text-gold-dark transition-colors flex items-center gap-1">
            {locale === "ar" ? "عرض الكل" : "View All"} <ArrowUpRight size={12} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full mt-3">
            <thead>
              <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
                <th className="px-5 py-3 text-start">{locale === "ar" ? "رقم الطلب" : "Order #"}</th>
                <th className="px-5 py-3 text-start">{locale === "ar" ? "العميل" : "Customer"}</th>
                <th className="px-5 py-3 text-start">{locale === "ar" ? "المجموع" : "Total"}</th>
                <th className="px-5 py-3 text-start">{locale === "ar" ? "التاريخ" : "Date"}</th>
                <th className="px-5 py-3 text-start">{locale === "ar" ? "الحالة" : "Status"}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.recentOrders.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50/80 transition-colors cursor-pointer">
                  <td className="px-5 py-3.5 text-sm font-medium text-secondary">#{order.orderNumber}</td>
                  <td className="px-5 py-3.5 text-sm text-gray-600">{order.user?.name || order.user?.email || "—"}</td>
                  <td className="px-5 py-3.5 text-sm font-medium">{order.total?.toLocaleString()} د.م</td>
                  <td className="px-5 py-3.5 text-sm text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString(locale === "ar" ? "ar-MA" : "fr-FR")}
                  </td>
                  <td className="px-5 py-3.5">
                    <AdminBadge
                      status={order.status}
                      label={statusLabels[order.status]?.[locale === "ar" ? "ar" : "fr"] || order.status}
                    />
                  </td>
                </tr>
              ))}
              {stats.recentOrders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-8 text-center text-gray-400 text-sm">
                    {locale === "ar" ? "لا توجد طلبات بعد" : "No orders yet"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
