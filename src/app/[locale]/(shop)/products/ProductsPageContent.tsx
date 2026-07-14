"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { SlidersHorizontal, Grid3X3, List, ChevronDown, X, Package, Circle, Gem, CircleDot, Sparkles, Watch, Crown, Star } from "lucide-react";
import { ProductCard } from "@/components/shared/ProductCard";
import { motion, AnimatePresence } from "framer-motion";

interface Product {
  id: string;
  name: string;
  nameFr?: string;
  slug: string;
  calculatedPrice: number;
  weight: number;
  karat: string;
  isNew: boolean;
  isFeatured: boolean;
  stock: number;
  images: { url: string }[];
  videos?: { url: string; type: string }[];
}

interface ProductsResponse {
  products: Product[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
      <div className="aspect-square bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-100 rounded-full w-3/4" />
        <div className="h-3 bg-gray-100 rounded-full w-1/2" />
        <div className="flex gap-2">
          <div className="h-3 bg-gray-100 rounded-full w-12" />
          <div className="h-3 bg-gray-100 rounded-full w-12" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-5 bg-gray-100 rounded-full w-20" />
          <div className="h-8 bg-gray-100 rounded-full w-8" />
        </div>
      </div>
    </div>
  );
}

function ProductListSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse flex">
      <div className="w-52 h-52 bg-gray-100 flex-shrink-0" />
      <div className="flex-1 p-6 space-y-3">
        <div className="h-5 bg-gray-100 rounded-full w-1/2" />
        <div className="h-3 bg-gray-100 rounded-full w-1/3" />
        <div className="flex gap-2">
          <div className="h-3 bg-gray-100 rounded-full w-16" />
          <div className="h-3 bg-gray-100 rounded-full w-16" />
        </div>
        <div className="flex items-center justify-between mt-4">
          <div className="h-6 bg-gray-100 rounded-full w-24" />
          <div className="h-8 bg-gray-100 rounded-full w-8" />
        </div>
      </div>
    </div>
  );
}

export function ProductsPageContent() {
  const t = useTranslations("products");
  const locale = useLocale();
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedKarat, setSelectedKarat] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedKarat !== "all") params.set("karat", `K${selectedKarat}`);
    params.set("sort", sortBy);
    params.set("limit", "50");

    setLoading(true);
    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((data: ProductsResponse) => {
        setProducts(data.products || []);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [selectedCategory, selectedKarat, sortBy]);

  const categories = [
    { value: "all", label: "الكل", Icon: Circle },
    { value: "rings", label: "خواتم", Icon: CircleDot },
    { value: "necklaces", label: "سلاسل", Icon: Gem },
    { value: "earrings", label: "أقراط", Icon: Sparkles },
    { value: "bracelets", label: "أساور", Icon: Watch },
    { value: "sets", label: "أطقم", Icon: Crown },
    { value: "special", label: "مميزة", Icon: Star },
  ];

  const karats = [
    { value: "all", label: "الكل" },
    { value: "18", label: "عيار 18" },
  ];

  const hasFilters = selectedCategory !== "all";

  return (
    <div className="bg-light min-h-screen">
      {/* Header */}
      <div className="bg-secondary py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(212,175,55,0.08)_0%,transparent_60%)]" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-7xl mx-auto text-center relative z-10"
        >
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-gold/40" />
            <svg width="10" height="10" viewBox="0 0 10 10" className="text-gold/60">
              <path d="M5 0L10 5L5 10L0 5Z" fill="currentColor" />
            </svg>
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-gold/40" />
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-3">
            {t("title")}
          </h1>
          <p className="text-gray-400 max-w-lg mx-auto">{t("subtitle")}</p>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Mobile filter toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between bg-white rounded-xl p-4 shadow-sm border border-gray-100"
          >
            <span className="flex items-center gap-2 text-sm font-medium text-secondary">
              <SlidersHorizontal size={16} />
              الفلاتر
              {hasFilters && (
                <span className="bg-gold text-secondary text-xs px-2 py-0.5 rounded-full font-bold">
                  {(selectedCategory !== "all" ? 1 : 0) + (selectedKarat !== "all" ? 1 : 0)}
                </span>
              )}
            </span>
            <ChevronDown size={16} className={`text-gray-400 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className={`lg:w-64 flex-shrink-0 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 lg:sticky lg:top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-secondary flex items-center gap-2">
                  <SlidersHorizontal size={18} className="text-gold" />
                  الفلاتر
                </h3>
                {hasFilters && (
                  <button
                    onClick={() => { setSelectedCategory("all"); setSelectedKarat("all"); }}
                    className="text-xs text-gold hover:text-gold-dark transition-colors flex items-center gap-1"
                  >
                    <X size={12} />
                    مسح الكل
                  </button>
                )}
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">{t("filters.category")}</h4>
                <div className="space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all duration-200 ${
                        selectedCategory === cat.value
                          ? "bg-gold/10 text-gold font-medium border border-gold/20"
                          : "text-gray-600 hover:bg-gray-50 hover:text-secondary"
                      }`}
                    >
                      <cat.Icon size={16} />
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear all */}
              {selectedCategory !== "all" && (
                <button
                  onClick={() => { setSelectedCategory("all"); setShowFilters(false); }}
                  className="w-full py-2.5 border border-gold/30 text-gold text-sm rounded-xl hover:bg-gold/5 transition-all"
                >
                  {locale === "ar" ? "مسح الفلاتر" : "Clear filters"}
                </button>
              )}
            </div>
          </aside>

          {/* Products Content */}
          <div className="flex-1">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
                      جاري التحميل...
                    </span>
                  ) : (
                    <span>
                      <span className="font-semibold text-secondary">{products.length}</span> منتج
                    </span>
                  )}
                </span>
                {hasFilters && !loading && (
                  <div className="hidden sm:flex items-center gap-2">
                    {selectedCategory !== "all" && (
                      <span className="bg-gold/10 text-gold text-xs px-2.5 py-1 rounded-full flex items-center gap-1">
                        {categories.find(c => c.value === selectedCategory)?.label}
                        <button onClick={() => setSelectedCategory("all")} className="hover:text-gold-dark">
                          <X size={12} />
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3">
                {/* Sort */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 pr-8 text-sm focus:outline-none focus:border-gold transition-colors cursor-pointer"
                  >
                    <option value="newest">{t("sort.newest")}</option>
                    <option value="priceLow">{t("sort.priceLow")}</option>
                    <option value="priceHigh">{t("sort.priceHigh")}</option>
                    <option value="popular">{t("sort.popular")}</option>
                  </select>
                  <ChevronDown size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                {/* View toggle */}
                <div className="flex items-center gap-1 bg-gray-50 rounded-xl p-1 border border-gray-100">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === "grid" ? "bg-gold text-secondary shadow-sm" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      viewMode === "list" ? "bg-gold text-secondary shadow-sm" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {Array.from({ length: 6 }).map((_, i) => (
                  viewMode === "grid" ? <ProductSkeleton key={i} /> : <ProductListSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-20"
              >
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Package size={32} className="text-gray-300" />
                </div>
                <p className="text-gray-500 text-lg mb-2">{t("empty")}</p>
                <p className="text-gray-400 text-sm">جرب تغيير الفلاتر للعثور على ما تبحث عنه</p>
                {hasFilters && (
                  <button
                    onClick={() => { setSelectedCategory("all"); setSelectedKarat("all"); }}
                    className="mt-4 text-gold hover:text-gold-dark text-sm font-medium transition-colors"
                  >
                    مسح الفلاتر
                  </button>
                )}
              </motion.div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${selectedCategory}-${selectedKarat}-${sortBy}-${viewMode}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {products.map((product, i) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.3) }}
                    >
                      <ProductCard product={product} viewMode={viewMode} />
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
