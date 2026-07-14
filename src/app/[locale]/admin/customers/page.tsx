"use client";

import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { Users, Mail, Phone, Calendar, ShoppingCart, DollarSign } from "lucide-react";
import { AdminSearch, AdminPagination, AdminLoading } from "@/components/admin";
import { useToast } from "@/components/motion/Toast";

interface Customer {
  id: string; name: string; email: string; phone: string | null; createdAt: string;
  orderCount: number; totalSpent: number;
}
interface Pagination { page: number; limit: number; total: number; totalPages: number }

export default function AdminCustomersPage() {
  const locale = useLocale();
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

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-secondary">{locale === "ar" ? "العملاء" : "Customers"}</h1>
        <p className="text-sm text-gray-500">{pagination.total} {locale === "ar" ? "عميل" : "customers"}</p>
      </div>

      <AdminSearch value={search} onChange={(v) => { setSearch(v); fetchCustomers(1, v); }}
        placeholder={locale === "ar" ? "بحث بالاسم أو البريد أو الهاتف..." : "Search by name, email, or phone..."} className="w-full sm:w-72" />

      {loading ? <AdminLoading /> : customers.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-50">
          <Users size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{locale === "ar" ? "لا يوجد عملاء" : "No customers"}</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {(locale === "ar" ? ["العميل", "الهاتف", "الطلبات", "المجموع", "تاريخ التسجيل"] : ["Customer", "Phone", "Orders", "Total Spent", "Joined"]).map((h) => (
                    <th key={h} className="px-5 py-3 text-start text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/80 transition-colors">
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
                    <td className="px-5 py-3.5 text-sm font-medium">{c.orderCount}</td>
                    <td className="px-5 py-3.5 text-sm font-medium">{c.totalSpent.toLocaleString()} د.م</td>
                    <td className="px-5 py-3.5 text-sm text-gray-500">{new Date(c.createdAt).toLocaleDateString(locale === "ar" ? "ar-MA" : "fr-FR")}</td>
                  </tr>
                ))}
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
