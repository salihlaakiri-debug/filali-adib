"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Plus, Edit2, Trash2, Loader2 } from "lucide-react";
import Link from "next/link";
import { DiamondIcon } from "@/components/icons";
import { motion } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";

interface Product {
  id: string;
  name: string;
  sku: string;
  karat: string;
  weight: number;
  calculatedPrice: number;
  stock: number;
  isActive: boolean;
}

export default function AdminProductsPage() {
  const t = useTranslations("admin.products");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/products")
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-gray-800">{t("title")}</h1>
        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
          <Link href="/admin/products/new"
            className="bg-gold text-secondary px-4 py-2 rounded-lg font-medium hover:bg-gold-dark transition-colors flex items-center gap-2 shadow-lg shadow-gold/20">
            <Plus size={18} /> {t("add")}
          </Link>
        </motion.div>
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
            <Loader2 size={32} className="text-gold" />
          </motion.div>
        </div>
      ) : (
        <FadeIn direction="up">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-gray-500 bg-gray-50">
                    {["المنتج", "SKU", "العيار", "الوزن", "السعر", "المخزون", "الحالة", "الإجراءات"].map((h) => (
                      <th key={h} className="px-6 py-4 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr><td colSpan={8} className="px-6 py-8 text-center text-gray-400">لا توجد منتجات</td></tr>
                  ) : (
                    products.map((product, i) => (
                      <motion.tr key={product.id}
                        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + i * 0.06 }}
                        className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                              <DiamondIcon size={20} className="text-gold/60" />
                            </div>
                            <span className="font-medium text-gray-800">{product.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm font-mono">{product.sku}</td>
                        <td className="px-6 py-4 text-gray-600">{product.karat}</td>
                        <td className="px-6 py-4 text-gray-600">{product.weight}g</td>
                        <td className="px-6 py-4 font-medium text-gray-800">{product.calculatedPrice.toLocaleString()} د.م</td>
                        <td className="px-6 py-4 text-gray-600">{product.stock}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${product.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {product.isActive ? "نشط" : "غير نشط"}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="p-2 text-gray-400 hover:text-gold transition-colors">
                              <Edit2 size={18} />
                            </motion.button>
                            <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                              <Trash2 size={18} />
                            </motion.button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </FadeIn>
      )}
    </div>
  );
}
