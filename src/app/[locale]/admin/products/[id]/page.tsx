"use client";

import { useLocale } from "next-intl";
import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowLeft, Save, Loader2, Plus, X, Image as ImageIcon } from "lucide-react";
import { AdminLoading } from "@/components/admin";
import { useToast } from "@/components/motion/Toast";
import { motion } from "framer-motion";

export default function ProductEditPage() {
  const locale = useLocale();
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [form, setForm] = useState({
    name: "", nameAr: "", nameFr: "", sku: "", slug: "", description: "", descriptionFr: "",
    karat: "K18", weight: 5, profitMargin: 200, stock: 10, categoryId: "",
    isFeatured: false, isNew: true, certification: "", videoUrl: "",
    images: [] as { url: string; alt: string }[],
  });

  useEffect(() => {
    Promise.all([
      fetch(`/api/admin/products?search=&limit=100`).then(r => r.json()),
      fetch("/api/categories").then(r => r.json()),
    ]).then(([productsData, catData]) => {
      const product = productsData.products?.find((p: any) => p.id === id);
      if (product) {
        setForm({
          name: product.name || "", nameAr: product.nameAr || "", nameFr: product.nameFr || "",
          sku: product.sku || "", slug: product.slug || "", description: product.description || "", descriptionFr: product.descriptionFr || "",
          karat: product.karat || "K18", weight: product.weight || 5, profitMargin: product.profitMargin || 200,
          stock: product.stock || 10, categoryId: product.categoryId || "",
          isFeatured: product.isFeatured || false, isNew: product.isNew || false,
          certification: product.certification || "", videoUrl: product.videoUrl || "",
          images: product.images || [],
        });
      } else { addToast(locale === "ar" ? "المنتج غير موجود" : "Product not found"); router.push(L("/admin/products")); }
      setCategories(catData.categories || catData || []);
    }).catch(() => setLoading(false)).finally(() => setLoading(false));
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...form }),
      });
      if (!res.ok) throw new Error();
      addToast(locale === "ar" ? "تم الحفظ بنجاح" : "Saved successfully");
      router.push(L("/admin/products"));
    } catch { addToast(locale === "ar" ? "خطأ في الحفظ" : "Error saving"); }
    setSaving(false);
  };

  const addImage = () => setForm((f) => ({ ...f, images: [...f.images, { url: "", alt: "" }] }));
  const removeImage = (i: number) => setForm((f) => ({ ...f, images: f.images.filter((_, idx) => idx !== i) }));
  const updateImage = (i: number, field: "url" | "alt", value: string) => setForm((f) => ({ ...f, images: f.images.map((img, idx) => idx === i ? { ...img, [field]: value } : img) }));

  if (loading) return <AdminLoading />;

  const pricePreview = (() => {
    const goldPrice = 1100;
    return (goldPrice + form.profitMargin) * form.weight;
  })();

  return (
    <div className="max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push(L("/admin/products"))} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={18} className="text-gray-500" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-secondary">{locale === "ar" ? "تعديل المنتج" : "Edit Product"}</h1>
            <p className="text-sm text-gray-500">{form.sku}</p>
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSave} disabled={saving}
          className="flex items-center gap-2 bg-gold text-secondary px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-gold-dark transition-colors disabled:opacity-50 shadow-sm">
          {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          {locale === "ar" ? "حفظ" : "Save"}
        </motion.button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main form */}
        <div className="lg:col-span-2 space-y-5">
          {/* Names */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 space-y-4">
            <h3 className="font-semibold text-secondary">{locale === "ar" ? "المعلومات الأساسية" : "Basic Info"}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{locale === "ar" ? "الاسم (عربي)" : "Name (Arabic)"}</label>
              <input value={form.nameAr} onChange={(e) => setForm({ ...form, nameAr: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{locale === "ar" ? "الاسم (FR/EN)" : "Name (FR/EN)"}</label>
              <input value={form.nameFr} onChange={(e) => setForm({ ...form, nameFr: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-sm" dir="ltr" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">{locale === "ar" ? "الشهادة" : "Certification"}</label>
                <input value={form.certification} onChange={(e) => setForm({ ...form, certification: e.target.value })}
                  placeholder="GIA, HRD..."
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-sm" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{locale === "ar" ? "الوصف (عربي)" : "Description (Arabic)"}</label>
              <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-sm resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{locale === "ar" ? "الوصف (FR/EN)" : "Description (FR/EN)"}</label>
              <textarea rows={3} value={form.descriptionFr} onChange={(e) => setForm({ ...form, descriptionFr: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-sm resize-none" />
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-secondary">{locale === "ar" ? "الصور" : "Images"} ({form.images.length})</h3>
              <button onClick={addImage} className="flex items-center gap-1.5 text-sm text-gold hover:text-gold-dark transition-colors">
                <Plus size={14} /> {locale === "ar" ? "إضافة صورة" : "Add Image"}
              </button>
            </div>
            <div className="space-y-3">
              {form.images.map((img, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    {img.url ? <img src={img.url} alt="" className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-gray-300 m-auto mt-5" />}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input value={img.url} onChange={(e) => updateImage(i, "url", e.target.value)}
                      placeholder="Image URL"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold" dir="ltr" />
                    <input value={img.alt} onChange={(e) => updateImage(i, "alt", e.target.value)}
                      placeholder={locale === "ar" ? "نص بديل" : "Alt text"}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold" />
                  </div>
                  <button onClick={() => removeImage(i)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
                    <X size={14} className="text-red-400" />
                  </button>
                </div>
              ))}
              {form.images.length === 0 && (
                <button onClick={addImage} className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 text-gray-400 hover:border-gold/40 hover:text-gold transition-colors text-sm">
                  + {locale === "ar" ? "إضافة صورة" : "Add Image"}
                </button>
              )}
            </div>
          </div>

          {/* Video */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 space-y-4">
            <h3 className="font-semibold text-secondary">{locale === "ar" ? "الفيديو" : "Video"}</h3>
            <input value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
              placeholder="YouTube URL"
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-sm" dir="ltr" />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Pricing */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 space-y-4">
            <h3 className="font-semibold text-secondary">{locale === "ar" ? "التسعير" : "Pricing"}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{locale === "ar" ? "العيار" : "Karat"}</label>
              <select value={form.karat} onChange={(e) => setForm({ ...form, karat: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold">
                <option value="K18">K18</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{locale === "ar" ? "الوزن (غ)" : "Weight (g)"}</label>
              <input type="number" value={form.weight} onChange={(e) => setForm({ ...form, weight: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{locale === "ar" ? "هامش الربح (د.م)" : "Profit Margin (MAD)"}</label>
              <input type="number" value={form.profitMargin} onChange={(e) => setForm({ ...form, profitMargin: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold" />
            </div>
            <div className="p-3 bg-gold/5 rounded-xl">
              <p className="text-xs text-gray-500 mb-1">{locale === "ar" ? "السعر المحسوب" : "Calculated Price"}</p>
              <p className="text-lg font-bold text-gold">{pricePreview.toLocaleString()} د.م</p>
              <p className="text-[11px] text-gray-400 mt-1">(1100 + {form.profitMargin}) × {form.weight}g</p>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 space-y-4">
            <h3 className="font-semibold text-secondary">{locale === "ar" ? "المخزون" : "Inventory"}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{locale === "ar" ? "الكمية" : "Stock"}</label>
              <input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold" />
            </div>
          </div>

          {/* Category & Options */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50 space-y-4">
            <h3 className="font-semibold text-secondary">{locale === "ar" ? "التصنيف والخيارات" : "Category & Options"}</h3>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">{locale === "ar" ? "التصنيف" : "Category"}</label>
              <select value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold">
                <option value="">{locale === "ar" ? "بدون تصنيف" : "No category"}</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                className="w-4 h-4 accent-gold rounded" />
              <span className="text-sm text-gray-600">{locale === "ar" ? "منتج مميز" : "Featured"}</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.isNew} onChange={(e) => setForm({ ...form, isNew: e.target.checked })}
                className="w-4 h-4 accent-gold rounded" />
              <span className="text-sm text-gray-600">{locale === "ar" ? "جديد" : "New"}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
