"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/motion";
import { useToast } from "@/components/motion/Toast";

interface Order {
  id: string;
  orderNumber: string;
  total: number;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
  items: { quantity: number }[];
}

const statusMap: Record<string, { label: string; color: string }> = {
  PENDING: { label: "جديد", color: "bg-gray-100 text-gray-700" },
  CONFIRMED: { label: "مؤكد", color: "bg-blue-100 text-blue-700" },
  PROCESSING: { label: "قيد التنفيذ", color: "bg-yellow-100 text-yellow-700" },
  SHIPPED: { label: "جاري الشحن", color: "bg-purple-100 text-purple-700" },
  DELIVERED: { label: "مكتمل", color: "bg-green-100 text-green-700" },
  CANCELLED: { label: "ملغي", color: "bg-red-100 text-red-700" },
};

const statusOptions = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"];

const filters = [
  { value: "all", label: "الكل" },
  { value: "PENDING", label: "جديد" },
  { value: "PROCESSING", label: "قيد التنفيذ" },
  { value: "SHIPPED", label: "جاري الشحن" },
  { value: "DELIVERED", label: "مكتمل" },
  { value: "CANCELLED", label: "ملغي" },
];

export default function AdminOrdersPage() {
  const [filter, setFilter] = useState("all");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const fetchOrders = () => {
    setLoading(true);
    const params = filter !== "all" ? `?status=${filter}` : "";
    fetch(`/api/admin/orders${params}`)
      .then((r) => r.json())
      .then((data) => setOrders(data.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, [filter]);

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status: newStatus }),
      });
      if (res.ok) {
        setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
        addToast(`تم تحديث الحالة إلى ${statusMap[newStatus]?.label || newStatus}`);
      } else { addToast("حدث خطأ أثناء التحديث"); }
    } catch { addToast("حدث خطأ"); }
  };

  return (
    <div>
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-800 mb-8">الطلبات</motion.h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {filters.map((f) => (
          <motion.button key={f.value} whileTap={{ scale: 0.95 }} onClick={() => setFilter(f.value)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f.value ? "bg-gold text-secondary shadow-md shadow-gold/20" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}>{f.label}</motion.button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={32} className="text-gold animate-spin" /></div>
      ) : (
        <FadeIn direction="up">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 bg-gray-50">
                    {["رقم الطلب", "العميل", "التاريخ", "المنتجات", "المجموع", "الحالة", "إجراءات"].map((h) => (
                      <th key={h} className="px-6 py-4 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-400">لا توجد طلبات</td></tr>
                  ) : (
                    orders.map((order, i) => {
                      const status = statusMap[order.status] || statusMap.PENDING;
                      return (
                        <motion.tr key={order.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                          className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-gold">{order.orderNumber}</td>
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-800">{order.user?.name || "—"}</p>
                            <p className="text-xs text-gray-500">{order.user?.email}</p>
                          </td>
                          <td className="px-6 py-4 text-gray-600 text-sm">{new Date(order.createdAt).toLocaleDateString("ar-MA")}</td>
                          <td className="px-6 py-4 text-gray-600">{order.items?.reduce((sum, i) => sum + i.quantity, 0) ?? 0}</td>
                          <td className="px-6 py-4 font-medium text-gray-800">{order.total.toLocaleString()} د.م</td>
                          <td className="px-6 py-4">
                            <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)}
                              className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${status.color}`}>
                              {statusOptions.map((s) => (
                                <option key={s} value={s}>{statusMap[s]?.label || s}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${status.color}`}>{status.label}</span>
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
      )}
    </div>
  );
}
