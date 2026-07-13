"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { SlidersHorizontal, Grid3X3, List, ChevronDown, Loader2 } from "lucide-react";
import { ProductCard } from "@/components/shared/ProductCard";

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
}

interface ProductsResponse {
  products: Product[];
  pagination: { page: number; limit: number; total: number; pages: number };
}

export default function ProductsPage() {
  const t = useTranslations("products");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedKarat, setSelectedKarat] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    if (selectedKarat !== "all") params.set("karat", `K${selectedKarat}`);
    params.set("sort", sortBy);

    setLoading(true);
    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((data: ProductsResponse) => {
        setProducts(data.products || []);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [selectedCategory, selectedKarat, sortBy]);

  return (
    <div className="bg-light min-h-screen">
      <div className="bg-secondary py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-playfair text-4xl font-bold text-white mb-2">
            {t("title")}
          </h1>
          <p className="text-gray-400">{t("subtitle")}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-secondary mb-4 flex items-center gap-2">
                <SlidersHorizontal size={18} />
                {t("filters.all")}
              </h3>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">{t("filters.category")}</h4>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "الكل" },
                    { value: "rings", label: "خواتم" },
                    { value: "necklaces", label: "سلاسل" },
                    { value: "earrings", label: "أقراط" },
                    { value: "bracelets", label: "أساور" },
                    { value: "sets", label: "أطقم" },
                  ].map((cat) => (
                    <label key={cat.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === cat.value}
                        onChange={() => setSelectedCategory(cat.value)}
                        className="text-gold focus:ring-gold"
                      />
                      <span className="text-sm text-gray-600">{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">{t("filters.karat")}</h4>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "الكل" },
                    { value: "18", label: "عيار 18" },
                    { value: "21", label: "عيار 21" },
                    { value: "24", label: "عيار 24" },
                  ].map((karat) => (
                    <label key={karat.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="karat"
                        checked={selectedKarat === karat.value}
                        onChange={() => setSelectedKarat(karat.value)}
                        className="text-gold focus:ring-gold"
                      />
                      <span className="text-sm text-gray-600">{karat.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={() => { setSelectedCategory("all"); setSelectedKarat("all"); }}
                className="w-full text-sm text-gold hover:text-gold-dark transition-colors"
              >
                {t("filters.clear")}
              </button>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-white rounded-xl p-4 shadow-sm">
              <span className="text-sm text-gray-500">
                {loading ? "جاري التحميل..." : `${products.length} منتج`}
              </span>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 pr-8 text-sm focus:outline-none focus:border-gold"
                  >
                    <option value="newest">{t("sort.newest")}</option>
                    <option value="priceLow">{t("sort.priceLow")}</option>
                    <option value="priceHigh">{t("sort.priceHigh")}</option>
                    <option value="popular">{t("sort.popular")}</option>
                  </select>
                  <ChevronDown size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>

                <div className="flex items-center gap-2 border-l pl-4">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "grid" ? "bg-gold text-secondary" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <Grid3X3 size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === "list" ? "bg-gold text-secondary" : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 size={32} className="animate-spin text-gold" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 text-gray-500">
                <p className="text-lg">{t("empty")}</p>
              </div>
            ) : (
              <div className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                  : "space-y-4"
              }>
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} viewMode={viewMode} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
