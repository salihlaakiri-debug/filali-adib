"use client";

import { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/components/motion/Toast";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function NewProductPage() {
  const t = useTranslations("admin.products");
  const locale = useLocale();
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;
  const router = useRouter();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    name: "", nameAr: "", nameFr: "", slug: "", description: "", descriptionFr: "",
    karat: "K21", weight: 5, stock: 10, categoryId: "", sku: "",
    isFeatured: false, isNew: true, certification: "", imageUrl: "",
    profitMargin: 200,
  });

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]));
  }, []);

  const generateSlug = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          slug: form.slug || generateSlug(form.name),
          images: form.imageUrl ? [{ url: form.imageUrl, alt: form.name }] : [],
        }),
      });
      const data = await res.json();
      if (!res.ok) { addToast(data.error || "حدث خطأ"); return; }
      addToast("تم إضافة المنتج بنجاح");
      router.push(L("/admin/products"));
    } catch { addToast("حدث خطأ في الاتصال"); } finally { setLoading(false); }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-4 mb-8">
        <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ArrowRight size={20} />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">إضافة منتج جديد</h1>
      </motion.div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
        {[
          { title: "المعلومات الأساسية", fields: [
            { label: "اسم المنتج (عربي)", key: "name", required: true },
            { label: "اسم المنتج (إنجليزي)", key: "nameFr" },
            { label: "الرابط المختصر (Slug)", key: "slug", placeholder: "auto-generated" },
            { label: "رقم المنتج (SKU)", key: "sku", required: true },
          ]},
        ].map((section, si) => (
          <motion.div key={si} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.1 }}
            className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">{section.title}</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {section.fields.map((field) => (
                <div key={field.key} className={field.key === "slug" ? "md:col-span-2" : ""}>
                  <label className="block text-sm text-gray-600 mb-1">{field.label} {field.required && "*"}</label>
                  <input type="text" required={field.required} value={(form as any)[field.key]} placeholder={(field as any).placeholder}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all" />
                </div>
              ))}
            </div>
          </motion.div>
        ))}

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">التصنيف والمواصفات</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">الفئة *</label>
              <select required value={form.categoryId}
                onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold">
                <option value="">اختر الفئة</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">العيار</label>
              <select value={form.karat} onChange={(e) => setForm({ ...form, karat: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold">
                <option value="K18">عيار 18</option>
                <option value="K21">عيار 21</option>
                <option value="K24">عيار 24</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">الوزن (غ) *</label>
              <input type="number" step="0.1" required value={form.weight}
                onChange={(e) => setForm({ ...form, weight: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">هامش الربح (د.م/غ)</label>
              <input type="number" value={form.profitMargin}
                onChange={(e) => setForm({ ...form, profitMargin: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">المخزون *</label>
              <input type="number" required value={form.stock}
                onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">الشهادة</label>
              <input type="text" value={form.certification} placeholder="مثال: GIA, HRD"
                onChange={(e) => setForm({ ...form, certification: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold" />
            </div>
          </div>
          <div className="flex items-center gap-6 mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })} className="accent-gold" />
              <span className="text-sm text-gray-600">منتج مميز</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })} className="accent-gold" />
              <span className="text-sm text-gray-600">جديد</span>
            </label>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">الصورة والوصف</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">رابط الصورة (URL)</label>
              <input type="url" value={form.imageUrl} placeholder="https://images.unsplash.com/..."
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold" />
              {form.imageUrl && (
                <div className="mt-2 w-32 h-32 rounded-lg overflow-hidden border">
                  <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">الوصف (عربي)</label>
              <textarea rows={3} value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold resize-none" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">الوصف (إنجليزي)</label>
              <textarea rows={3} value={form.descriptionFr}
                onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-gold resize-none" />
            </div>
          </div>
        </motion.div>

        <div className="flex gap-4">
          <button type="button" onClick={() => router.back()} className="px-6 py-3 border border-gray-200 rounded-lg font-medium hover:bg-gray-50 transition-colors">
            إلغاء
          </button>
          <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="bg-gold text-secondary px-8 py-3 rounded-lg font-semibold hover:bg-gold-dark transition-all flex items-center gap-2 disabled:opacity-50">
            {loading ? <><Loader2 size={18} className="animate-spin" /> جاري الإنشاء...</> : "إضافة المنتج"}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
