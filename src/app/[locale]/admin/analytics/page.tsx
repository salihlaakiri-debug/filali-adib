"use client";

import { useLocale } from "next-intl";
import { useState, useEffect, useMemo } from "react";
import {
  DollarSign, ShoppingCart, Package, Users, TrendingUp, Clock, BarChart3,
  ArrowUpRight, ChevronDown, CreditCard, Wallet, Banknote, PieChart,
} from "lucide-react";
import { AdminStatsCard, AdminBadge, AdminLoading } from "@/components/admin";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";

const statusLabels: Record<string, { ar: string; fr: string; color: string }> = {
  PENDING: { ar: "قيد الانتظار", fr: "En attente", color: "#EAB308" },
  CONFIRMED: { ar: "مؤكد", fr: "Confirmé", color: "#3B82F6" },
  PROCESSING: { ar: "قيد التجهيز", fr: "En cours", color: "#6366F1" },
  SHIPPED: { ar: "تم الشحن", fr: "Expédié", color: "#A855F7" },
  DELIVERED: { ar: "تم التوصيل", fr: "Livré", color: "#22C55E" },
  CANCELLED: { ar: "ملغي", fr: "Annulé", color: "#EF4444" },
};

const paymentIcons: Record<string, any> = {
  CASH_ON_DELIVERY: Banknote,
  BANK_TRANSFER: Wallet,
  STRIPE: CreditCard,
};

export default function AdminAnalyticsPage() {
  const locale = useLocale();
  const t = (ar: string, fr: string) => locale === "ar" ? ar : fr;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(30);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/analytics?days=${days}`)
      .then((r) => r.json())
      .then(setData)
      .catch(() => console.warn("Failed to fetch analytics"))
      .finally(() => setLoading(false));
  }, [days]);

  const chartData = useMemo(() => {
    if (!data?.dailyRevenue?.length) return [];
    const maxRev = Math.max(...data.dailyRevenue.map((d: any) => d.revenue), 1);
    const maxOrders = Math.max(...data.dailyRevenue.map((d: any) => d.orders), 1);
    return data.dailyRevenue.map((d: any) => ({
      ...d,
      height: Math.max((d.revenue / maxRev) * 100, 1),
      orderHeight: Math.max((d.orders / maxOrders) * 100, 1),
    }));
  }, [data?.dailyRevenue]);

  const stats = useMemo(() => {
    if (!chartData.length) return { peak: null, avg: 0, totalOrders: 0, bestDay: "" };
    let peak = chartData[0];
    for (const d of chartData) { if (d.revenue > peak.revenue) peak = d; }
    let totalRev = 0;
    let totalOrders = 0;
    for (const d of chartData) { totalRev += d.revenue; totalOrders += d.orders; }
    const avg = Math.round(totalRev / chartData.length);
    return { peak, avg, totalOrders, bestDay: peak.date };
  }, [chartData]);

  if (loading) return <AdminLoading />;
  if (!data) return <AdminLoading text="Error" />;

  const m = data.metrics || {};

  return (
    <div className="space-y-6">
      {/* Header + period */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-secondary">{t("التحليلات", "Analytics")}</h1>
          <p className="text-sm text-gray-500">{t("نظرة شاملة على أداء المتجر", "Store performance overview")}</p>
        </div>
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
          <AdminStatsCard icon={<DollarSign size={20} />} label={t("إيرادات الفترة", "Period Revenue")} value={`${m.revenue?.toLocaleString() || 0} د.م`} />
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

      {/* Revenue chart */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold text-secondary">{t("إيرادات يومية", "Daily Revenue")}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{t("المتوسط", "Avg")}: {stats.avg.toLocaleString()} د.م {t("· الأعلى", "· Peak")}: {stats.peak?.revenue?.toLocaleString() || 0} د.م</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-gold rounded-full" /> {t("إيرادات", "Revenue")}</span>
          </div>
        </div>
        <div className="relative">
          <div className="absolute start-0 top-0 bottom-0 flex flex-col justify-between text-[10px] text-gray-300 pointer-events-none pe-2">
            <span>{chartData[0] ? chartData[0].revenue.toLocaleString() : "0"}</span>
            <span>{chartData[0] ? Math.round(chartData[0].revenue / 2).toLocaleString() : "0"}</span>
            <span>0</span>
          </div>
          <div className="flex items-end gap-[2px] h-52 ps-12">
            {chartData.map((d: any, i: number) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 hidden group-hover:block z-10">
                  <div className="bg-secondary text-white text-[10px] px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
                    {d.revenue.toLocaleString()} د.م · {d.orders} {t("طلب", "orders")}
                  </div>
                </div>
                <div className="w-full bg-gradient-to-t from-gold/60 to-gold/30 hover:from-gold hover:to-gold/70 rounded-t transition-all cursor-pointer min-h-[2px]"
                  style={{ height: `${d.height}%` }} />
                {(i % Math.ceil(chartData.length / 8) === 0 || i === chartData.length - 1) && (
                  <span className="text-[9px] text-gray-400 mt-1 whitespace-nowrap">
                    {new Date(d.date).toLocaleDateString(locale === "ar" ? "ar" : "fr", { day: "numeric", month: "short" })}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Order status donut */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
          <h3 className="font-semibold text-secondary mb-5">{t("حالات الطلبات", "Order Status")}</h3>
          <div className="flex items-center gap-6">
            {/* SVG donut */}
            <div className="relative w-36 h-36 flex-shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {(() => {
                  const total = (data.ordersByStatus || []).reduce((s: number, o: any) => s + o.count, 0);
                  if (total === 0) return <circle cx="50" cy="50" r="40" fill="none" stroke="#f3f4f6" strokeWidth="12" />;
                  let offset = 0;
                  return (data.ordersByStatus || []).map((s: any, i: number) => {
                    const pct = s.count / total;
                    const dash = pct * 251.3;
                    const gap = 251.3 - dash;
                    const el = <circle key={i} cx="50" cy="50" r="40" fill="none" stroke={statusLabels[s.status]?.color || "#d1d5db"} strokeWidth="12" strokeDasharray={`${dash} ${gap}`} strokeDashoffset={-offset} strokeLinecap="round" />;
                    offset += dash;
                    return el;
                  });
                })()}
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-xl font-bold text-secondary">{(data.ordersByStatus || []).reduce((s: number, o: any) => s + o.count, 0)}</p>
                  <p className="text-[10px] text-gray-400">{t("إجمالي", "Total")}</p>
                </div>
              </div>
            </div>
            {/* Legend */}
            <div className="flex-1 space-y-2.5">
              {(data.ordersByStatus || []).map((s: any) => {
                const total = (data.ordersByStatus || []).reduce((sum: number, o: any) => sum + o.count, 0);
                const pct = total > 0 ? Math.round((s.count / total) * 100) : 0;
                return (
                  <div key={s.status} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: statusLabels[s.status]?.color || "#d1d5db" }} />
                      <span className="text-xs text-gray-600">{statusLabels[s.status]?.[locale === "ar" ? "ar" : "fr"] || s.status}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-secondary">{s.count}</span>
                      <span className="text-[10px] text-gray-400 w-8 text-end">{pct}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Payment methods */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
          <h3 className="font-semibold text-secondary mb-5">{t("طرق الدفع", "Payment Methods")}</h3>
          {data.ordersByPaymentMethod?.length > 0 ? (
            <div className="space-y-4">
              {data.ordersByPaymentMethod.map((p: any, i: number) => {
                const total = data.ordersByPaymentMethod.reduce((s: number, x: any) => s + x.total, 0);
                const pct = total > 0 ? Math.round((p.total / total) * 100) : 0;
                const Icon = paymentIcons[p.method] || Wallet;
                const labels: Record<string, string> = { CASH_ON_DELIVERY: "الدفع عند الاستلام", BANK_TRANSFER: "تحويل بنكي", STRIPE: "بطاقة بنكية" };
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center"><Icon size={14} className="text-gray-500" /></div>
                        <div>
                          <p className="text-sm font-medium text-secondary">{labels[p.method] || p.method}</p>
                          <p className="text-[10px] text-gray-400">{p.count} {t("طلب", "orders")}</p>
                        </div>
                      </div>
                      <div className="text-end">
                        <p className="text-sm font-bold text-secondary">{p.total.toLocaleString()} د.م</p>
                        <p className="text-[10px] text-gray-400">{pct}%</p>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gold rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">{t("لا توجد بيانات", "No data")}</p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top products */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
          <h3 className="font-semibold text-secondary mb-4">{t("المنتجات الأكثر مبيعاً", "Top Products")}</h3>
          {data.topProducts?.length > 0 ? (
            <div className="space-y-3">
              {data.topProducts.slice(0, 8).map((p: any, i: number) => {
                const maxRev = Math.max(...data.topProducts.map((x: any) => x.revenue), 1);
                return (
                  <div key={i}>
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 bg-gold/10 rounded-full flex items-center justify-center text-[10px] font-bold text-gold flex-shrink-0">{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-secondary truncate">{p.name}</p>
                        <p className="text-[11px] text-gray-400">{p.sales} {t("مبيعة", "sales")}</p>
                      </div>
                      <span className="text-xs font-semibold text-gold">{p.revenue?.toLocaleString()} د.م</span>
                    </div>
                    <div className="h-1 bg-gray-100 rounded-full mt-1.5 ms-9 overflow-hidden">
                      <div className="h-full bg-gold/40 rounded-full" style={{ width: `${(p.revenue / maxRev) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : <p className="text-sm text-gray-400 text-center py-8">{t("لا توجد بيانات مبيعات", "No sales data")}</p>}
        </div>

        {/* Top categories */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
          <h3 className="font-semibold text-secondary mb-4">{t("التصنيفات الأكثر مبيعاً", "Top Categories")}</h3>
          {data.topCategories?.length > 0 ? (
            <div className="space-y-4">
              {data.topCategories.map((c: any, i: number) => {
                const maxCatRev = Math.max(...data.topCategories.map((x: any) => x.revenue), 1);
                return (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-secondary font-medium">{c.name}</span>
                      <span className="text-xs font-semibold text-gold">{c.revenue?.toLocaleString()} د.م</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-gold/60 to-gold rounded-full" style={{ width: `${(c.revenue / maxCatRev) * 100}%` }} />
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">{c.sales} {t("مبيعة", "sales")}</p>
                  </div>
                );
              })}
            </div>
          ) : <p className="text-sm text-gray-400 text-center py-8">{t("لا توجد بيانات", "No data")}</p>}
        </div>
      </div>

      {/* Low stock */}
      {data.lowStockProducts?.length > 0 && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
          <h3 className="font-semibold text-secondary mb-4">{t("تنبيهات المخزون", "Stock Alerts")}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {data.lowStockProducts.map((p: any) => (
              <div key={p.id} className="flex items-center gap-3 p-3 bg-red-50/50 rounded-xl border border-red-100/50">
                <div className="w-10 h-10 bg-white rounded-lg overflow-hidden flex-shrink-0">
                  {p.images?.[0]?.url ? <img src={p.images[0].url} className="w-full h-full object-cover" /> : <Package size={14} className="text-gray-300 m-auto mt-4" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-secondary truncate">{p.name}</p>
                  <p className="text-[10px] text-gray-500">{p.karat}</p>
                </div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${p.stock === 0 ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-700"}`}>
                  {p.stock}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
