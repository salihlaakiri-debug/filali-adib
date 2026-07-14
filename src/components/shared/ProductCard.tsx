"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { ShoppingBag, Heart, Play } from "lucide-react";
import { useState } from "react";
import { useCartStore } from "@/lib/store";
import { DiamondIcon } from "@/components/icons";
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
  isNew?: boolean;
  stock: number;
  images?: { url: string }[];
  videos?: { url: string; type: string }[];
}

interface ProductCardProps {
  product: Product;
  viewMode: "grid" | "list";
}

export function ProductCard({ product, viewMode }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const { addToast } = useToast();
  const locale = useLocale();
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;
  const karatNum = parseInt(product.karat.replace("K", ""));
  const [isFav, setIsFav] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: product.calculatedPrice,
      weight: product.weight,
      karat: karatNum,
      stock: product.stock,
    });
    addToast(`${product.name} ${locale === "ar" ? "تمت الإضافة للسلة" : "ajouté au panier"}`);
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id }),
    })
      .then((r) => r.json())
      .then((data) => {
        setIsFav(data.added);
        addToast(data.added
          ? (locale === "ar" ? "تمت الإضافة للمفضلة" : "Ajouté aux favoris")
          : (locale === "ar" ? "تمت الإزالة من المفضلة" : "Retiré des favoris"));
      })
      .catch(() => addToast(locale === "ar" ? "سجّل الدخول أولاً" : "Connectez-vous d'abord"));
  };

  if (viewMode === "list") {
    return (
      <Link href={L(`/products/${product.slug}`)}>
        <motion.div
          whileHover={{ x: 4 }}
          className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 flex border border-gray-100 hover:border-gold/20"
        >
          <div className="w-52 h-52 bg-gray-100 flex-shrink-0 relative overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img
                src={product.images[0].url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-gold/5 flex items-center justify-center">
                <DiamondIcon size={48} className="text-gold/40" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            {product.isNew && (
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="absolute top-3 left-3 bg-gold text-secondary text-xs px-3 py-1 rounded-full font-bold shadow-lg shadow-gold/30"
              >
                {locale === "ar" ? "جديد" : "Nouveau"}
              </motion.span>
            )}
          </div>
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-secondary mb-1 text-lg group-hover:text-gold transition-colors duration-300">
                {product.name}
              </h3>
              {product.nameFr && (
                <p className="text-sm text-gray-500 mb-2">{product.nameFr}</p>
              )}
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="bg-gray-50 px-2 py-0.5 rounded-full">{product.weight}g</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span className="bg-gray-50 px-2 py-0.5 rounded-full">{locale === "ar" ? "عيار" : "Karat"} {karatNum}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div>
                <span className="text-gold font-bold text-xl">{product.calculatedPrice.toLocaleString()} {locale === "ar" ? "د.م" : "MAD"}</span>
              </div>
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleToggleFavorite}
                  className={`p-2.5 rounded-full transition-all duration-300 ${
                    isFav
                      ? "bg-red-50 text-red-500 shadow-sm"
                      : "bg-gray-50 text-gray-400 hover:text-gold hover:bg-gold/5"
                  }`}
                >
                  <Heart size={18} fill={isFav ? "currentColor" : "none"} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleAddToCart}
                  className="p-2.5 bg-gold text-secondary rounded-full hover:bg-gold-dark transition-all duration-300 shadow-lg shadow-gold/20 hover:shadow-gold/40"
                >
                  <ShoppingBag size={18} />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={L(`/products/${product.slug}`)}>
      <motion.div
        onHoverStart={() => setShowQuickActions(true)}
        onHoverEnd={() => setShowQuickActions(false)}
        className="group relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-gold/10 transition-all duration-500"
      >
        {/* Image section */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <>
              <img
                src={product.images[0].url}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              {/* Multi-layer hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
              <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-gold/5 flex items-center justify-center">
              <DiamondIcon
                size={64}
                className="text-gold/40 group-hover:scale-125 group-hover:rotate-45 transition-all duration-700"
              />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <motion.span
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="bg-gold text-secondary text-xs px-3 py-1 rounded-full font-bold shadow-lg shadow-gold/30 backdrop-blur-sm"
              >
                {locale === "ar" ? "جديد" : "Nouveau"}
              </motion.span>
            )}
            {product.videos && product.videos.length > 0 && (
              <motion.span
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="bg-secondary/80 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1 shadow-lg"
              >
                <Play size={10} fill="currentColor" />
                {product.videos.length} {locale === "ar" ? "فيديو" : "vidéo"}
              </motion.span>
            )}
          </div>

          {/* Favorite button */}
          <motion.button
            onClick={handleToggleFavorite}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.85 }}
            className={`absolute top-3 right-3 p-2.5 rounded-full shadow-lg transition-all duration-300 ${
              isFav
                ? "bg-red-500 text-white opacity-100 shadow-red-500/30"
                : "bg-white/90 backdrop-blur-sm text-gray-400 opacity-0 group-hover:opacity-100 hover:text-red-500"
            }`}
          >
            <Heart size={16} fill={isFav ? "currentColor" : "none"} />
          </motion.button>

          {/* Quick add to cart */}
          <AnimatePresence>
            {showQuickActions && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-3 left-3 right-3"
              >
                <motion.button
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-2.5 bg-gold text-secondary rounded-xl font-semibold text-sm shadow-xl shadow-gold/30 hover:bg-gold-dark transition-colors flex items-center justify-center gap-2 backdrop-blur-sm"
                >
                  <ShoppingBag size={16} />
                  {locale === "ar" ? "أضف للسلة" : "Ajouter au panier"}
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Shine effect on hover */}
          <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />
        </div>

        {/* Content section */}
        <div className="p-4">
          <h3 className="font-semibold text-secondary mb-1 line-clamp-1 group-hover:text-gold transition-colors duration-300">
            {product.name}
          </h3>
          {product.nameFr && (
            <p className="text-sm text-gray-400 mb-2 line-clamp-1">{product.nameFr}</p>
          )}
          <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
            <span className="bg-gray-50 px-2 py-0.5 rounded-full">{product.weight}g</span>
            <span className="w-1 h-1 bg-gray-300 rounded-full" />
            <span className="bg-gray-50 px-2 py-0.5 rounded-full">{locale === "ar" ? "عيار" : "Karat"} {karatNum}</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <span className="text-gold font-bold text-lg">{product.calculatedPrice.toLocaleString()}</span>
              <span className="text-gray-400 text-sm mr-1">{locale === "ar" ? "د.م" : "MAD"}</span>
            </div>
            <motion.span
              className="text-xs text-gold group-hover:translate-x-1 transition-transform duration-300 inline-flex items-center gap-1"
            >
              {locale === "ar" ? "عرض التفاصيل" : "Voir les détails"}
              <svg
                className="w-3 h-3"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M2.5 6h7M6.5 3l3 3-3 3" />
              </svg>
            </motion.span>
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
      </motion.div>
    </Link>
  );
}
