"use client";

import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Truck, Loader2, GripVertical } from "lucide-react";
import { AdminConfirmDialog, AdminModal, AdminLoading } from "@/components/admin";
import { useToast } from "@/components/motion/Toast";
import { motion } from "framer-motion";

interface ShippingMethod {
  id: string; name: string; nameAr: string | null; description: string | null;
  price: number; freeAbove: number | null; estimatedDays: string | null;
  isActive: boolean; order: number;
}

const emptyForm = { name: "", nameAr: "", description: "", price: 0, freeAbove: 0, estimatedDays: "" };

export default function AdminShippingPage() {
  const locale = useLocale();
  const t = (ar: string, fr: string) => locale === "ar" ? ar : fr;
  const { addToast } = useToast();
  const [methods, setMethods] = useState<ShippingMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const fetchMethods = () => {
    setLoading(true);
    fetch("/api/admin/shipping").then((r) => r.json()).then((d) => setMethods(d.shippingMethods || [])).finally(() => setLoading(false));
  };
  useEffect(() => { fetchMethods(); }, []);

  const openEdit = (m: ShippingMethod) => {
    setEditId(m.id);
    setForm({ name: m.name, nameAr: m.nameAr || "", description: m.description || "", price: m.price, freeAbove: m.freeAbove || 0, estimatedDays: m.estimatedDays || "" });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.name) { addToast(t("أكمل الحقول", "Fill required fields")); return; }
    try {
      const url = "/api/admin/shipping";
      const method = editId ? "PUT" : "POST";
      const body = editId ? { id: editId, ...form } : form;
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) throw new Error();
      addToast(editId ? t("تم التحديث", "Updated") : t("تم الإنشاء", "Created"));
      setShowForm(false); setEditId(null); setForm(emptyForm); fetchMethods();
    } catch { addToast("Error"); }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      await fetch("/api/admin/shipping", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, isActive: !current }) });
      setMethods((prev) => prev.map((m) => m.id === id ? { ...m, isActive: !current } : m));
    } catch { addToast("Error"); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/admin/shipping?id=${deleteId}`, { method: "DELETE" });
      setMethods((prev) => prev.filter((m) => m.id !== deleteId));
      addToast(t("تم الحذف", "Deleted"));
    } catch { addToast("Error"); }
    setDeleteId(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-secondary">{t("الشحن", "Shipping")}</h1>
          <p className="text-sm text-gray-500">{methods.length} {t("طريقة شحن", "methods")}</p>
        </div>
        <button onClick={() => { setEditId(null); setForm(emptyForm); setShowForm(true); }}
          className="flex items-center gap-2 bg-gold text-secondary px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-gold-dark transition-colors shadow-sm">
          <Plus size={16} /> {t("إضافة طريقة", "Add Method")}
        </button>
      </div>

      {loading ? <AdminLoading /> : methods.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-gray-50">
          <Truck size={40} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">{t("لا توجد طرق شحن", "No shipping methods")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {methods.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              className={`bg-white rounded-2xl p-5 shadow-sm border ${m.isActive ? "border-gray-50" : "border-gray-200 opacity-60"}`}>
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Truck size={18} className="text-gold" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-secondary">{m.name}</p>
                    {m.nameAr && <span className="text-xs text-gray-400">({m.nameAr})</span>}
                  </div>
                  {m.description && <p className="text-sm text-gray-500">{m.description}</p>}
                </div>
                <div className="text-center px-4">
                  <p className="font-bold text-secondary">{m.price.toLocaleString()} د.م</p>
                  <p className="text-[11px] text-gray-400">{m.freeAbove ? `${t("مجاني فوق", "Free above")} ${m.freeAbove.toLocaleString()}` : t("رسوم ثابتة", "Fixed rate")}</p>
                </div>
                <div className="text-center px-4 hidden sm:block">
                  <p className="text-sm text-gray-600">{m.estimatedDays || "—"}</p>
                  <p className="text-[11px] text-gray-400">{t("أيام", "days")}</p>
                </div>
                <button onClick={() => handleToggleActive(m.id, m.isActive)}
                  className={`w-10 h-5 rounded-full transition-colors relative flex-shrink-0 ${m.isActive ? "bg-gold" : "bg-gray-300"}`}>
                  <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm ${m.isActive ? "start-5" : "start-0.5"}`} />
                </button>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button onClick={() => openEdit(m)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors"><Edit2 size={15} className="text-blue-500" /></button>
                  <button onClick={() => setDeleteId(m.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={15} className="text-red-400" /></button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Form modal */}
      <AdminModal open={showForm} title={editId ? t("تعديل طريقة الشحن", "Edit Method") : t("طريقة شحن جديدة", "New Method")} onClose={() => { setShowForm(false); setEditId(null); }}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Name *</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{t("الاسم (عربي)", "Name (Arabic)")}</label>
              <input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">{t("الوصف", "Description")}</label>
            <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{t("السعر (د.م)", "Price (MAD)")}</label>
              <input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{t("مجاني فوق", "Free Above")}</label>
              <input type="number" value={form.freeAbove} onChange={(e) => setForm({ ...form, freeAbove: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{t("أيام التوصيل", "Delivery Days")}</label>
              <input value={form.estimatedDays} onChange={(e) => setForm({ ...form, estimatedDays: e.target.value })}
                placeholder="2-5" className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold" />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => { setShowForm(false); setEditId(null); }} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
              {t("إلغاء", "Cancel")}
            </button>
            <button onClick={handleSave} className="px-6 py-2.5 bg-gold text-secondary text-sm font-medium rounded-xl hover:bg-gold-dark transition-colors shadow-sm">
              {editId ? t("حفظ", "Save") : t("إنشاء", "Create")}
            </button>
          </div>
        </div>
      </AdminModal>

      <AdminConfirmDialog open={!!deleteId} title={t("حذف طريقة الشحن", "Delete Method")}
        message={t("هل أنت متأكد؟", "Are you sure?")} danger
        confirmLabel={t("حذف", "Delete")} cancelLabel={t("إلغاء", "Cancel")}
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
