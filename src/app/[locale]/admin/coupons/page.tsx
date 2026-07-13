"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Copy, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { useToast } from "@/components/motion/Toast";

interface Coupon {
  id: string; code: string; description: string | null; discountType: string;
  discountValue: number; minPurchase: number | null; usedCount: number;
  usageLimit: number | null; isActive: boolean; startsAt: string; expiresAt: string;
}

export default function AdminCouponsPage() {
  const { addToast } = useToast();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", description: "", discountType: "PERCENTAGE", discountValue: 10, minPurchase: 0, usageLimit: 100 });

  const fetchCoupons = () => {
    fetch("/api/admin/coupons").then((r) => r.json()).then((data) => setCoupons(data.coupons || [])).finally(() => setLoading(false));
  };
  useEffect(() => { fetchCoupons(); }, []);

  const handleCreate = async () => {
    try {
      const res = await fetch("/api/admin/coupons", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) { addToast("تم إنشاء الكوبون بنجاح"); setShowForm(false); fetchCoupons(); }
      else { const d = await res.json(); addToast(d.error || "حدث خطأ"); }
    } catch { addToast("حدث خطأ"); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("هل أنت متأكد من حذف هذا الكوبون؟")) return;
    try {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
      if (res.ok) { addToast("تم الحذف بنجاح"); fetchCoupons(); }
    } catch { addToast("حدث خطأ"); }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">كوبونات الخصم</h1>
        <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => setShowForm(!showForm)}
          className="bg-gold text-secondary px-4 py-2 rounded-lg font-medium hover:bg-gold-dark transition-colors flex items-center gap-2 shadow-lg shadow-gold/20">
          <Plus size={18} /> إضافة كوبون
        </motion.button>
      </motion.div>

      {showForm && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
          className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h3 className="font-semibold mb-4">كوبون جديد</h3>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">الكود *</label>
              <input type="text" value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gold" placeholder="NEWCODE" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">النوع</label>
              <select value={form.discountType} onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gold">
                <option value="PERCENTAGE">نسبة مئوية (%)</option>
                <option value="FIXED">مبلغ ثابت</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">القيمة</label>
              <input type="number" value={form.discountValue} onChange={(e) => setForm({ ...form, discountValue: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">الحد الأدنى للطلب</label>
              <input type="number" value={form.minPurchase} onChange={(e) => setForm({ ...form, minPurchase: Number(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">الوصف</label>
              <input type="text" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gold" />
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleCreate} className="bg-gold text-secondary px-6 py-2 rounded-lg font-medium hover:bg-gold-dark transition-colors">إنشاء</button>
            <button onClick={() => setShowForm(false)} className="px-6 py-2 border border-gray-200 rounded-lg font-medium hover:bg-gray-50">إلغاء</button>
          </div>
        </motion.div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><Loader2 size={32} className="text-gold animate-spin" /></div>
      ) : (
        <FadeIn direction="up">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 bg-gray-50">
                    {["الكود", "النوع", "القيمة", "الحد الأدنى", "الاستخدام", "الانتهاء", "الحالة", "إجراءات"].map((h) => (
                      <th key={h} className="px-6 py-4 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {coupons.map((coupon, i) => (
                    <motion.tr key={coupon.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}
                      className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-medium text-gold">{coupon.code}</span>
                          <motion.button whileTap={{ scale: 0.85 }} onClick={() => { navigator.clipboard.writeText(coupon.code); addToast("تم نسخ الكود"); }}
                            className="text-gray-400 hover:text-gold transition-colors"><Copy size={14} /></motion.button>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{coupon.discountType === "PERCENTAGE" ? "نسبة مئوية" : "مبلغ ثابت"}</td>
                      <td className="px-6 py-4 font-medium text-gray-800">{coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : `${coupon.discountValue.toLocaleString()} د.م`}</td>
                      <td className="px-6 py-4 text-gray-600">{coupon.minPurchase ? `${coupon.minPurchase.toLocaleString()} د.م` : "—"}</td>
                      <td className="px-6 py-4 text-gray-600">{coupon.usedCount}{coupon.usageLimit ? `/${coupon.usageLimit}` : ""}</td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{new Date(coupon.expiresAt).toLocaleDateString("ar-MA")}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${coupon.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                          {coupon.isActive ? "نشط" : "غير نشط"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={() => handleDelete(coupon.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"><Trash2 size={16} /></motion.button>
                      </td>
                    </motion.tr>
                  ))}
                  {coupons.length === 0 && <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-400">لا توجد كوبونات</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
