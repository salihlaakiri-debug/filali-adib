"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useState, useEffect } from "react";
import { DiamondIcon } from "@/components/icons";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { useToast } from "@/components/motion/Toast";
import { motion } from "framer-motion";

interface Product {
  id: string;
  name: string;
  nameFr?: string;
  slug: string;
  calculatedPrice: number;
  weight: number;
  karat: string;
  stock: number;
  images?: { url: string }[];
}

export function FeaturedProducts() {
  const t = useTranslations("home.featured");
  const addItem = useCartStore((s) => s.addItem);
  const [products, setProducts] = useState<Product[]>([]);
  const { addToast } = useToast();

  useEffect(() => {
    fetch("/api/products?limit=4&sort=newest")
      .then((r) => r.json())
      .then((data) => setProducts(data.products || []))
      .catch(() => {});
  }, []);

  const handleAddToCart = (product: Product) => {
    const karatNum = parseInt(product.karat.replace("K", ""));
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.calculatedPrice,
      weight: product.weight,
      karat: karatNum,
      stock: product.stock,
    });
    addToast(`${product.name} تمت الإضافة للسلة`);
  };

  return (
    <section className="py-20 px-4 bg-white relative overflow-hidden">
      {/* Subtle background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold/3 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />

      <div className="max-w-7xl mx-auto relative">
        <FadeIn direction="up" className="text-center mb-14">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-secondary mb-4 line-gold inline-block pb-2">
            {t("title")}
          </h2>
          <p className="text-gray-600 mt-6 max-w-lg mx-auto">{t("subtitle")}</p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const karatNum = parseInt(product.karat.replace("K", ""));
            return (
              <StaggerItem key={product.id}>
                <motion.div
                  className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500"
                  whileHover={{ y: -6 }}
                >
                  <Link href={`/products/${product.slug}`}>
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <img
                          src={product.images[0].url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-gold/5 flex items-center justify-center">
                          <DiamondIcon size={64} className="text-gold/40" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  </Link>

                  <div className="p-4">
                    <h3 className="font-semibold text-secondary mb-1 line-clamp-1">
                      {product.name}
                    </h3>
                    {product.nameFr && (
                      <p className="text-sm text-gray-500 mb-2 line-clamp-1">{product.nameFr}</p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                      <span>{product.weight}g</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span>عيار {karatNum}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gold font-bold text-lg">
                        {product.calculatedPrice.toLocaleString()} د.م
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                        className="p-2 bg-gold text-secondary rounded-full hover:bg-gold-dark transition-colors shadow-md shadow-gold/20"
                      >
                        <ShoppingBag size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <FadeIn delay={0.3} className="text-center mt-12">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
            <Link
              href="/products"
              className="bg-secondary text-white px-10 py-3.5 rounded-full font-semibold hover:bg-secondary/90 transition-all shadow-lg shadow-secondary/10 hover:shadow-secondary/20 inline-flex items-center gap-2"
            >
              عرض جميع المنتجات
              <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
