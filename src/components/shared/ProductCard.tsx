"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { ShoppingBag, Heart } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { DiamondIcon } from "@/components/icons";
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
  isNew?: boolean;
  stock: number;
  images?: { url: string }[];
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
    addToast(`${product.name} تمت الإضافة للسلة`);
  };

  if (viewMode === "list") {
    return (
      <Link href={L(`/products/${product.slug}`)}>
        <motion.div
          whileHover={{ x: 4 }}
          className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex border border-gray-50"
        >
          <div className="w-48 h-48 bg-gray-100 flex-shrink-0 relative overflow-hidden">
            {product.images && product.images.length > 0 ? (
              <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-gold/5 flex items-center justify-center">
                <DiamondIcon size={48} className="text-gold/40" />
              </div>
            )}
            {product.isNew && (
              <span className="absolute top-2 left-2 bg-gold text-secondary text-xs px-2 py-1 rounded-full font-medium animate-pulse-gold">
                جديد
              </span>
            )}
          </div>
          <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-secondary mb-1 text-lg">{product.name}</h3>
              {product.nameFr && <p className="text-sm text-gray-500 mb-2">{product.nameFr}</p>}
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>{product.weight}g</span>
                <span className="w-1 h-1 bg-gray-300 rounded-full" />
                <span>عيار {karatNum}</span>
              </div>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-gold font-bold text-xl">{product.calculatedPrice.toLocaleString()} د.م</span>
              <div className="flex items-center gap-2">
                <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} className="p-2 text-gray-400 hover:text-gold transition-colors">
                  <Heart size={18} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }} onClick={handleAddToCart} className="p-2 bg-gold text-secondary rounded-full hover:bg-gold-dark transition-colors shadow-md shadow-gold/20">
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
    <Link href={`/products/${product.slug}`}>
      <div className="group bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          {product.images && product.images.length > 0 ? (
            <img src={product.images[0].url} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-gold/10 to-gold/5 flex items-center justify-center">
              <DiamondIcon size={64} className="text-gold/40 group-hover:scale-110 transition-transform duration-500" />
            </div>
          )}
          {product.isNew && (
            <span className="absolute top-3 left-3 bg-gold text-secondary text-xs px-3 py-1 rounded-full font-medium shadow-md">
              جديد
            </span>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <motion.button
            onClick={handleAddToCart}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute bottom-3 left-3 p-3 bg-gold text-secondary rounded-full shadow-xl opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
          >
            <ShoppingBag size={18} />
          </motion.button>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-secondary mb-1 line-clamp-1 group-hover:text-gold transition-colors">
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
            <span className="text-gold font-bold text-lg">{product.calculatedPrice.toLocaleString()} د.م</span>
            <span className="text-sm text-gold group-hover:translate-x-1 transition-transform duration-300 inline-flex items-center gap-1">
              عرض التفاصيل
              <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2.5 6h7M6.5 3l3 3-3 3" /></svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
