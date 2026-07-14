"use client";

import Link from "next/link";
import { useTranslations, useLocale } from "next-intl";
import { ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useState, useEffect } from "react";
import { DiamondIcon } from "@/components/icons";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { useToast } from "@/components/motion/Toast";
import { motion, AnimatePresence } from "framer-motion";

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
  const locale = useLocale();
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;
  const addItem = useCartStore((s) => s.addItem);
  const [products, setProducts] = useState<Product[]>([]);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
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
    <section className="py-24 px-4 bg-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gold/[0.02] rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-gold/[0.02] rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

      {/* Decorative diamond shapes */}
      <motion.div
        className="absolute top-20 left-10 hidden lg:block"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" className="text-gold/[0.06]">
          <path d="M20 0L40 20L20 40L0 20Z" fill="currentColor" />
        </svg>
      </motion.div>
      <motion.div
        className="absolute bottom-20 right-10 hidden lg:block"
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      >
        <svg width="30" height="30" viewBox="0 0 40 40" className="text-gold/[0.04]">
          <path d="M20 0L40 20L20 40L0 20Z" fill="currentColor" />
        </svg>
      </motion.div>

      <div className="max-w-7xl mx-auto relative">
        <FadeIn direction="up" className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-gold/40" />
            <svg width="10" height="10" viewBox="0 0 10 10" className="text-gold/60">
              <path d="M5 0L10 5L5 10L0 5Z" fill="currentColor" />
            </svg>
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-gold/40" />
          </motion.div>
          <h2 className="font-playfair text-3xl md:text-5xl font-bold text-secondary mb-4">
            {t("title")}
          </h2>
          <p className="text-gray-500 mt-6 max-w-lg mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </FadeIn>

        <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => {
            const karatNum = parseInt(product.karat.replace("K", ""));
            return (
              <StaggerItem key={product.id}>
                <motion.div
                  onHoverStart={() => setHoveredId(product.id)}
                  onHoverEnd={() => setHoveredId(null)}
                  className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-gold/10 transition-all duration-500"
                  whileHover={{ y: -8 }}
                >
                  <Link href={L(`/products/${product.slug}`)}>
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      {product.images && product.images.length > 0 ? (
                        <>
                          <img
                            src={product.images[0].url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </>
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-gold/5 flex items-center justify-center">
                          <DiamondIcon
                            size={64}
                            className="text-gold/40 group-hover:scale-125 transition-transform duration-700"
                          />
                        </div>
                      )}

                      {/* Quick add button */}
                      <AnimatePresence>
                        {hoveredId === product.id && (
                          <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: 10, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute bottom-3 left-3 right-3"
                          >
                            <motion.button
                              whileHover={{ scale: 1.03 }}
                              whileTap={{ scale: 0.97 }}
                              onClick={(e) => {
                                e.preventDefault();
                                handleAddToCart(product);
                              }}
                              className="w-full py-2.5 bg-gold text-secondary rounded-xl font-semibold text-sm shadow-xl shadow-gold/30 hover:bg-gold-dark transition-colors flex items-center justify-center gap-2 backdrop-blur-sm"
                            >
                              <ShoppingBag size={16} />
                              أضف للسلة
                            </motion.button>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Shine effect */}
                      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
                    </div>
                  </Link>

                  <div className="p-5">
                    <h3 className="font-semibold text-secondary mb-1 line-clamp-1 group-hover:text-gold transition-colors duration-300">
                      {product.name}
                    </h3>
                    {product.nameFr && (
                      <p className="text-sm text-gray-400 mb-2 line-clamp-1">
                        {product.nameFr}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                      <span className="bg-gray-50 px-2 py-0.5 rounded-full">{product.weight}g</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span className="bg-gray-50 px-2 py-0.5 rounded-full">عيار {karatNum}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gold font-bold text-lg">
                        {product.calculatedPrice.toLocaleString()}
                        <span className="text-gray-400 text-sm font-normal mr-1">د.م</span>
                      </span>
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: -5 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.preventDefault();
                          handleAddToCart(product);
                        }}
                        className="p-2.5 bg-gold text-secondary rounded-full hover:bg-gold-dark transition-all duration-300 shadow-lg shadow-gold/20 hover:shadow-gold/40"
                      >
                        <ShoppingBag size={16} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Bottom accent line */}
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerContainer>

        <FadeIn delay={0.3} className="text-center mt-14">
          <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }} className="inline-block">
            <Link
              href={L("/products")}
              className="group bg-secondary text-white px-10 py-4 rounded-full font-semibold hover:bg-secondary/90 transition-all duration-300 shadow-xl shadow-secondary/10 hover:shadow-secondary/20 inline-flex items-center gap-3"
            >
              عرض جميع المنتجات
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300"
                viewBox="0 0 16 16"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M3 8h10M9 4l4 4-4 4" />
              </svg>
            </Link>
          </motion.div>
        </FadeIn>
      </div>
    </section>
  );
}
