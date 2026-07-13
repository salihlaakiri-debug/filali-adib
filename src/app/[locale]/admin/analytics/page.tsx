"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";

interface Metrics {
  totalRevenue: number; totalOrders: number; totalProducts: number;
  totalCustomers: number; recentRevenue: number; recentCount: number;
  avgOrder: number; conversionRate: string;
}
interface TopProduct { name: string; sales: number; revenue: number; }

export default function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics").then((r) => r.json()).then((data) => {
      setMetrics(data.metrics);
      setTopProducts(data.topProducts || []);
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Loader2 size={32} className="text-gold animate-spin" /></div>;

  const metricCards = [
    { label: "إجمالي الإيرادات", value: `${(metrics?.totalRevenue || 0).toLocaleString()} د.م`, trend: "up", change: "" },
    { label: "إجمالي الطلبات", value: String(metrics?.totalOrders || 0), trend: "up", change: "" },
    { label: "متوسط الطلب", value: `${(metrics?.avgOrder || 0).toLocaleString()} د.م`, trend: "up", change: "" },
    { label: "العملاء", value: String(metrics?.totalCustomers || 0), trend: "up", change: "" },
  ];

  return (
    <div>
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl font-bold text-gray-800 mb-8">التحليلات</motion.h1>

      <StaggerContainer className="grid md:grid-cols-4 gap-6 mb-8" staggerDelay={0.1}>
        {metricCards.map((metric, index) => (
          <StaggerItem key={index}>
            <motion.div whileHover={{ y: -4 }} className="bg-white rounded-xl p-6 shadow-sm transition-all cursor-default">
              <p className="text-sm text-gray-500 mb-2">{metric.label}</p>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
              </div>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <div className="grid lg:grid-cols-2 gap-6">
        <FadeIn direction="right">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">المنتجات الأكثر مبيعاً</h2>
            {topProducts.length === 0 ? (
              <p className="text-gray-400 text-center py-8">لا توجد بيانات مبيعات بعد</p>
            ) : (
              <StaggerContainer className="space-y-4" staggerDelay={0.1}>
                {topProducts.map((product, index) => (
                  <StaggerItem key={index}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold font-bold text-sm">{index + 1}</div>
                        <div>
                          <p className="font-medium text-gray-800 text-sm">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.sales} مبيعة</p>
                        </div>
                      </div>
                      <p className="font-medium text-gray-800">{product.revenue.toLocaleString()} د.م</p>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </FadeIn>

        <FadeIn direction="left" delay={0.1}>
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">ملخص آخر 30 يوم</h2>
            <div className="space-y-4">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg"><span className="text-gray-600">إيرادات آخر 30 يوم</span><span className="font-bold text-gold">{(metrics?.recentRevenue || 0).toLocaleString()} د.م</span></div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg"><span className="text-gray-600">طلبات آخر 30 يوم</span><span className="font-medium">{metrics?.recentCount || 0}</span></div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg"><span className="text-gray-600">معدل التحويل</span><span className="font-medium">{metrics?.conversionRate || 0}%</span></div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
