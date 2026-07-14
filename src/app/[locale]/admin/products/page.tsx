"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import {
  Plus, Edit2, Trash2, Eye, EyeOff, Package, AlertTriangle, Star,
  LayoutGrid, List, Filter, Download, ChevronDown,
} from "lucide-react";
import { AdminTable, AdminSearch, AdminPagination, AdminBadge, AdminFilterTabs, AdminConfirmDialog, AdminLoading } from "@/components/admin";
import { useToast } from "@/components/motion/Toast";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: string; name: string; nameAr?: string; nameFr?: string; slug: string; sku: string;
  karat: string; weight: number; calculatedPrice: number; profitMargin: number;
  stock: number; isActive: boolean; isFeatured: boolean; isNew?: boolean;
  images: { url: string; alt?: string }[]; category: { name: string } | null;
  description?: string; descriptionFr?: string; videoUrl?: string;
  certification?: string; createdAt?: string;
  _count: { orderItems: number } };
interface Pagination { page: number; limit: number; total: number; totalPages: number }

export default function AdminProductsPage() {
  const locale = useLocale();
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;
  const t = (ar: string, fr: string) => locale === "ar" ? ar : fr;
  const { addToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 15, total: 0, totalPages: 0 });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [selectedProducts, setSelectedProducts] = useState<Set<string>>(new Set());
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [previewProduct, setPreviewProduct] = useState<Product | null>(null);

  const fetchProducts = useCallback((page = 1, searchVal = search, filterVal = filter) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "50" });
    if (searchVal) params.set("search", searchVal);
    if (filterVal === "active") params.set("status", "active");
    if (filterVal === "inactive") params.set("status", "inactive");
    if (filterVal === "lowStock") params.set("status", "lowStock");
    fetch(`/api/admin/products?${params}`)
      .then((r) => r.json())
      .then((d) => { setProducts(d.products || []); setPagination(d.pagination || { page: 1, limit: 15, total: 0, totalPages: 0 }); })
      .catch(() => addToast(t("خطأ في التحميل", "Error loading")))
      .finally(() => setLoading(false));
  }, [search, filter, addToast, t]);

  useEffect(() => { fetchProducts(); fetch("/api/categories").then(r => r.json()).then(d => setCategories(d.categories || d || [])).catch(() => {}); }, []);

  const handleSearch = (val: string) => { setSearch(val); fetchProducts(1, val, filter); };
  const handleFilter = (val: string) => { setFilter(val); fetchProducts(1, search, val); };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      const res = await fetch("/api/admin/products", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, isActive: !current }) });
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.map((p) => p.id === id ? { ...p, isActive: !current } : p));
      addToast(t("تم التحديث", "Updated"));
    } catch { addToast(t("خطأ", "Error")); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/products?id=${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
      addToast(t("تم الحذف", "Deleted"));
    } catch { addToast(t("خطأ في الحذف", "Error deleting")); }
    setDeleteId(null);
  };

  const toggleSelect = (id: string) => {
    setSelectedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedProducts.size === products.length) setSelectedProducts(new Set());
    else setSelectedProducts(new Set(products.map((p) => p.id)));
  };

  const exportCSV = () => {
    const rows = [["Name", "SKU", "Karat", "Weight", "Price", "Stock", "Status", "Category"]];
    products.forEach((p) => rows.push([p.name, p.sku, p.karat, String(p.weight), String(p.calculatedPrice), String(p.stock), p.isActive ? "Active" : "Inactive", p.category?.name || ""]));
    const csv = rows.map((r) => r.map((c) => `"${c.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "products.csv"; a.click();
    URL.revokeObjectURL(url);
  };

  const filteredProducts = categoryFilter !== "all"
    ? products.filter((p) => p.category?.name === categoryFilter)
    : products;

  const stats = {
    total: products.length,
    active: products.filter((p) => p.isActive).length,
    lowStock: products.filter((p) => p.stock <= 5).length,
    featured: products.filter((p) => p.isFeatured).length,
  };

  const columns = [
    {
      key: "select", label: "", className: "w-10",
      render: (p: Product) => (
        <input type="checkbox" checked={selectedProducts.has(p.id)} onChange={() => toggleSelect(p.id)}
          className="w-4 h-4 accent-gold rounded cursor-pointer" onClick={(e) => e.stopPropagation()} />
      ),
    },
    {
      key: "product", label: t("المنتج", "Product"), className: "min-w-[280px]",
      render: (p: Product) => (
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100 cursor-pointer hover:ring-2 hover:ring-gold/30 transition-all"
            onClick={(e) => { e.stopPropagation(); setPreviewProduct(p); }}>
            {p.images?.[0]?.url ? <img src={p.images[0].url} alt="" className="w-full h-full object-cover" /> : <Package size={18} className="text-gray-300 m-auto mt-5" />}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="font-medium text-secondary truncate max-w-[180px]">{p.name}</p>
              {p.isFeatured && <Star size={12} className="text-gold fill-gold flex-shrink-0" />}
              {p.isNew && <span className="text-[9px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full font-medium flex-shrink-0">NEW</span>}
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{p.sku} · {p.category?.name || "—"}</p>
          </div>
        </div>
      ),
    },
    { key: "karat", label: t("العيار", "Karat"), render: (p: Product) => <span className="text-xs font-medium bg-gold/10 text-gold px-2 py-1 rounded-lg">{p.karat}</span> },
    { key: "weight", label: t("الوزن", "Weight"), render: (p: Product) => <span className="text-sm text-gray-600">{p.weight}g</span> },
    { key: "price", label: t("السعر", "Price"), render: (p: Product) => <span className="font-semibold text-secondary">{p.calculatedPrice?.toLocaleString()} <span className="text-xs font-normal text-gray-400">د.م</span></span> },
    { key: "stock", label: t("المخزون", "Stock"), render: (p: Product) => (
      <span className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full ${
        p.stock === 0 ? "bg-red-50 text-red-600" : p.stock <= 5 ? "bg-yellow-50 text-yellow-700" : "bg-green-50 text-green-700"
      }`}>
        {p.stock === 0 && <AlertTriangle size={11} />}
        {p.stock}
      </span>
    )},
    { key: "orders", label: t("المبيعات", "Sales"), render: (p: Product) => <span className="text-sm text-gray-500">{p._count.orderItems}</span> },
    { key: "status", label: t("الحالة", "Status"), render: (p: Product) => (
      <div className="flex items-center gap-2">
        <AdminBadge status={p.isActive ? "ACTIVE" : "INACTIVE"} label={p.isActive ? t("نشط", "Active") : t("معطل", "Inactive")} />
      </div>
    )},
    { key: "actions", label: "", className: "text-end",
      render: (p: Product) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={(e) => { e.stopPropagation(); handleToggleActive(p.id, p.isActive); }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title={p.isActive ? "Deactivate" : "Activate"}>
            {p.isActive ? <Eye size={15} className="text-green-500" /> : <EyeOff size={15} className="text-gray-400" />}
          </button>
          <Link href={L(`/admin/products/${p.id}`)} onClick={(e) => e.stopPropagation()}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
            <Edit2 size={15} className="text-blue-500" />
          </Link>
          <button onClick={(e) => { e.stopPropagation(); setDeleteId(p.id); }}
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
          <h1 className="text-xl font-bold text-secondary">{t("المنتجات", "Products")}</h1>
          <p className="text-sm text-gray-500">{pagination.total} {t("منتج", "products")}</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV}
            className="flex items-center gap-2 bg-white text-secondary px-4 py-2.5 rounded-xl text-sm border border-gray-200 hover:bg-gray-50 transition-colors">
            <Download size={14} /> CSV
          </button>
          <Link href={L("/admin/products/new")}
            className="flex items-center gap-2 bg-gold text-secondary px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-gold-dark transition-colors shadow-sm">
            <Plus size={16} /> {t("إضافة منتج", "Add Product")}
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: t("الكل", "Total"), value: stats.total, color: "bg-gray-50 text-gray-700" },
          { label: t("نشط", "Active"), value: stats.active, color: "bg-green-50 text-green-700" },
          { label: t("مخزون منخفض", "Low Stock"), value: stats.lowStock, color: "bg-yellow-50 text-yellow-700" },
          { label: t("مميز", "Featured"), value: stats.featured, color: "bg-gold/10 text-gold" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-50 flex items-center justify-between">
            <span className="text-sm text-gray-500">{s.label}</span>
            <span className={`text-sm font-bold px-2.5 py-0.5 rounded-full ${s.color}`}>{s.value}</span>
          </div>
        ))}
      </div>

      {/* Filters + view toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <AdminSearch value={search} onChange={handleSearch} placeholder={t("بحث بالاسم أو SKU...", "Search by name or SKU...")} className="w-full sm:w-72" />
        {categories.length > 0 && (
          <div className="relative">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}
              className="appearance-none pe-8 ps-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-gold">
              <option value="all">{t("كل التصنيفات", "All Categories")}</option>
              {categories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <ChevronDown size={14} className="absolute end-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        )}
        <AdminFilterTabs
          tabs={[
            { key: "all", label: t("الكل", "All") },
            { key: "active", label: t("نشط", "Active") },
            { key: "inactive", label: t("معطل", "Inactive") },
            { key: "lowStock", label: t("مخزون منخفض", "Low Stock") },
          ]}
          active={filter} onChange={handleFilter}
        />
        <div className="flex items-center gap-1 ms-auto">
          <button onClick={() => setViewMode("table")} className={`p-2 rounded-lg transition-colors ${viewMode === "table" ? "bg-gold/10 text-gold" : "text-gray-400 hover:bg-gray-100"}`}>
            <List size={16} />
          </button>
          <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-gold/10 text-gold" : "text-gray-400 hover:bg-gray-100"}`}>
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>

      {/* Bulk actions bar */}
      <AnimatePresence>
        {selectedProducts.size > 0 && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-gold/5 border border-gold/20 rounded-xl px-5 py-3 flex items-center justify-between">
            <span className="text-sm font-medium text-secondary">{selectedProducts.size} {t("محدد", "selected")}</span>
            <div className="flex gap-2">
              <button onClick={() => setSelectedProducts(new Set())} className="text-sm text-gray-500 hover:text-gray-700">{t("إلغاء التحديد", "Deselect")}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? <AdminLoading /> : (
        <>
          {viewMode === "table" ? (
            <AdminTable columns={columns} data={filteredProducts} keyExtractor={(p) => p.id}
              emptyMessage={t("لا توجد منتجات", "No products found")} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredProducts.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50 hover:shadow-md transition-all group">
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    {p.images?.[0]?.url ? <img src={p.images[0].url} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" /> : <Package size={28} className="text-gray-300 m-auto mt-16" />}
                    <div className="absolute top-2 start-2 flex gap-1">
                      {p.isFeatured && <span className="bg-gold text-secondary text-[9px] font-bold px-2 py-0.5 rounded-full">★</span>}
                      {p.isNew && <span className="bg-green-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full">NEW</span>}
                    </div>
                    <div className="absolute top-2 end-2">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${p.stock === 0 ? "bg-red-500 text-white" : p.stock <= 5 ? "bg-yellow-400 text-secondary" : "bg-white/90 text-gray-600"}`}>
                        {p.stock} {t("قطعة", "pcs")}
                      </span>
                    </div>
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex items-center justify-center gap-2">
                        <button onClick={() => setPreviewProduct(p)} className="bg-white/90 p-1.5 rounded-lg hover:bg-white transition-colors"><Eye size={14} className="text-gray-700" /></button>
                        <Link href={L(`/admin/products/${p.id}`)} className="bg-white/90 p-1.5 rounded-lg hover:bg-white transition-colors"><Edit2 size={14} className="text-gray-700" /></Link>
                        <button onClick={() => handleToggleActive(p.id, p.isActive)} className="bg-white/90 p-1.5 rounded-lg hover:bg-white transition-colors">
                          {p.isActive ? <Eye size={14} className="text-green-600" /> : <EyeOff size={14} className="text-red-500" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-medium text-secondary truncate">{p.name}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-xs text-gray-400">{p.karat} · {p.weight}g</span>
                      <span className="text-sm font-bold text-gold">{p.calculatedPrice?.toLocaleString()} د.م</span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[10px] text-gray-400">{p.category?.name || "—"}</span>
                      <span className="text-[10px] text-gray-400">{p._count.orderItems} {t("مبيعة", "sales")}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          <AdminPagination page={pagination.page} totalPages={pagination.totalPages}
            onPageChange={(p) => fetchProducts(p)} totalItems={pagination.total} pageSize={pagination.limit} />
        </>
      )}

      {/* Image preview modal */}
      <AnimatePresence>
        {previewProduct && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4" onClick={() => setPreviewProduct(null)}>
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="relative bg-white rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="relative aspect-square bg-gray-100 rounded-t-2xl overflow-hidden">
                {previewProduct.images?.[0]?.url ? <img src={previewProduct.images[0].url} className="w-full h-full object-cover" /> : <Package size={48} className="text-gray-300 m-auto mt-24" />}
                <button onClick={() => setPreviewProduct(null)} className="absolute top-3 end-3 bg-white/90 p-2 rounded-full hover:bg-white transition-colors">
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none"><path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                </button>
              </div>
              <div className="p-5 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-secondary text-lg">{previewProduct.name}</h3>
                    <p className="text-sm text-gray-400">{previewProduct.sku} · {previewProduct.category?.name}</p>
                  </div>
                  <span className="text-xl font-bold text-gold">{previewProduct.calculatedPrice?.toLocaleString()} د.م</span>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-gray-50 rounded-xl p-2.5">
                    <p className="text-[10px] text-gray-400">{t("العيار", "Karat")}</p>
                    <p className="text-sm font-bold text-secondary">{previewProduct.karat}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2.5">
                    <p className="text-[10px] text-gray-400">{t("الوزن", "Weight")}</p>
                    <p className="text-sm font-bold text-secondary">{previewProduct.weight}g</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-2.5">
                    <p className="text-[10px] text-gray-400">{t("المخزون", "Stock")}</p>
                    <p className={`text-sm font-bold ${previewProduct.stock <= 5 ? "text-red-500" : "text-secondary"}`}>{previewProduct.stock}</p>
                  </div>
                </div>
                {previewProduct.description && <p className="text-sm text-gray-600">{previewProduct.description}</p>}
                <div className="flex gap-2 pt-2">
                  <Link href={L(`/admin/products/${previewProduct.id}`)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gold text-secondary py-2.5 rounded-xl text-sm font-medium hover:bg-gold-dark transition-colors">
                    <Edit2 size={14} /> {t("تعديل", "Edit")}
                  </Link>
                  <button onClick={() => { setPreviewProduct(null); handleToggleActive(previewProduct.id, previewProduct.isActive); }}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-colors">
                    {previewProduct.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AdminConfirmDialog open={!!deleteId} title={t("حذف المنتج", "Delete Product")}
        message={t("هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع.", "Are you sure? This cannot be undone.")}
        danger confirmLabel={t("حذف", "Delete")} cancelLabel={t("إلغاء", "Cancel")}
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
