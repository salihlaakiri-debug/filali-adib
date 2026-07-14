"use client";

import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Copy, Tag, Check } from "lucide-react";
import { AdminConfirmDialog, AdminModal, AdminLoading } from "@/components/admin";
import { useToast } from "@/components/motion/Toast";
import { motion } from "framer-motion";

interface Coupon {
  id: string; code: string; description: string | null; discountType: string; discountValue: number;
  minPurchase: number | null; maxDiscount: number | null; usageLimit: number | null; usedCount: number;
  isActive: boolean; startsAt: string | null; expiresAt: string | null;
}

const emptyForm = { code: "", description: "", discountType: "PERCENTAGE", discountValue: 10, minPurchase: 0, maxDiscount: 0, usageLimit: 100, startsAt: "", expiresAt: "" };

export default function AdminCouponsPage() {
  const locale = useLocale();
  const { addToast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const fetchCoupons = () => {
    setLoading(true);
    fetch("/api/admin/coupons").then((r) => r.json()).then((d) => setCoupons(d.coupons || [])).finally(() => setLoading(false));
  };
  useEffect(() => { fetchCoupons(); }, []);

  const openEdit = (coupon: Coupon) => {
    setEditId(coupon.id);
    setForm({
      code: coupon.code, description: coupon.description || "", discountType: coupon.discountType,
      discountValue: coupon.discountValue, minPurchase: coupon.minPurchase || 0,
      maxDiscount: coupon.maxDiscount || 0, usageLimit: coupon.usageLimit || 100,
      startsAt: coupon.startsAt ? coupon.startsAt.split("T")[0] : "",
      expiresAt: coupon.expiresAt ? coupon.expiresAt.split("T")[0] : "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.code || !form.discountValue) { addToast(locale === "ar" ? "أكمل الحقول" : "Fill required fields"); return; }
    try {
      const url = "/api/admin/coupons";
      const method = editId ? "PUT" : "POST";
      const body = editId ? { id: editId, ...form } : form;
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) { addToast(data.error || "Error"); return; }
      addToast(editId ? (locale === "ar" ? "تم التحديث" : "Updated") : (locale === "ar" ? "تم الإنشاء" : "Created"));
      setShowForm(false); setEditId(null); setForm(emptyForm); fetchCoupons();
    } catch { addToast("Error"); }
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      await fetch("/api/admin/coupons", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, isActive: !current }) });
      setCoupons((prev) => prev.map((c) => c.id === id ? { ...c, isActive: !current } : c));
    } catch { addToast("Error"); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await fetch(`/api/admin/coupons?id=${deleteId}`, { method: "DELETE" });
      setCoupons((prev) => prev.filter((c) => c.id !== deleteId));
      addToast(locale === "ar" ? "تم الحذف" : "Deleted");
    } catch { addToast("Error"); }
    setDeleteId(null);
  };

  const copyCode = (code: string) => { navigator.clipboard.writeText(code); setCopied(code); setTimeout(() => setCopied(null), 1500); };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-secondary">{locale === "ar" ? "الكوبونات" : "Coupons"}</h1>
          <p className="text-sm text-gray-500">{coupons.length} {locale === "ar" ? "كوبون" : "coupons"}</p>
        </div>
        <button onClick={() => { setEditId(null); setForm(emptyForm); setShowForm(true); }}
          className="flex items-center gap-2 bg-gold text-secondary px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-gold-dark transition-colors shadow-sm">
          <Plus size={16} /> {locale === "ar" ? "إضافة كوبون" : "Add Coupon"}
        </button>
      </div>

      {loading ? <AdminLoading /> : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {["Code", "Type", "Value", "Min", "Usage", "Expires", "Status", ""].map((h, i) => (
                    <th key={i} className="px-5 py-3 text-start text-xs font-semibold text-gray-500 uppercase">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {coupons.map((coupon) => {
                  const isExpired = coupon.expiresAt && new Date(coupon.expiresAt) < new Date();
                  return (
                    <tr key={coupon.id} className="hover:bg-gray-50/80 transition-colors">
                      <td className="px-5 py-3.5">
                        <button onClick={() => copyCode(coupon.code)} className="flex items-center gap-2 font-mono text-sm font-medium text-secondary hover:text-gold transition-colors">
                          {coupon.code}
                          {copied === coupon.code ? <Check size={12} className="text-green-500" /> : <Copy size={12} className="text-gray-400" />}
                        </button>
                      </td>
                      <td className="px-5 py-3.5 text-sm text-gray-600">{coupon.discountType === "PERCENTAGE" ? "%" : "Fixed"}</td>
                      <td className="px-5 py-3.5 text-sm font-medium">{coupon.discountValue}{coupon.discountType === "PERCENTAGE" ? "%" : " MAD"}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{coupon.minPurchase ? `${coupon.minPurchase.toLocaleString()} د.م` : "—"}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{coupon.usedCount}/{coupon.usageLimit || "∞"}</td>
                      <td className="px-5 py-3.5 text-sm text-gray-500">{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "—"}</td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => handleToggleActive(coupon.id, coupon.isActive)}
                          className={`w-10 h-5 rounded-full transition-colors relative ${coupon.isActive ? "bg-gold" : "bg-gray-300"}`}>
                          <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 transition-transform shadow-sm ${coupon.isActive ? "start-5" : "start-0.5"}`} />
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1">
                          <button onClick={() => openEdit(coupon)} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"><Edit2 size={14} className="text-blue-500" /></button>
                          <button onClick={() => setDeleteId(coupon.id)} className="p-1.5 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={14} className="text-red-400" /></button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {coupons.length === 0 && (
                  <tr><td colSpan={8} className="px-5 py-12 text-center text-gray-400">
                    <Tag size={32} className="mx-auto mb-2 text-gray-300" />
                    <p>{locale === "ar" ? "لا توجد كوبونات" : "No coupons yet"}</p>
                  </td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Coupon form modal */}
      <AdminModal open={showForm} title={editId ? (locale === "ar" ? "تعديل الكوبون" : "Edit Coupon") : (locale === "ar" ? "كوبون جديد" : "New Coupon")} onClose={() => { setShowForm(false); setEditId(null); }} size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Code *</label>
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold font-mono" dir="ltr" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{locale === "ar" ? "نوع الخصم" : "Type"} *</label>
              <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold">
                <option value="PERCENTAGE">%</option>
                <option value="FIXED">Fixed (MAD)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{locale === "ar" ? "قيمة الخصم" : "Value"} *</label>
              <input type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{locale === "ar" ? "الحد الأدنى للشراء" : "Min Purchase"}</label>
              <input type="number" value={form.minPurchase} onChange={(e) => setForm({ ...form, minPurchase: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{locale === "ar" ? "الحد الأقصى للخصم" : "Max Discount"}</label>
              <input type="number" value={form.maxDiscount} onChange={(e) => setForm({ ...form, maxDiscount: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{locale === "ar" ? "حد الاستخدام" : "Usage Limit"}</label>
              <input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{locale === "ar" ? "الوصف" : "Description"}</label>
              <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{locale === "ar" ? "تاريخ البداية" : "Starts At"}</label>
              <input type="date" value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{locale === "ar" ? "تاريخ الانتهاء" : "Expires At"}</label>
              <input type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold" />
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => { setShowForm(false); setEditId(null); }} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
              {locale === "ar" ? "إلغاء" : "Cancel"}
            </button>
            <button onClick={handleSave} className="px-6 py-2.5 bg-gold text-secondary text-sm font-medium rounded-xl hover:bg-gold-dark transition-colors shadow-sm">
              {editId ? (locale === "ar" ? "حفظ" : "Save") : (locale === "ar" ? "إنشاء" : "Create")}
            </button>
          </div>
        </div>
      </AdminModal>

      <AdminConfirmDialog open={!!deleteId} title={locale === "ar" ? "حذف الكوبون" : "Delete Coupon"}
        message={locale === "ar" ? "هل أنت متأكد؟" : "Are you sure?"} danger
        confirmLabel={locale === "ar" ? "حذف" : "Delete"} cancelLabel={locale === "ar" ? "إلغاء" : "Cancel"}
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
