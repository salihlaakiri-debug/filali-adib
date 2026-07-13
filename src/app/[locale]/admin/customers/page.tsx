"use client";

import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/motion";

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  orderCount: number;
  totalSpent: number;
  createdAt: string;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((data) => setCustomers(data.customers || []))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <motion.h1 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="text-2xl font-bold text-gray-800 mb-8">العملاء</motion.h1>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
            <Loader2 size={32} className="text-gold" />
          </motion.div>
        </div>
      ) : (
        <FadeIn direction="up">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 bg-gray-50">
                    {["العميل", "الهاتف", "الطلبات", "إجمالي المشتريات", "تاريخ الانضمام"].map((h) => (
                      <th key={h} className="px-6 py-4 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {customers.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-400">لا يوجد عملاء بعد</td></tr>
                  ) : (
                    customers.map((customer, i) => (
                      <motion.tr key={customer.id}
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.05 * i }}
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center">
                              <span className="text-gold font-bold text-sm">{customer.name?.charAt(0) || "?"}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{customer.name}</p>
                              <p className="text-xs text-gray-500">{customer.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">{customer.phone || "—"}</td>
                        <td className="px-6 py-4 text-gray-800 font-medium">{customer.orderCount}</td>
                        <td className="px-6 py-4 text-gray-800 font-medium">{customer.totalSpent.toLocaleString()} د.م</td>
                        <td className="px-6 py-4 text-gray-600 text-sm">{new Date(customer.createdAt).toLocaleDateString("ar-MA")}</td>
                      </motion.tr>
                    ))
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
