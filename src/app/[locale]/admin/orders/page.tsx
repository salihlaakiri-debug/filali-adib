"use client";

import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { Package, Eye, ChevronDown } from "lucide-react";
import { AdminTable, AdminSearch, AdminPagination, AdminBadge, AdminFilterTabs, AdminModal, AdminLoading, AdminConfirmDialog } from "@/components/admin";
import { useToast } from "@/components/motion/Toast";

interface Order {
  id: string; orderNumber: string; status: string; total: number; createdAt: string;
  shippingAddress?: any; notes?: string;
  user: { name: string; email: string; phone: string } | null;
  items: { quantity: number; price: number; product: { name: string; images: { url: string }[] } }[];
  payment: { method: string; status: string } | null;
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

const paymentLabels: Record<string, string> = {
  CASH_ON_DELIVERY: "COD", BANK_TRANSFER: "Virement", STRIPE: "Stripe", PAYPAL: "PayPal",
};

export default function AdminOrdersPage() {
  const locale = useLocale();
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
      addToast(locale === "ar" ? "تم تحديث الحالة" : "Status updated");
    } catch { addToast(locale === "ar" ? "خطأ" : "Error"); }
    setStatusConfirm(null);
  };

  const counts = { all: pagination.total };

  const columns = [
    {
      key: "order", label: locale === "ar" ? "رقم الطلب" : "Order #",
      render: (o: Order) => <span className="font-medium text-secondary">#{o.orderNumber}</span>,
    },
    {
      key: "customer", label: locale === "ar" ? "العميل" : "Customer",
      render: (o: Order) => (
        <div>
          <p className="text-sm font-medium text-secondary">{o.user?.name || "—"}</p>
          <p className="text-xs text-gray-400">{o.user?.email || ""}</p>
        </div>
      ),
    },
    {
      key: "items", label: locale === "ar" ? "المنتجات" : "Items",
      render: (o: Order) => <span className="text-sm">{o._count.items} {locale === "ar" ? "منتج" : "items"}</span>,
    },
    {
      key: "total", label: locale === "ar" ? "المجموع" : "Total",
      render: (o: Order) => <span className="font-medium">{o.total?.toLocaleString()} د.م</span>,
    },
    {
      key: "payment", label: locale === "ar" ? "الدفع" : "Payment",
      render: (o: Order) => <span className="text-xs text-gray-500">{o.payment?.method ? paymentLabels[o.payment.method] || o.payment.method : "—"}</span>,
    },
    {
      key: "date", label: locale === "ar" ? "التاريخ" : "Date",
      render: (o: Order) => <span className="text-sm text-gray-500">{new Date(o.createdAt).toLocaleDateString(locale === "ar" ? "ar-MA" : "fr-FR")}</span>,
    },
    {
      key: "status", label: locale === "ar" ? "الحالة" : "Status",
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
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Eye size={15} className="text-gray-400" />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-secondary">{locale === "ar" ? "الطلبات" : "Orders"}</h1>
        <p className="text-sm text-gray-500">{pagination.total} {locale === "ar" ? "طلب" : "orders"}</p>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <AdminSearch value={search} onChange={(v) => { setSearch(v); fetchOrders(1, v, filter); }}
          placeholder={locale === "ar" ? "بحث برقم الطلب أو اسم العميل..." : "Search by order # or customer..."} className="w-full sm:w-72" />
        <AdminFilterTabs
          tabs={[
            { key: "all", label: locale === "ar" ? "الكل" : "All" },
            { key: "PENDING", label: locale === "ar" ? "قيد الانتظار" : "Pending" },
            { key: "CONFIRMED", label: locale === "ar" ? "مؤكد" : "Confirmed" },
            { key: "SHIPPED", label: locale === "ar" ? "تم الشحن" : "Shipped" },
            { key: "DELIVERED", label: locale === "ar" ? "تم التوصيل" : "Delivered" },
            { key: "CANCELLED", label: locale === "ar" ? "ملغي" : "Cancelled" },
          ]}
          active={filter} onChange={(v) => { setFilter(v); fetchOrders(1, search, v); }} />
      </div>

      {loading ? <AdminLoading /> : (
        <>
          <AdminTable columns={columns} data={orders} keyExtractor={(o) => o.id} onRowClick={(o) => setSelectedOrder(o)}
            emptyMessage={locale === "ar" ? "لا توجد طلبات" : "No orders found"} />
          <AdminPagination page={pagination.page} totalPages={pagination.totalPages}
            onPageChange={(p) => fetchOrders(p)} totalItems={pagination.total} pageSize={pagination.limit} />
        </>
      )}

      {/* Order detail modal */}
      <AdminModal open={!!selectedOrder} title={selectedOrder ? `#${selectedOrder.orderNumber}` : ""} onClose={() => setSelectedOrder(null)} size="lg">
        {selectedOrder && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">{locale === "ar" ? "العميل" : "Customer"}</p>
                <p className="text-sm font-medium text-secondary">{selectedOrder.user?.name || "—"}</p>
                <p className="text-xs text-gray-500">{selectedOrder.user?.email}</p>
                {selectedOrder.user?.phone && <p className="text-xs text-gray-500" dir="ltr">{selectedOrder.user.phone}</p>}
              </div>
              <div className="p-3 bg-gray-50 rounded-xl">
                <p className="text-xs text-gray-500 mb-1">{locale === "ar" ? "الحالة" : "Status"}</p>
                <AdminBadge status={selectedOrder.status} label={statusLabels[selectedOrder.status]?.[locale === "ar" ? "ar" : "fr"] || selectedOrder.status} />
                <p className="text-xs text-gray-500 mt-1">{selectedOrder.payment?.method ? paymentLabels[selectedOrder.payment.method] || selectedOrder.payment.method : "—"}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-secondary mb-2">{locale === "ar" ? "المنتجات" : "Items"}</p>
              <div className="space-y-2">
                {selectedOrder.items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-white rounded-lg overflow-hidden flex-shrink-0">
                      {item.product?.images?.[0]?.url ? <img src={item.product.images[0].url} className="w-full h-full object-cover" /> : <Package size={14} className="text-gray-300 m-auto mt-3" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.product?.name}</p>
                      <p className="text-xs text-gray-500">×{item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium">{(item.price * item.quantity).toLocaleString()} د.م</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center p-3 bg-gold/5 rounded-xl">
              <span className="font-semibold text-secondary">{locale === "ar" ? "المجموع" : "Total"}</span>
              <span className="text-lg font-bold text-gold">{selectedOrder.total?.toLocaleString()} د.م</span>
            </div>
          </div>
        )}
      </AdminModal>

      {/* Status change confirmation */}
      <AdminConfirmDialog open={!!statusConfirm}
        title={locale === "ar" ? "تحديث الحالة" : "Update Status"}
        message={locale === "ar" ? `هل تريد تغيير حالة الطلب إلى "${statusConfirm ? (statusLabels[statusConfirm.status]?.ar || statusConfirm.status) : ""}"؟` : `Change order status to "${statusConfirm ? (statusLabels[statusConfirm.status]?.fr || statusConfirm.status) : ""}"?`}
        confirmLabel={locale === "ar" ? "تأكيد" : "Confirm"} cancelLabel={locale === "ar" ? "إلغاء" : "Cancel"}
        onConfirm={confirmStatusChange} onCancel={() => setStatusConfirm(null)} />
    </div>
  );
}
