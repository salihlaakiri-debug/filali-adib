"use client";

import { useLocale } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowLeft, Package, MapPin, CreditCard, Clock, CheckCircle, XCircle,
  MessageSquare, Printer, Truck, Phone, Mail, ArrowRight,
} from "lucide-react";
import { AdminBadge, AdminLoading, AdminConfirmDialog } from "@/components/admin";
import { useToast } from "@/components/motion/Toast";

interface Order {
  id: string; orderNumber: string; status: string; total: number; createdAt: string;
  shippingAddress?: any; notes?: string; phone?: string;
  shippedAt?: string; deliveredAt?: string; paidAt?: string; confirmedAt?: string;
  user: { name: string; email: string; phone: string } | null;
  items: { quantity: number; price: number; total: number; product: { name: string; weight?: number; karat?: string; images: { url: string }[] } }[];
  payment: { method: string; status: string; amount?: number } | null;
  _count: { items: number };
}

const statusLabels: Record<string, { ar: string; fr: string }> = {
  PENDING: { ar: "قيد الانتظار", fr: "En attente" },
  CONFIRMED: { ar: "مؤكد", fr: "Confirmé" },
  PROCESSING: { ar: "قيد التجهيز", fr: "En cours" },
  SHIPPED: { ar: "تم الشحن", fr: "Expédié" },
  DELIVERED: { ar: "تم التوصيل", fr: "Livré" },
  CANCELLED: { ar: "ملغي", fr: "Annulé" },
};

const paymentLabels: Record<string, { ar: string; fr: string }> = {
  CASH_ON_DELIVERY: { ar: "الدفع عند الاستلام", fr: "Paiement à la livraison" },
  BANK_TRANSFER: { ar: "تحويل بنكي", fr: "Virement bancaire" },
  STRIPE: { ar: "بطاقة بنكية", fr: "Carte bancaire" },
};

const statusFlow = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function OrderDetailPage() {
  const locale = useLocale();
  const t = (ar: string, fr: string) => locale === "ar" ? ar : fr;
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { addToast } = useToast();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusConfirm, setStatusConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/admin/orders?search=${id}&limit=1`)
      .then((r) => r.json())
      .then((d) => {
        const found = d.orders?.find((o: Order) => o.id === id);
        if (found) setOrder(found);
        else { addToast(t("الطلب غير موجود", "Order not found")); router.push(`/${locale}/admin/orders`); }
      })
      .catch(() => console.warn("Failed to fetch order"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleStatusChange = async () => {
    if (!statusConfirm || !order) return;
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, status: statusConfirm }),
      });
      if (!res.ok) throw new Error();
      setOrder((prev) => prev ? { ...prev, status: statusConfirm } : null);
      addToast(t("تم تحديث الحالة", "Status updated"));
    } catch { addToast(t("خطأ", "Error")); }
    setStatusConfirm(null);
  };

  if (loading) return <AdminLoading />;
  if (!order) return null;

  const getStatusIndex = (status: string) => statusFlow.indexOf(status);
  const currentIdx = getStatusIndex(order.status);
  const shippingCost = 0;
  const subtotal = order.items.reduce((s, item) => s + item.price * item.quantity, 0);

  return (
    <div className="max-w-4xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push(`/${locale}/admin/orders`)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={18} className="text-gray-500" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-secondary">#{order.orderNumber}</h1>
            <p className="text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleDateString(locale === "ar" ? "ar" : "fr", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
              {" · "}
              {new Date(order.createdAt).toLocaleTimeString(locale === "ar" ? "ar" : "fr", { hour: "2-digit", minute: "2-digit" })}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => window.print()} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Printer size={14} /> {t("طباعة", "Print")}
          </button>
          <AdminBadge status={order.status} label={statusLabels[order.status]?.[locale === "ar" ? "ar" : "fr"] || order.status} />
        </div>
      </div>

      {/* Timeline */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-50">
        <h3 className="font-semibold text-secondary mb-5">{t("تتبع الطلب", "Order Timeline")}</h3>
        <div className="relative">
          <div className="flex items-start justify-between">
            {statusFlow.map((s, i) => {
              const isCompleted = i <= currentIdx && order.status !== "CANCELLED";
              const isCurrent = i === currentIdx;
              return (
                <div key={s} className="flex flex-col items-center flex-1 relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold z-10 transition-all ${
                    isCompleted ? "bg-gold text-secondary" : isCurrent ? "bg-gold text-secondary ring-4 ring-gold/20" : "bg-gray-100 text-gray-400"
                  }`}>
                    {isCompleted && !isCurrent ? <CheckCircle size={18} /> : i + 1}
                  </div>
                  <p className={`text-xs mt-2 text-center font-medium ${isCompleted ? "text-gold" : "text-gray-400"}`}>
                    {statusLabels[s]?.[locale === "ar" ? "ar" : "fr"]}
                  </p>
                  {i < statusFlow.length - 1 && (
                    <div className={`absolute top-5 w-full h-0.5 ${i < currentIdx ? "bg-gold" : "bg-gray-200"}`} style={{ insetInlineStart: "55%", width: "90%" }} />
                  )}
                </div>
              );
            })}
          </div>
          {order.status === "CANCELLED" && (
            <div className="flex items-center gap-2 mt-4 p-3 bg-red-50 rounded-xl text-red-500 text-sm">
              <XCircle size={16} /> {t("تم إلغاء الطلب", "Order was cancelled")}
            </div>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-5">
          {/* Items */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
            <h3 className="font-semibold text-secondary mb-4">{t("المنتجات", "Items")} ({order.items.length})</h3>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                  <div className="w-16 h-16 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                    {item.product?.images?.[0]?.url ? <img src={item.product.images[0].url} className="w-full h-full object-cover" /> : <Package size={18} className="text-gray-300 m-auto mt-6" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-secondary">{item.product?.name}</p>
                    <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                      {item.product?.weight && <span>{item.product.weight}g</span>}
                      {item.product?.karat && <span>{item.product.karat}</span>}
                      <span>{item.quantity} × {item.price?.toLocaleString()} د.م</span>
                    </div>
                  </div>
                  <span className="text-base font-semibold text-secondary">{(item.price * item.quantity).toLocaleString()} <span className="text-xs font-normal text-gray-400">د.م</span></span>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-sm text-gray-500">
                <span>{t("المجموع الفرعي", "Subtotal")}</span>
                <span>{subtotal.toLocaleString()} د.م</span>
              </div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{t("الشحن", "Shipping")}</span>
                <span>{shippingCost > 0 ? `${shippingCost} د.م` : t("مجاني", "Free")}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gold/5 rounded-xl">
                <span className="font-semibold text-secondary">{t("المجموع الكلي", "Total")}</span>
                <span className="text-xl font-bold text-gold">{order.total?.toLocaleString()} د.م</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {order.notes && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
              <h3 className="font-semibold text-secondary mb-3 flex items-center gap-2">
                <MessageSquare size={16} /> {t("ملاحظات", "Notes")}
              </h3>
              <p className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">{order.notes}</p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Customer */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 space-y-3">
            <h3 className="font-semibold text-secondary">{t("العميل", "Customer")}</h3>
            <div className="space-y-2">
              <p className="text-sm font-medium text-secondary">{order.user?.name || "—"}</p>
              {order.user?.email && (
                <p className="text-xs text-gray-500 flex items-center gap-1.5"><Mail size={12} /> {order.user.email}</p>
              )}
              {order.user?.phone && (
                <p className="text-xs text-gray-500 flex items-center gap-1.5" dir="ltr"><Phone size={12} /> {order.user.phone}</p>
              )}
            </div>
          </div>

          {/* Payment */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 space-y-3">
            <h3 className="font-semibold text-secondary flex items-center gap-2">
              <CreditCard size={16} /> {t("الدفع", "Payment")}
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                {order.payment?.method ? paymentLabels[order.payment.method]?.[locale === "ar" ? "ar" : "fr"] || order.payment.method : "—"}
              </p>
              <AdminBadge status={order.payment?.status || "PENDING"} label={order.payment?.status || "—"} />
            </div>
          </div>

          {/* Shipping address */}
          {order.shippingAddress && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 space-y-3">
              <h3 className="font-semibold text-secondary flex items-center gap-2">
                <MapPin size={16} /> {t("عنوان الشحن", "Shipping Address")}
              </h3>
              <div className="text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
                {typeof order.shippingAddress === "string" ? order.shippingAddress : (
                  <div className="space-y-0.5">
                    {order.shippingAddress.street && <p>{order.shippingAddress.street}</p>}
                    {order.shippingAddress.city && <p>{order.shippingAddress.city}</p>}
                    {order.shippingAddress.state && <p>{order.shippingAddress.state}</p>}
                    {order.shippingAddress.zip && <p>{order.shippingAddress.zip}</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quick actions */}
          {order.status !== "DELIVERED" && order.status !== "CANCELLED" && (
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 space-y-3">
              <h3 className="font-semibold text-secondary">{t("تحديث سريع", "Quick Update")}</h3>
              <div className="space-y-2">
                {statusFlow.filter((s) => getStatusIndex(s) > currentIdx).map((s) => (
                  <button key={s} onClick={() => setStatusConfirm(s)}
                    className="w-full flex items-center gap-2 px-4 py-2.5 bg-gold/10 text-gold hover:bg-gold/20 rounded-xl text-sm font-medium transition-colors">
                    <ArrowRight size={14} /> {statusLabels[s]?.[locale === "ar" ? "ar" : "fr"]}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <AdminConfirmDialog open={!!statusConfirm}
        title={t("تحديث الحالة", "Update Status")}
        message={t(`هل تريد تغيير حالة الطلب إلى "${statusConfirm ? (statusLabels[statusConfirm]?.ar || statusConfirm) : ""}"؟`, `Change order status to "${statusConfirm ? (statusLabels[statusConfirm]?.fr || statusConfirm) : ""}"?`)}
        confirmLabel={t("تأكيد", "Confirm")} cancelLabel={t("إلغاء", "Cancel")}
        onConfirm={handleStatusChange} onCancel={() => setStatusConfirm(null)} />
    </div>
  );
}
