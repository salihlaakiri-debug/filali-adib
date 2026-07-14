"use client";

import { useLocale } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Mail, Phone, Calendar, ShoppingCart, DollarSign, Package, MapPin } from "lucide-react";
import { AdminBadge, AdminLoading } from "@/components/admin";
import { useToast } from "@/components/motion/Toast";

interface Customer {
  id: string; name: string; email: string; phone: string | null; createdAt: string;
  orderCount: number; totalSpent: number;
  orders?: { id: string; orderNumber: string; status: string; total: number; createdAt: string; items: { quantity: number; product: { name: string } }[] }[];
}

const statusLabels: Record<string, { ar: string; fr: string }> = {
  PENDING: { ar: "قيد الانتظار", fr: "En attente" },
  CONFIRMED: { ar: "مؤكد", fr: "Confirmé" },
  PROCESSING: { ar: "قيد التجهيز", fr: "En cours" },
  SHIPPED: { ar: "تم الشحن", fr: "Expédié" },
  DELIVERED: { ar: "تم التوصيل", fr: "Livré" },
  CANCELLED: { ar: "ملغي", fr: "Annulé" },
};

export default function CustomerDetailPage() {
  const locale = useLocale();
  const t = (ar: string, fr: string) => locale === "ar" ? ar : fr;
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { addToast } = useToast();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/admin/customers?search=${encodeURIComponent(customer?.email || id)}&limit=50`)
      .then((r) => r.json())
      .then((d) => {
        const found = d.customers?.find((c: Customer) => c.id === id);
        if (found) setCustomer(found);
        else { addToast(t("العميل غير موجود", "Customer not found")); router.push(`/${locale}/admin/customers`); }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <AdminLoading />;
  if (!customer) return null;

  const avgOrder = customer.orderCount > 0 ? Math.round(customer.totalSpent / customer.orderCount) : 0;

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => router.push(`/${locale}/admin/customers`)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowLeft size={18} className="text-gray-500" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-secondary">{customer.name || customer.email}</h1>
          <p className="text-sm text-gray-500">{t("تفاصيل العميل", "Customer Details")}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: ShoppingCart, label: t("الطلبات", "Orders"), value: customer.orderCount, color: "bg-blue-50 text-blue-600" },
          { icon: DollarSign, label: t("إجمالي الشراء", "Total Spent"), value: `${customer.totalSpent.toLocaleString()} د.م`, color: "bg-green-50 text-green-600" },
          { icon: DollarSign, label: t("متوسط الطلب", "Avg Order"), value: `${avgOrder.toLocaleString()} د.م`, color: "bg-purple-50 text-purple-600" },
          { icon: Calendar, label: t("تاريخ التسجيل", "Joined"), value: new Date(customer.createdAt).toLocaleDateString(locale === "ar" ? "ar" : "fr"), color: "bg-gold/10 text-gold" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-50">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${s.color} mb-3`}>
              <s.icon size={16} />
            </div>
            <p className="text-xl font-bold text-secondary">{s.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Contact info */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 space-y-4">
          <h3 className="font-semibold text-secondary">{t("معلومات الاتصال", "Contact Info")}</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gold/10 rounded-full flex items-center justify-center text-xs font-bold text-gold">{customer.name?.charAt(0) || "?"}</div>
              <div>
                <p className="text-sm font-medium text-secondary">{customer.name || "—"}</p>
                <p className="text-xs text-gray-400">{t("الاسم الكامل", "Full name")}</p>
              </div>
            </div>
            <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
              <Mail size={14} className="text-gray-400 flex-shrink-0" />
              <div className="min-w-0">
                <p className="text-sm text-secondary truncate">{customer.email}</p>
                <p className="text-[10px] text-gray-400">Email</p>
              </div>
            </div>
            {customer.phone && (
              <div className="flex items-center gap-2.5 p-3 bg-gray-50 rounded-xl">
                <Phone size={14} className="text-gray-400 flex-shrink-0" />
                <div>
                  <p className="text-sm text-secondary" dir="ltr">{customer.phone}</p>
                  <p className="text-[10px] text-gray-400">{t("الهاتف", "Phone")}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order history */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
          <div className="p-5 pb-0">
            <h3 className="font-semibold text-secondary">{t("سجل الطلبات", "Order History")}</h3>
          </div>
          <div className="p-5">
            {customer.orders && customer.orders.length > 0 ? (
              <div className="space-y-3">
                {customer.orders.map((o) => (
                  <div key={o.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => router.push(`/${locale}/admin/orders/${o.id}`)}>
                    <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                      <Package size={16} className="text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-secondary">#{o.orderNumber}</p>
                      <p className="text-[10px] text-gray-400">
                        {o.items.length} {t("منتج", "items")} · {new Date(o.createdAt).toLocaleDateString(locale === "ar" ? "ar" : "fr")}
                      </p>
                    </div>
                    <div className="text-end">
                      <p className="text-sm font-semibold text-secondary">{o.total?.toLocaleString()} د.م</p>
                      <AdminBadge status={o.status} label={statusLabels[o.status]?.[locale === "ar" ? "ar" : "fr"] || o.status} />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">{t("لا توجد طلبات", "No orders yet")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
