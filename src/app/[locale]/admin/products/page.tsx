"use client";

import { useLocale } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff, Package, AlertTriangle, Star } from "lucide-react";
import { AdminTable, AdminSearch, AdminPagination, AdminBadge, AdminFilterTabs, AdminConfirmDialog, AdminLoading } from "@/components/admin";
import { useToast } from "@/components/motion/Toast";
import { motion } from "framer-motion";

interface Product {
  id: string; name: string; slug: string; sku: string; karat: string; weight: number;
  calculatedPrice: number; stock: number; isActive: boolean; isFeatured: boolean;
  images: { url: string }[]; category: { name: string } | null;
  _count: { orderItems: number } };
interface Pagination { page: number; limit: number; total: number; totalPages: number }

export default function AdminProductsPage() {
  const locale = useLocale();
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;
  const { addToast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 15, total: 0, totalPages: 0 });
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

  const fetchProducts = (page = 1, searchVal = search, filterVal = filter) => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "15" });
    if (searchVal) params.set("search", searchVal);
    if (filterVal === "active") params.set("status", "active");
    if (filterVal === "inactive") params.set("status", "inactive");
    if (filterVal === "lowStock") params.set("status", "lowStock");
    fetch(`/api/admin/products?${params}`)
      .then((r) => r.json())
      .then((d) => { setProducts(d.products || []); setPagination(d.pagination || { page: 1, limit: 15, total: 0, totalPages: 0 }); })
      .catch(() => addToast(locale === "ar" ? "خطأ في التحميل" : "Error loading"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); fetch("/api/categories").then(r => r.json()).then(d => setCategories(d.categories || d || [])).catch(() => {}); }, []);

  const handleSearch = (val: string) => { setSearch(val); fetchProducts(1, val, filter); };
  const handleFilter = (val: string) => { setFilter(val); fetchProducts(1, search, val); };

  const handleToggleActive = async (id: string, current: boolean) => {
    try {
      const res = await fetch("/api/admin/products", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, isActive: !current }) });
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.map((p) => p.id === id ? { ...p, isActive: !current } : p));
      addToast(locale === "ar" ? "تم التحديث" : "Updated");
    } catch { addToast(locale === "ar" ? "خطأ" : "Error"); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const res = await fetch(`/api/admin/products?id=${deleteId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
      addToast(locale === "ar" ? "تم الحذف" : "Deleted");
    } catch { addToast(locale === "ar" ? "خطأ في الحذف" : "Error deleting"); }
    setDeleteId(null);
  };

  const columns = [
    {
      key: "product", label: locale === "ar" ? "المنتج" : "Product", className: "min-w-[250px]",
      render: (p: Product) => (
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
            {p.images?.[0]?.url ? <img src={p.images[0].url} alt="" className="w-full h-full object-cover" /> : <Package size={18} className="text-gray-300 m-auto mt-3" />}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-secondary truncate">{p.name}</p>
            <p className="text-xs text-gray-400">{p.sku} · {p.category?.name || "—"}</p>
          </div>
        </div>
      ),
    },
    { key: "karat", label: locale === "ar" ? "العيار" : "Karat", render: (p: Product) => <span className="font-medium">{p.karat}</span> },
    { key: "weight", label: locale === "ar" ? "الوزن" : "Weight", render: (p: Product) => `${p.weight}g` },
    { key: "price", label: locale === "ar" ? "السعر" : "Price", render: (p: Product) => <span className="font-medium">{p.calculatedPrice?.toLocaleString()} د.م</span> },
    { key: "stock", label: locale === "ar" ? "المخزون" : "Stock", render: (p: Product) => (
      <span className={`font-medium ${p.stock <= 5 ? "text-red-500" : ""}`}>
        {p.stock} {p.stock <= 5 && <AlertTriangle size={12} className="inline" />}
      </span>
    )},
    { key: "status", label: locale === "ar" ? "الحالة" : "Status", render: (p: Product) => (
      <div className="flex items-center gap-2">
        <AdminBadge status={p.isActive ? "ACTIVE" : "INACTIVE"} label={p.isActive ? (locale === "ar" ? "نشط" : "Active") : (locale === "ar" ? "معطل" : "Inactive")} />
        {p.isFeatured && <Star size={12} className="text-gold fill-gold" />}
      </div>
    )},
    { key: "actions", label: locale === "ar" ? "إجراءات" : "Actions", className: "text-end",
      render: (p: Product) => (
        <div className="flex items-center justify-end gap-1">
          <button onClick={(e) => { e.stopPropagation(); handleToggleActive(p.id, p.isActive); }}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title={p.isActive ? "Deactivate" : "Activate"}>
            {p.isActive ? <Eye size={15} className="text-green-500" /> : <EyeOff size={15} className="text-gray-400" />}
          </button>
          <Link href={L(`/admin/products/${p.id}`)} onClick={(e) => e.stopPropagation()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Edit">
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
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-secondary">{locale === "ar" ? "المنتجات" : "Products"}</h1>
          <p className="text-sm text-gray-500">{pagination.total} {locale === "ar" ? "منتج" : "products"}</p>
        </div>
        <Link href={L("/admin/products/new")}
          className="flex items-center gap-2 bg-gold text-secondary px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-gold-dark transition-colors shadow-sm">
          <Plus size={16} /> {locale === "ar" ? "إضافة منتج" : "Add Product"}
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <AdminSearch value={search} onChange={handleSearch} placeholder={locale === "ar" ? "بحث بالاسم أو SKU..." : "Search by name or SKU..."} className="w-full sm:w-72" />
        <AdminFilterTabs
          tabs={[
            { key: "all", label: locale === "ar" ? "الكل" : "All" },
            { key: "active", label: locale === "ar" ? "نشط" : "Active" },
            { key: "inactive", label: locale === "ar" ? "معطل" : "Inactive" },
            { key: "lowStock", label: locale === "ar" ? "مخزون منخفض" : "Low Stock" },
          ]}
          active={filter} onChange={handleFilter}
        />
      </div>

      {loading ? <AdminLoading /> : (
        <>
          <AdminTable columns={columns} data={products} keyExtractor={(p) => p.id}
            emptyMessage={locale === "ar" ? "لا توجد منتجات" : "No products found"} />
          <AdminPagination page={pagination.page} totalPages={pagination.totalPages}
            onPageChange={(p) => fetchProducts(p)} totalItems={pagination.total} pageSize={pagination.limit} />
        </>
      )}

      <AdminConfirmDialog open={!!deleteId} title={locale === "ar" ? "حذف المنتج" : "Delete Product"}
        message={locale === "ar" ? "هل أنت متأكد من حذف هذا المنتج؟ لا يمكن التراجع." : "Are you sure? This cannot be undone."}
        danger confirmLabel={locale === "ar" ? "حذف" : "Delete"} cancelLabel={locale === "ar" ? "إلغاء" : "Cancel"}
        onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
