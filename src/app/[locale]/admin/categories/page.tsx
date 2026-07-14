"use client";

import { useLocale } from "next-intl";
import { useEffect, useState } from "react";
import {
  Plus, Edit2, Trash2, Tag, Package, GripVertical, Eye, EyeOff,
} from "lucide-react";
import { AdminTable, AdminSearch, AdminBadge, AdminConfirmDialog, AdminLoading, AdminModal } from "@/components/admin";
import { useToast } from "@/components/motion/Toast";
import { motion } from "framer-motion";

interface Category {
  id: string; name: string; nameAr?: string; nameFr?: string;
  slug: string; description?: string; image?: string;
  order: number; isActive: boolean;
  _count: { products: number };
}

export default function AdminCategoriesPage() {
  const locale = useLocale();
  const t = (ar: string, fr: string) => locale === "ar" ? ar : fr;
  const { addToast } = useToast();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: "", nameAr: "", nameFr: "", description: "", image: "", order: 0, isActive: true });
  const [saving, setSaving] = useState(false);

  const fetchCategories = () => {
    setLoading(true);
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories || []))
      .catch(() => addToast(t("خطأ في التحميل", "Error loading")))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchCategories(); }, []);

  const openCreate = () => {
    setEditingCategory(null);
    setFormData({ name: "", nameAr: "", nameFr: "", description: "", image: "", order: categories.length, isActive: true });
    setModalOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditingCategory(cat);
    setFormData({ name: cat.name, nameAr: cat.nameAr || "", nameFr: cat.nameFr || "", description: cat.description || "", image: cat.image || "", order: cat.order, isActive: cat.isActive });
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) { addToast(t("الاسم مطلوب", "Name required")); return; }
    setSaving(true);
    try {
      const url = "/api/admin/categories";
      const method = editingCategory ? "PUT" : "POST";
      const body = editingCategory ? { id: editingCategory.id, ...formData } : formData;
      const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Failed");
      }
      addToast(editingCategory ? t("تم التحديث", "Updated") : t("تم الإنشاء", "Created"));
      setModalOpen(false);
      fetchCategories();
    } catch (e) {
      addToast((e as Error).message || t("خطأ", "Error"));
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/categories?id=${deleteId}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json();
        addToast(d.error || t("خطأ", "Error"));
        setDeleteId(null);
        return;
      }
      setCategories((prev) => prev.filter((c) => c.id !== deleteId));
      addToast(t("تم الحذف", "Deleted"));
    } catch { addToast(t("خطأ في الحذف", "Error deleting")); }
    setDeleteId(null);
  };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      const res = await fetch("/api/admin/categories", {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isActive: !current }),
      });
      if (!res.ok) throw new Error();
      setCategories((prev) => prev.map((c) => c.id === id ? { ...c, isActive: !current } : c));
      addToast(t("تم التحديث", "Updated"));
    } catch { addToast(t("خطأ", "Error")); }
  };

  const filtered = search
    ? categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.nameAr?.includes(search) || c.nameFr?.toLowerCase().includes(search.toLowerCase()))
    : categories;

  const stats = {
    total: categories.length,
    active: categories.filter((c) => c.isActive).length,
    totalProducts: categories.reduce((s, c) => s + c._count.products, 0),
  };

  const columns = [
    {
      key: "order", label: "#", className: "w-12",
      render: (c: Category) => <span className="text-sm text-gray-400">{c.order}</span>,
    },
    {
      key: "name", label: t("التصنيف", "Category"), className: "min-w-[200px]",
      render: (c: Category) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gold/10 rounded-xl flex items-center justify-center flex-shrink-0">
            <Tag size={16} className="text-gold" />
          </div>
          <div>
            <p className="font-medium text-secondary">{c.name}</p>
            {(c.nameAr || c.nameFr) && (
              <p className="text-xs text-gray-400">{c.nameAr || ""} {c.nameAr && c.nameFr ? "·" : ""} {c.nameFr || ""}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "slug", label: t("الرابط", "Slug"),
      render: (c: Category) => <code className="text-xs bg-gray-100 px-2 py-1 rounded-lg text-gray-500">/{c.slug}</code>,
    },
    {
      key: "products", label: t("المنتجات", "Products"),
      render: (c: Category) => (
        <div className="flex items-center gap-1.5 text-sm text-gray-600">
          <Package size={14} className="text-gray-400" />
          {c._count.products}
        </div>
      ),
    },
    {
      key: "status", label: t("الحالة", "Status"),
      render: (c: Category) => <AdminBadge status={c.isActive ? "ACTIVE" : "INACTIVE"} label={c.isActive ? t("نشط", "Active") : t("معطل", "Inactive")} />,
    },
    {
      key: "actions", label: "", className: "text-end",
      render: (c: Category) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={() => handleToggleActive(c.id, c.isActive)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title={c.isActive ? "Deactivate" : "Activate"}>
            {c.isActive ? <Eye size={15} className="text-green-500" /> : <EyeOff size={15} className="text-gray-400" />}
          </button>
          <button onClick={() => openEdit(c)}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
            <Edit2 size={15} className="text-blue-500" />
          </button>
          <button onClick={() => setDeleteId(c.id)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
            <Trash2 size={15} className="text-red-400" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-secondary">{t("التصنيفات", "Categories")}</h1>
          <p className="text-sm text-gray-500">{stats.total} {t("تصنيف", "categories")}</p>
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 bg-gold text-secondary px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-gold-dark transition-colors shadow-sm">
          <Plus size={16} /> {t("إضافة تصنيف", "Add Category")}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: t("الكل", "Total"), value: stats.total, color: "bg-gray-50 text-gray-700" },
          { label: t("نشط", "Active"), value: stats.active, color: "bg-green-50 text-green-700" },
          { label: t("المنتجات", "Products"), value: stats.totalProducts, color: "bg-gold/10 text-gold" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-500">{s.label}</span>
            <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Search */}
      <AdminSearch value={search} onChange={setSearch} placeholder={t("بحث بالاسم...", "Search by name...")} className="w-full sm:w-72" />

      {/* Table */}
      {loading ? <AdminLoading /> : (
        <AdminTable columns={columns} data={filtered} keyExtractor={(c) => c.id}
          emptyMessage={t("لا توجد تصنيفات", "No categories found")} />
      )}

      {/* Create/Edit Modal */}
      <AdminModal open={modalOpen} title={editingCategory ? t("تعديل التصنيف", "Edit Category") : t("إضافة تصنيف", "New Category")}
        onClose={() => setModalOpen(false)} size="md">
        <div className="space-y-4 p-1">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("الاسم", "Name")} *</label>
            <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
              placeholder={t("اسم التصنيف", "Category name")} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("الاسم بالعربية", "Arabic Name")}</label>
              <input type="text" value={formData.nameAr} onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                placeholder="خواتم" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("الاسم بالفرنسية", "French Name")}</label>
              <input type="text" value={formData.nameFr} onChange={(e) => setFormData({ ...formData, nameFr: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                placeholder="Bagues" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("الوصف", "Description")}</label>
            <textarea rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("رابط الصورة", "Image URL")}</label>
              <input type="url" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                placeholder="https://..." />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">{t("الترتيب", "Order")}</label>
              <input type="number" value={formData.order} onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="w-4 h-4 accent-gold rounded" />
              <span className="text-sm font-medium text-gray-700">{t("نشط", "Active")}</span>
            </label>
          </div>
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving}
              className="flex-1 bg-gold text-secondary py-3 rounded-xl font-semibold hover:bg-gold-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              {saving ? <span className="w-4 h-4 border-2 border-secondary/30 border-t-secondary rounded-full animate-spin" /> : null}
              {editingCategory ? t("حفظ التغييرات", "Save Changes") : t("إنشاء التصنيف", "Create Category")}
            </button>
            <button onClick={() => setModalOpen(false)}
              className="px-6 py-3 rounded-xl font-medium border border-gray-200 hover:bg-gray-50 transition-colors">
              {t("إلغاء", "Cancel")}
            </button>
          </div>
        </div>
      </AdminModal>

      <AdminConfirmDialog open={!!deleteId} title={t("حذف التصنيف", "Delete Category")}
        message={t("هل أنت متأكد؟ لا يمكن التراجع.", "Are you sure? This cannot be undone.")}
        danger confirmLabel={t("حذف", "Delete")} cancelLabel={t("إلغاء", "Cancel")}
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
