"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Users, Mail, Phone, Calendar, ShoppingCart, DollarSign, Eye, TrendingUp } from "lucide-react";
import { AdminSearch, AdminPagination, AdminLoading } from "@/components/admin";
import { useToast } from "@/components/motion/Toast";
import { motion } from "framer-motion";

interface Customer {
  id: string; name: string; email: string; phone: string | null; createdAt: string;
  orderCount: number; totalSpent: number;
}
interface Pagination { page: number; limit: number; total: number; totalPages: number }

export default function AdminCustomersPage() {
  const locale = useLocale();
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;
  const t = (ar: string, fr: string) => locale === "ar" ? ar : fr;
  const { addToast } = useToast();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 15, total: 0, totalPages: 0 });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCustomers = (page = 1, searchVal = search) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "15" });
    if (searchVal) params.set("search", searchVal);
    fetch(`/api/admin/customers?${params}`)
      .then((r) => r.json())
      .then((d) => { setCustomers(d.customers || []); setPagination(d.pagination || { page: 1, limit: 15, total: 0, totalPages: 0 }); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCustomers(); }, []);

  const stats = {
    total: pagination.total,
    totalSpent: customers.reduce((s, c) => s + c.totalSpent, 0),
    avgSpend: customers.length > 0 ? Math.round(customers.reduce((s, c) => s + c.totalSpent, 0) / customers.length) : 0,
    withOrders: customers.filter((c) => c.orderCount > 0).length,
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-secondary">{t("العملاء", "Customers")}</h1>
        <p className="text-sm text-gray-500">{pagination.total} {t("عميل", "customers")}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: t("الكل", "Total"), value: stats.total, icon: Users, color: "bg-gray-50 text-gray-600" },
          { label: t("المشترون", "With Orders"), value: stats.withOrders, icon: ShoppingCart, color: "bg-green-50 text-green-600" },
          { label: t("إجمالي المبيعات", "Total Sales"), value: `${stats.totalSpent.toLocaleString()} د.م`, icon: DollarSign, color: "bg-gold/10 text-gold" },
          { label: t("متوسط الشراء", "Avg Spend"), value: `${stats.avgSpend.toLocaleString()} د.م`, icon: TrendingUp, color: "bg-purple-50 text-purple-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-50 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color}`}><s.icon size={16} /></div>
            <div>
              <p className="text-xs text-gray-500">{s.label}</p>
              <p className="text-sm font-bold text-secondary">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <AdminSearch value={search} onChange={(v) => { setSearch(v); fetchCustomers(1, v); }}
        placeholder={t("بحث بالاسم أو البريد أو الهاتف...", "Search by name, email, or phone...")} className="w-full sm:w-72" />

      {loading ? <AdminLoading /> : customers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-50">
          <Users size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{t("لا يوجد عملاء", "No customers")}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {(locale === "ar" ? ["العميل", "الهاتف", "الطلبات", "المجموع", "متوسط الطلب", "تاريخ التسجيل", ""] : ["Customer", "Phone", "Orders", "Total Spent", "Avg Order", "Joined", ""]).map((h) => (
                    <th key={h} className="px-5 py-3 text-start text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {customers.map((c) => {
                  const avgOrder = c.orderCount > 0 ? Math.round(c.totalSpent / c.orderCount) : 0;
                  return (
                    <tr key={c.id} className="hover:bg-gray-50/80 transition-colors cursor-pointer" onClick={() => window.location.href = L(`/admin/customers/${c.id}`)}>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-gold/10 rounded-full flex items-center justify-center text-xs font-bold text-gold flex-shrink-0">
                            {c.name?.charAt(0) || c.email?.charAt(0) || "?"}
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-secondary truncate">{c.name || "—"}</p>
                            <p className="text-xs text-gray-400 truncate">{c.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-500" dir="ltr">{c.phone || "—"}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${c.orderCount > 0 ? "bg-blue-50 text-blue-600" : "bg-gray-50 text-gray-400"}`}>
                          {c.orderCount}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-semibold text-secondary">{c.totalSpent.toLocaleString()} <span className="text-xs font-normal text-gray-400">د.م</span></td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{avgOrder.toLocaleString()} د.م</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{new Date(c.createdAt).toLocaleDateString(locale === "ar" ? "ar" : "fr")}</td>
                      <td className="px-5 py-3.5">
                        <Link href={L(`/admin/customers/${c.id}`)} onClick={(e) => e.stopPropagation()}
                          className="p-2 hover:bg-gold/10 rounded-lg transition-colors inline-flex">
                          <Eye size={15} className="text-gray-400 hover:text-gold" />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="px-5 pb-4">
            <AdminPagination page={pagination.page} totalPages={pagination.totalPages}
              onPageChange={(p) => fetchCustomers(p)} totalItems={pagination.total} pageSize={pagination.limit} />
          </div>
        </div>
      )}
    </div>
  );
}
