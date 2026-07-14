"use client";

import { useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Heart, Trash2, ShoppingBag, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";
import { useCartStore } from "@/lib/store";
import { useToast } from "@/components/motion/Toast";
import { DiamondIcon } from "@/components/icons";
import Link from "next/link";

interface FavoriteProduct {
  id: string;
  productId: string;
  product: {
    id: string;
    name: string;
    slug: string;
    calculatedPrice: number;
    weight: number;
    karat: string;
    stock: number;
    images: { url: string }[];
  };
}

export default function FavoritesPage() {
  const locale = useLocale();
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;
  const { data: session, status } = useSession();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const { addToast } = useToast();
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { router.push(L("/login")); return; }
    if (status === "authenticated") {
      fetch("/api/favorites")
        .then((r) => r.json())
        .then((data) => setFavorites(data.favorites || []))
        .catch(() => setFavorites([]))
        .finally(() => setLoading(false));
    }
  }, [status]);

  const removeFavorite = async (productId: string) => {
    try {
      await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId }),
      });
      setFavorites((prev) => prev.filter((f) => f.productId !== productId));
      addToast(locale === "ar" ? "تمت الإزالة من المفضلة" : "Removed from favorites");
    } catch { addToast(locale === "ar" ? "حدث خطأ" : "Error occurred"); }
  };

  const handleAddToCart = (product: FavoriteProduct["product"]) => {
    const karatNum = parseInt(product.karat.replace("K", ""));
    addItem({ id: product.id, name: product.name, slug: product.slug, price: product.calculatedPrice, weight: product.weight, karat: karatNum, stock: product.stock });
    addToast(locale === "ar" ? `${product.name} تمت الإضافة للسلة` : `${product.name} added to cart`);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 size={32} className="text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-light min-h-[70vh] py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-playfair text-3xl font-bold text-secondary">
            {locale === "ar" ? "المفضلة" : "Favorites"}{" "}
            <span className="text-gold text-lg">({favorites.length})</span>
          </h1>
          <p className="text-gray-500 mt-1">
            {locale === "ar" ? "المنتجات التي أضفتها للمفضلة" : "Products you've added to favorites"}
          </p>
        </motion.div>

        {favorites.length === 0 ? (
          <FadeIn>
            <div className="text-center py-20">
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-28 h-28 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <Heart size={48} className="text-pink-300" />
              </motion.div>
              <h2 className="text-xl font-semibold text-secondary mb-2">
                {locale === "ar" ? "المفضلة فارغة" : "No Favorites Yet"}
              </h2>
              <p className="text-gray-500 mb-8 max-w-md mx-auto">
                {locale === "ar" ? "لم تضف أي منتجات بعد. تصفح منتجاتنا وأضف ما يعجبك" : "You haven't added any favorites yet. Browse our products and add what you like"}
              </p>
              <Link href={L("/products")}
                className="inline-flex items-center gap-2 bg-gold text-secondary px-8 py-4 rounded-xl font-semibold hover:bg-gold-dark transition-all shadow-lg shadow-gold/20 hover:shadow-gold/40">
                <ShoppingBag size={18} />
                {locale === "ar" ? "تصفح المنتجات" : "Browse Products"}
              </Link>
            </div>
          </FadeIn>
        ) : (
          <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5" staggerDelay={0.06}>
            {favorites.map((fav) => (
              <StaggerItem key={fav.id}>
                <motion.div whileHover={{ y: -4 }} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gray-50">
                  <div className="relative aspect-square bg-gray-100 overflow-hidden">
                    {fav.product.images?.length > 0 ? (
                      <img src={fav.product.images[0].url} alt={fav.product.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <DiamondIcon size={48} className="text-gold/30" />
                      </div>
                    )}
                    <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                      onClick={() => removeFavorite(fav.productId)}
                      className="absolute top-3 right-3 p-2.5 bg-white/90 rounded-full shadow-md text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                  <div className="p-4">
                    <Link href={L(`/products/${fav.product.slug}`)}>
                      <h3 className="font-semibold text-secondary hover:text-gold transition-colors mb-1 line-clamp-1">{fav.product.name}</h3>
                    </Link>
                    <p className="text-xs text-gray-400 mb-3">
                      {fav.product.weight}g · {locale === "ar" ? `عيار ${fav.product.karat.replace("K", "")}` : `${fav.product.karat}`}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-gold font-bold text-lg">{fav.product.calculatedPrice.toLocaleString()} د.م</span>
                      <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => handleAddToCart(fav.product)}
                        className="p-2.5 bg-gold text-secondary rounded-xl hover:bg-gold-dark transition-colors shadow-md shadow-gold/20">
                        <ShoppingBag size={16} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        )}
      </div>
    </div>
  );
}
