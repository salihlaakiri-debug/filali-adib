"use client";

import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import {
  Package, Eye, MapPin, Clock, CreditCard, Truck, CheckCircle, XCircle,
  Printer, MessageSquare, ArrowRight,
} from "lucide-react";
import { AdminTable, AdminSearch, AdminPagination, AdminBadge, AdminFilterTabs, AdminModal, AdminLoading, AdminConfirmDialog } from "@/components/admin";
import { useToast } from "@/components/motion/Toast";
import { motion } from "framer-motion";

interface Order {
  id: string; orderNumber: string; status: string; total: number; createdAt: string;
  shippingAddress?: any; notes?: string; phone?: string;
  shippedAt?: string; deliveredAt?: string; paidAt?: string; confirmedAt?: string;
  user: { name: string; email: string; phone: string } | null;
  items: { quantity: number; price: number; total: number; product: { name: string; weight?: number; karat?: string; images: { url: string }[] } }[];
  payment: { method: string; status: string; amount?: number } | null;
  _count: { items: number };
}
interface Pagination { page: number; limit: number; total: number; totalPages: number }

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
  PAYPAL: { ar: "باي بال", fr: "PayPal" },
};

const statusFlow = ["PENDING", "CONFIRMED", "PROCESSING", "SHIPPED", "DELIVERED"];

export default function AdminOrdersPage() {
  const locale = useLocale();
  const t = (ar: string, fr: string) => locale === "ar" ? ar : fr;
  const { addToast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 15, total: 0, totalPages: 0 });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [statusConfirm, setStatusConfirm] = useState<{ orderId: string; status: string } | null>(null);

  const fetchOrders = (page = 1, searchVal = search, filterVal = filter) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "15" });
    if (searchVal) params.set("search", searchVal);
    if (filterVal !== "all") params.set("status", filterVal);
    fetch(`/api/admin/orders?${params}`)
      .then((r) => r.json())
      .then((d) => { setOrders(d.orders || []); setPagination(d.pagination || { page: 1, limit: 15, total: 0, totalPages: 0 }); })
      .catch(() => addToast("Error"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    setStatusConfirm({ orderId, status: newStatus });
  };

  const confirmStatusChange = async () => {
    if (!statusConfirm) return;
    try {
      const res = await fetch("/api/admin/orders", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(statusConfirm),
      });
      if (!res.ok) throw new Error();
      setOrders((prev) => prev.map((o) => o.id === statusConfirm.orderId ? { ...o, status: statusConfirm.status } : o));
      if (selectedOrder?.id === statusConfirm.orderId) setSelectedOrder((prev) => prev ? { ...prev, status: statusConfirm.status } : null);
      addToast(t("تم تحديث الحالة", "Status updated"));
    } catch { addToast(t("خطأ", "Error")); }
    setStatusConfirm(null);
  };

  const getStatusIndex = (status: string) => statusFlow.indexOf(status);

  const columns = [
    {
      key: "order", label: t("رقم الطلب", "Order #"),
      render: (o: Order) => <span className="font-semibold text-secondary">#{o.orderNumber}</span>,
    },
    {
      key: "customer", label: t("العميل", "Customer"),
      render: (o: Order) => (
        <div>
          <p className="text-sm font-medium text-secondary">{o.user?.name || "—"}</p>
          <p className="text-xs text-gray-400">{o.user?.email || ""}</p>
        </div>
      ),
    },
    {
      key: "items", label: t("المنتجات", "Items"),
      render: (o: Order) => (
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2">
            {o.items.slice(0, 3).map((item, i) => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-white overflow-hidden bg-gray-100 flex-shrink-0">
                {item.product?.images?.[0]?.url ? <img src={item.product.images[0].url} className="w-full h-full object-cover" /> : <Package size={10} className="text-gray-300 m-auto mt-2" />}
              </div>
            ))}
          </div>
          <span className="text-xs text-gray-500">{o._count.items}</span>
        </div>
      ),
    },
    {
      key: "total", label: t("المجموع", "Total"),
      render: (o: Order) => <span className="font-semibold text-secondary">{o.total?.toLocaleString()} <span className="text-xs font-normal text-gray-400">د.م</span></span>,
    },
    {
      key: "payment", label: t("الدفع", "Payment"),
      render: (o: Order) => (
        <div className="flex items-center gap-1.5">
          <CreditCard size={12} className="text-gray-400" />
          <span className="text-xs text-gray-500">{o.payment?.method ? paymentLabels[o.payment.method]?.[locale === "ar" ? "ar" : "fr"] || o.payment.method : "—"}</span>
        </div>
      ),
    },
    {
      key: "date", label: t("التاريخ", "Date"),
      render: (o: Order) => (
        <div>
          <p className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleDateString(locale === "ar" ? "ar" : "fr", { day: "numeric", month: "short", year: "numeric" })}</p>
          <p className="text-[10px] text-gray-400">{new Date(o.createdAt).toLocaleTimeString(locale === "ar" ? "ar" : "fr", { hour: "2-digit", minute: "2-digit" })}</p>
        </div>
      ),
    },
    {
      key: "status", label: t("الحالة", "Status"),
      render: (o: Order) => (
        <select value={o.status} onChange={(e) => { e.stopPropagation(); handleStatusChange(o.id, e.target.value); }}
          className={`text-xs font-medium px-3 py-1.5 rounded-lg border cursor-pointer focus:outline-none focus:ring-2 focus:ring-gold/20 ${
            o.status === "DELIVERED" ? "bg-green-50 border-green-200 text-green-700" :
            o.status === "CANCELLED" ? "bg-red-50 border-red-200 text-red-700" :
            "bg-gray-50 border-gray-200 text-gray-700"
          }`}>
          {Object.entries(statusLabels).map(([key, labels]) => (
            <option key={key} value={key}>{labels[locale === "ar" ? "ar" : "fr"]}</option>
          ))}
        </select>
      ),
    },
    {
      key: "actions", label: "",
      render: (o: Order) => (
        <button onClick={(e) => { e.stopPropagation(); setSelectedOrder(o); }}
          className="p-2 hover:bg-gold/10 rounded-lg transition-colors group">
          <Eye size={15} className="text-gray-400 group-hover:text-gold" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-secondary">{t("الطلبات", "Orders")}</h1>
        <p className="text-sm text-gray-500">{pagination.total} {t("طلب", "orders")}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <AdminSearch value={search} onChange={(v) => { setSearch(v); fetchOrders(1, v, filter); }}
          placeholder={t("بحث برقم الطلب أو اسم العميل...", "Search by order # or customer...")} className="w-full sm:w-72" />
        <AdminFilterTabs
          tabs={[
            { key: "all", label: t("الكل", "All") },
            { key: "PENDING", label: t("قيد الانتظار", "Pending") },
            { key: "CONFIRMED", label: t("مؤكد", "Confirmed") },
            { key: "SHIPPED", label: t("تم الشحن", "Shipped") },
            { key: "DELIVERED", label: t("تم التوصيل", "Delivered") },
            { key: "CANCELLED", label: t("ملغي", "Cancelled") },
          ]}
          active={filter} onChange={(v) => { setFilter(v); fetchOrders(1, search, v); }} />
      </div>

      {loading ? <AdminLoading /> : (
        <>
          <AdminTable columns={columns} data={orders} keyExtractor={(o) => o.id} onRowClick={(o) => setSelectedOrder(o)}
            emptyMessage={t("لا توجد طلبات", "No orders found")} />
          <AdminPagination page={pagination.page} totalPages={pagination.totalPages}
            onPageChange={(p) => fetchOrders(p)} totalItems={pagination.total} pageSize={pagination.limit} />
        </>
      )}

      {/* Enhanced order detail modal */}
      <AdminModal open={!!selectedOrder} title={selectedOrder ? `#${selectedOrder.orderNumber}` : ""} onClose={() => setSelectedOrder(null)} size="lg">
        {selectedOrder && (
          <div className="space-y-5">
            {/* Status timeline */}
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-xs font-medium text-gray-500 mb-3">{t("تتبع الطلب", "Order Timeline")}</p>
              <div className="flex items-center gap-0">
                {statusFlow.map((s, i) => {
                  const currentIdx = getStatusIndex(selectedOrder.status);
                  const isCompleted = i <= currentIdx && selectedOrder.status !== "CANCELLED";
                  const isCurrent = i === currentIdx;
                  return (
                    <div key={s} className="flex-1 flex flex-col items-center relative">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold z-10 transition-all ${
                        isCompleted ? "bg-gold text-secondary" : isCurrent ? "bg-gold text-secondary ring-4 ring-gold/20" : "bg-gray-200 text-gray-400"
                      }`}>
                        {isCompleted && !isCurrent ? <CheckCircle size={14} /> : i + 1}
                      </div>
                      <span className={`text-[9px] mt-1.5 text-center ${isCompleted ? "text-gold font-medium" : "text-gray-400"}`}>
                        {statusLabels[s]?.[locale === "ar" ? "ar" : "fr"]}
                      </span>
                      {i < statusFlow.length - 1 && (
                        <div className={`absolute top-3.5 inset-x-0 h-0.5 ${i < currentIdx ? "bg-gold" : "bg-gray-200"}`} style={{ insetInlineStart: "50%", width: "100%" }} />
                      )}
                    </div>
                  );
                })}
              </div>
              {selectedOrder.status === "CANCELLED" && (
                <div className="flex items-center gap-2 mt-3 text-red-500 text-xs">
                  <XCircle size={14} /> {t("تم إلغاء الطلب", "Order was cancelled")}
                </div>
              )}
            </div>

            {/* Customer + Payment info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                  <Package size={12} /> {t("العميل", "Customer")}
                </p>
                <p className="text-sm font-semibold text-secondary">{selectedOrder.user?.name || "—"}</p>
                <p className="text-xs text-gray-500">{selectedOrder.user?.email}</p>
                {selectedOrder.user?.phone && <p className="text-xs text-gray-500" dir="ltr">{selectedOrder.user.phone}</p>}
              </div>
              <div className="p-4 bg-gray-50 rounded-xl space-y-2">
                <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5">
                  <CreditCard size={12} /> {t("الدفع", "Payment")}
                </p>
                <p className="text-sm font-semibold text-secondary">
                  {selectedOrder.payment?.method ? paymentLabels[selectedOrder.payment.method]?.[locale === "ar" ? "ar" : "fr"] || selectedOrder.payment.method : "—"}
                </p>
                <AdminBadge status={selectedOrder.payment?.status || "PENDING"} label={selectedOrder.payment?.status || "—"} />
                <p className="text-lg font-bold text-gold">{selectedOrder.total?.toLocaleString()} د.م</p>
              </div>
            </div>

            {/* Shipping address */}
            {selectedOrder.shippingAddress && (
              <div className="p-4 bg-blue-50/50 rounded-xl">
                <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-2">
                  <MapPin size={12} /> {t("عنوان الشحن", "Shipping Address")}
                </p>
                <div className="text-sm text-gray-700">
                  {typeof selectedOrder.shippingAddress === "string" ? selectedOrder.shippingAddress : (
                    <>
                      {selectedOrder.shippingAddress.street && <p>{selectedOrder.shippingAddress.street}</p>}
                      {selectedOrder.shippingAddress.city && <p>{selectedOrder.shippingAddress.city}</p>}
                      {selectedOrder.shippingAddress.state && <p>{selectedOrder.shippingAddress.state}</p>}
                      {selectedOrder.shippingAddress.zip && <p>{selectedOrder.shippingAddress.zip}</p>}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {selectedOrder.notes && (
              <div className="p-4 bg-yellow-50/50 rounded-xl">
                <p className="text-xs font-medium text-gray-500 flex items-center gap-1.5 mb-1">
                  <MessageSquare size={12} /> {t("ملاحظات", "Notes")}
                </p>
                <p className="text-sm text-gray-700">{selectedOrder.notes}</p>
              </div>
            )}

            {/* Items */}
            <div>
              <p className="text-sm font-semibold text-secondary mb-3">{t("المنتجات", "Items")} ({selectedOrder.items.length})</p>
              <div className="space-y-2">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-12 h-12 bg-white rounded-lg overflow-hidden flex-shrink-0 border border-gray-100">
                      {item.product?.images?.[0]?.url ? <img src={item.product.images[0].url} className="w-full h-full object-cover" /> : <Package size={14} className="text-gray-300 m-auto mt-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-secondary truncate">{item.product?.name}</p>
                      <div className="flex items-center gap-2 text-[10px] text-gray-400">
                        {item.product?.weight && <span>{item.product.weight}g</span>}
                        {item.product?.karat && <span>· {item.product.karat}</span>}
                        <span>× {item.quantity}</span>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-secondary">{(item.price * item.quantity).toLocaleString()} د.م</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="flex justify-between items-center p-4 bg-gold/5 rounded-xl border border-gold/10">
              <span className="font-semibold text-secondary">{t("المجموع", "Total")}</span>
              <span className="text-xl font-bold text-gold">{selectedOrder.total?.toLocaleString()} د.م</span>
            </div>

            {/* Quick status update buttons */}
            {selectedOrder.status !== "DELIVERED" && selectedOrder.status !== "CANCELLED" && (
              <div className="flex gap-2 flex-wrap">
                {statusFlow.filter((s) => getStatusIndex(s) > getStatusIndex(selectedOrder.status)).map((s) => (
                  <button key={s} onClick={() => handleStatusChange(selectedOrder.id, s)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gold/10 text-gold hover:bg-gold/20 rounded-xl text-xs font-medium transition-colors">
                    <ArrowRight size={12} /> {t("تحويل إلى", "Move to")} {statusLabels[s]?.[locale === "ar" ? "ar" : "fr"]}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </AdminModal>

      <AdminConfirmDialog open={!!statusConfirm}
        title={t("تحديث الحالة", "Update Status")}
        message={t(`هل تريد تغيير حالة الطلب إلى "${statusConfirm ? (statusLabels[statusConfirm.status]?.ar || statusConfirm.status) : ""}"؟`, `Change order status to "${statusConfirm ? (statusLabels[statusConfirm.status]?.fr || statusConfirm.status) : ""}"?`)}
        confirmLabel={t("تأكيد", "Confirm")} cancelLabel={t("إلغاء", "Cancel")}
        onConfirm={confirmStatusChange} onCancel={() => setStatusConfirm(null)} />
    </div>
  );
}
