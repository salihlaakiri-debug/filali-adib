"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { DollarSign, ShoppingCart, Package, Users, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";

interface DashboardStats {
  revenue: number;
  orders: number;
  products: number;
  customers: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
}

const statusLabels: Record<string, { label: string; color: string }> = {
  PENDING: { label: "جديد", color: "bg-gray-100 text-gray-700" },
  CONFIRMED: { label: "مؤكد", color: "bg-blue-100 text-blue-700" },
  PROCESSING: { label: "قيد التنفيذ", color: "bg-yellow-100 text-yellow-700" },
  SHIPPED: { label: "جاري الشحن", color: "bg-blue-100 text-blue-700" },
  DELIVERED: { label: "مكتمل", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "ملغي", color: "bg-red-100 text-red-700" },
};

export default function AdminDashboard() {
  const t = useTranslations("admin.dashboard");
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/stats").then((r) => r.json()),
      fetch("/api/admin/orders?limit=5").then((r) => r.json()),
    ])
      .then(([statsData, ordersData]) => {
        setStats(statsData);
        setOrders(ordersData.orders || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <Loader2 size={32} className="text-gold" />
        </motion.div>
      </div>
    );
  }

  const statCards = [
    { title: "dashboard.stats.revenue", value: stats?.revenue?.toLocaleString() ?? "0", icon: DollarSign, color: "text-green-500", bg: "bg-green-50" },
    { title: "dashboard.stats.orders", value: stats?.orders?.toString() ?? "0", icon: ShoppingCart, color: "text-blue-500", bg: "bg-blue-50" },
    { title: "dashboard.stats.products", value: stats?.products?.toString() ?? "0", icon: Package, color: "text-purple-500", bg: "bg-purple-50" },
    { title: "dashboard.stats.customers", value: stats?.customers?.toString() ?? "0", icon: Users, color: "text-orange-500", bg: "bg-orange-50" },
  ];

  return (
    <div>
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-800 mb-8">
        {t("title")}
      </motion.h1>

      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8" staggerDelay={0.1}>
        {statCards.map((stat, index) => (
          <StaggerItem key={index}>
            <motion.div whileHover={{ y: -4, boxShadow: "0 12px 30px rgba(0,0,0,0.06)" }}
              className="bg-white rounded-xl p-6 shadow-sm transition-all cursor-default">
              <div className="flex items-center justify-between mb-4">
                <motion.div whileHover={{ rotate: 10, scale: 1.1 }} className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={stat.color} size={24} />
                </motion.div>
                <motion.div initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 + index * 0.1, type: "spring" }}>
                  {index % 2 === 0 ? <TrendingUp size={16} className="text-green-400" /> : <TrendingDown size={16} className="text-red-400" />}
                </motion.div>
              </div>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 + index * 0.1 }}
                className="text-2xl font-bold text-gray-800">{stat.value}</motion.p>
              <p className="text-sm text-gray-500">{t(stat.title as any)}</p>
            </motion.div>
          </StaggerItem>
        ))}
      </StaggerContainer>

      <FadeIn direction="up" delay={0.3}>
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">آخر الطلبات</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-sm text-gray-500 border-b border-gray-100">
                  {["رقم الطلب", "العميل", "المجموع", "التاريخ", "الحالة"].map((h) => (
                    <th key={h} className="px-6 py-4 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">لا توجد طلبات بعد</td></tr>
                ) : (
                  orders.map((order, i) => {
                    const status = statusLabels[order.status] || statusLabels.PENDING;
                    return (
                      <motion.tr key={order.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + i * 0.08 }}
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-800">{order.orderNumber}</td>
                        <td className="px-6 py-4 text-gray-600">{order.user?.name || "—"}</td>
                        <td className="px-6 py-4 text-gray-800 font-medium">{order.total.toLocaleString()} د.م</td>
                        <td className="px-6 py-4 text-gray-500 text-sm">{new Date(order.createdAt).toLocaleDateString("ar-MA")}</td>
                        <td className="px-6 py-4">
                          <motion.span whileHover={{ scale: 1.05 }}
                            className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.label}</motion.span>
                        </td>
                      </motion.tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
