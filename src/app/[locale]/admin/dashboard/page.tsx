"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import {
  DollarSign, ShoppingCart, Package, Users, TrendingUp, Clock, Eye,
  ArrowUpRight, ArrowDownRight, AlertTriangle, Star, Tag, BarChart3,
} from "lucide-react";
import { AdminStatsCard, AdminBadge, AdminLoading } from "@/components/admin";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";

const statusLabels: Record<string, { ar: string; fr: string }> = {
  PENDING: { ar: "قيد الانتظار", fr: "En attente" },
  CONFIRMED: { ar: "مؤكد", fr: "Confirmé" },
  PROCESSING: { ar: "قيد التجهيز", fr: "En cours" },
  SHIPPED: { ar: "تم الشحن", fr: "Expédié" },
  DELIVERED: { ar: "تم التوصيل", fr: "Livré" },
  CANCELLED: { ar: "ملغي", fr: "Annulé" },
};

const statusColors: Record<string, string> = {
  PENDING: "#EAB308", CONFIRMED: "#3B82F6", PROCESSING: "#6366F1",
  SHIPPED: "#A855F7", DELIVERED: "#22C55E", CANCELLED: "#EF4444",
};

export default function DashboardPage() {
  const locale = useLocale();
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;
  const t = (ar: string, fr: string) => locale === "ar" ? ar : fr;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/analytics?days=${days}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [days]);

  const chartData = useMemo(() => {
    if (!data?.dailyRevenue?.length) return [];
    const maxRev = Math.max(...data.dailyRevenue.map((d: any) => d.revenue), 1);
    return data.dailyRevenue.map((d: any) => ({
      ...d,
      height: Math.max((d.revenue / maxRev) * 100, 2),
    }));
  }, [data?.dailyRevenue]);

  const statusBreakdown = useMemo(() => {
    if (!data?.ordersByStatus?.length) return [];
    const total = data.ordersByStatus.reduce((s: number, o: any) => s + o.count, 0);
    return data.ordersByStatus.map((s: any) => ({
      ...s,
      percentage: total > 0 ? (s.count / total) * 100 : 0,
    }));
  }, [data?.ordersByStatus]);

  if (loading) return <AdminLoading />;
  if (!data) return <AdminLoading text="Error" />;

  const m = data.metrics || {};

  return (
    <div className="space-y-6">
      {/* Period selector */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
          {[7, 15, 30, 90].map((d) => (
            <button key={d} onClick={() => setDays(d)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${days === d ? "bg-white text-secondary shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
              {d} {t("يوم", "days")}
            </button>
          ))}
        </div>
      </div>

      {/* Stats cards */}
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4" staggerDelay={0.05}>
        <StaggerItem>
          <AdminStatsCard icon={<DollarSign size={20} />} label={t("الإيرادات", "Revenue")} value={`${m.revenue?.toLocaleString() || 0} د.م`} />
        </StaggerItem>
        <StaggerItem>
          <AdminStatsCard icon={<ShoppingCart size={20} />} label={t("الطلبات", "Orders")} value={m.orders || 0} />
        </StaggerItem>
        <StaggerItem>
          <AdminStatsCard icon={<Users size={20} />} label={t("العملاء", "Customers")} value={m.customers || 0} />
        </StaggerItem>
        <StaggerItem>
          <AdminStatsCard icon={<TrendingUp size={20} />} label={t("متوسط الطلب", "Avg Order")} value={`${m.avgOrderValue?.toLocaleString() || 0} د.م`} />
        </StaggerItem>
      </StaggerContainer>

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { icon: Clock, label: t("طلبات معلقة", "Pending"), count: m.pendingOrders, href: "/admin/orders", color: "text-yellow-500", bg: "bg-yellow-50" },
          { icon: AlertTriangle, label: t("مخزون منخفض", "Low Stock"), count: data.lowStockProducts?.length || 0, href: "/admin/products", color: "text-red-500", bg: "bg-red-50" },
          { icon: Star, label: t("المنتجات", "Products"), count: m.products, href: "/admin/products", color: "text-blue-500", bg: "bg-blue-50" },
          { icon: BarChart3, label: t("التحليلات", "Analytics"), count: null, href: "/admin/analytics", color: "text-gold", bg: "bg-gold/10" },
        ].map((item) => (
          <Link key={item.href} href={L(item.href)}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-50 hover:shadow-md transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${item.bg}`}>
                <item.icon size={18} className={item.color} />
              </div>
              {item.count !== null && item.count > 0 && (
                <span className="text-xs font-bold bg-red-50 text-red-500 px-2 py-0.5 rounded-full">{item.count}</span>
              )}
            </div>
            <p className="text-sm font-medium text-secondary group-hover:text-gold transition-colors">{item.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-semibold text-secondary">{t("إيرادات آخر", "Revenue last")} {days} {t("يوم", "days")}</h3>
            <Link href={L("/admin/analytics")} className="text-xs text-gold hover:text-gold-dark transition-colors flex items-center gap-1">
              {t("التفاصيل", "Details")} <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="flex items-end gap-[2px] h-44">
            {chartData.map((d: any, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div className="absolute -top-8 left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
                  <div className="bg-secondary text-white text-[10px] px-2 py-1 rounded whitespace-nowrap">
                    {d.revenue.toLocaleString()} د.م · {d.orders} {t("طلب", "orders")}
                  </div>
                </div>
                <div className="w-full bg-gold/20 hover:bg-gold/50 rounded-t transition-colors cursor-pointer"
                  style={{ height: `${d.height}%`, minHeight: "2px" }} />
                {(i % Math.ceil(chartData.length / 7) === 0 || i === chartData.length - 1) && (
                  <span className="text-[9px] text-gray-400 mt-1">
                    {new Date(d.date).toLocaleDateString(locale === "ar" ? "ar" : "fr", { day: "numeric", month: "short" })}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Order status breakdown */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
          <h3 className="font-semibold text-secondary mb-4">{t("حالات الطلبات", "Order Status")}</h3>
          <div className="space-y-3">
            {statusBreakdown.map((s: any) => (
              <div key={s.status}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">{statusLabels[s.status]?.[locale === "ar" ? "ar" : "fr"] || s.status}</span>
                  <span className="text-xs font-medium text-secondary">{s.count}</span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${s.percentage}%`, backgroundColor: statusColors[s.status] || "#gray" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top products */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
          <h3 className="font-semibold text-secondary mb-4">{t("المنتجات الأكثر مبيعاً", "Top Products")}</h3>
          <div className="space-y-3">
            {data.topProducts?.length > 0 ? data.topProducts.slice(0, 7).map((p: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <span className="w-6 h-6 bg-gold/10 rounded-full flex items-center justify-center text-[10px] font-bold text-gold flex-shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary truncate">{p.name}</p>
                  <p className="text-[11px] text-gray-400">{p.sales} {t("مبيعة", "sales")}</p>
                </div>
                <span className="text-xs font-medium text-gold">{p.revenue?.toLocaleString()} د.م</span>
              </div>
            )) : <p className="text-sm text-gray-400 text-center py-4">{t("لا توجد بيانات", "No data")}</p>}
          </div>
        </div>

        {/* Top categories */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
          <h3 className="font-semibold text-secondary mb-4">{t("التصنيفات الأكثر مبيعاً", "Top Categories")}</h3>
          <div className="space-y-3">
            {data.topCategories?.length > 0 ? data.topCategories.map((c: any, i: number) => {
              const maxCatRev = Math.max(...data.topCategories.map((x: any) => x.revenue), 1);
              return (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-secondary">{c.name}</span>
                    <span className="text-xs font-medium text-gold">{c.revenue?.toLocaleString()} د.م</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gold/60 rounded-full" style={{ width: `${(c.revenue / maxCatRev) * 100}%` }} />
                  </div>
                </div>
              );
            }) : <p className="text-sm text-gray-400 text-center py-4">{t("لا توجد بيانات", "No data")}</p>}
          </div>
        </div>
      </div>

      {/* Recent orders + Low stock */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
          <div className="flex items-center justify-between p-5 pb-0">
            <h3 className="font-semibold text-secondary">{t("آخر الطلبات", "Recent Orders")}</h3>
            <Link href={L("/admin/orders")} className="text-xs text-gold hover:text-gold-dark flex items-center gap-1">
              {t("عرض الكل", "View All")} <ArrowUpRight size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full mt-3">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] text-gray-500 uppercase tracking-wider">
                  <th className="px-5 py-2.5 text-start">{t("رقم الطلب", "Order")}</th>
                  <th className="px-5 py-2.5 text-start">{t("العميل", "Customer")}</th>
                  <th className="px-5 py-2.5 text-start">{t("المجموع", "Total")}</th>
                  <th className="px-5 py-2.5 text-start">{t("الحالة", "Status")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.recentOrders?.map((o: any) => (
                  <tr key={o.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="px-5 py-3 text-sm font-medium text-secondary">#{o.orderNumber}</td>
                    <td className="px-5 py-3 text-sm text-gray-600">{o.user?.name || o.user?.email || "—"}</td>
                    <td className="px-5 py-3 text-sm font-medium">{o.total?.toLocaleString()} د.م</td>
                    <td className="px-5 py-3">
                      <AdminBadge status={o.status} label={statusLabels[o.status]?.[locale === "ar" ? "ar" : "fr"] || o.status} />
                    </td>
                  </tr>
                ))}
                {!data.recentOrders?.length && (
                  <tr><td colSpan={4} className="px-5 py-8 text-center text-gray-400 text-sm">{t("لا توجد طلبات", "No orders")}</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low stock alerts */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-secondary">{t("تنبيهات المخزون", "Stock Alerts")}</h3>
            <AlertTriangle size={16} className="text-red-400" />
          </div>
          <div className="space-y-2.5">
            {data.lowStockProducts?.length > 0 ? data.lowStockProducts.map((p: any) => (
              <div key={p.id} className="flex items-center gap-3 p-2.5 bg-red-50/50 rounded-xl">
                <div className="w-9 h-9 bg-white rounded-lg overflow-hidden flex-shrink-0">
                  {p.images?.[0]?.url ? <img src={p.images[0].url} className="w-full h-full object-cover" /> : <Package size={14} className="text-gray-300 m-auto mt-3" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary truncate">{p.name}</p>
                  <p className="text-[11px] text-gray-500">{p.karat}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${p.stock === 0 ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-700"}`}>
                  {p.stock}
                </span>
              </div>
            )) : (
              <div className="text-center py-6">
                <Package size={28} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">{t("المخزون جيد", "Stock OK")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
