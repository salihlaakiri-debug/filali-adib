"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ShoppingBag, Heart, Share2, Minus, Plus, Shield, Truck, RotateCcw, Loader2, Star, Send } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { DiamondIcon } from "@/components/icons";
import { useToast } from "@/components/motion/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn } from "@/components/motion";

interface ProductData {
  id: string;
  name: string;
  nameAr?: string;
  nameFr?: string;
  slug: string;
  description?: string;
  descriptionFr?: string;
  karat: string;
  weight: number;
  goldPrice: number;
  profitMargin: number;
  calculatedPrice: number;
  stock: number;
  isNew: boolean;
  certification?: string;
  images: { url: string }[];
  category: { name: string; slug: string };
}

export default function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const t = useTranslations("product");
  const locale = useLocale();
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);
  const { addToast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const { data: session } = useSession();
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewStats, setReviewStats] = useState({ total: 0, average: 0 });
  const [reviewText, setReviewText] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [submittingReview, setSubmittingReview] = useState(false);
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;

  const handleToggleFavorite = () => {
    if (!product) return;
    fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id }),
    })
      .then((r) => r.json())
      .then((data) => { setIsFav(data.added); addToast(data.added ? "تمت الإضافة للمفضلة" : "تمت الإزالة من المفضلة"); })
      .catch(() => addToast("سجّل الدخول أولاً"));
  };

  useEffect(() => {
    fetch(`/api/products?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.products?.length > 0) {
          const p = data.products[0];
          setProduct(p);
          fetch(`/api/reviews?productId=${p.id}`)
            .then((r) => r.json())
            .then((d) => { setReviews(d.reviews || []); setReviewStats({ total: d.total, average: d.average }); })
            .catch(() => {});
        }
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSubmitReview = async () => {
    if (!product || !reviewText.trim()) return;
    setSubmittingReview(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: product.id, rating: reviewRating, comment: reviewText }),
      });
      if (res.ok) {
        const data = await res.json();
        setReviews((prev) => [{ ...data.review, user: { name: session?.user?.name || "Anonymous" } }, ...prev]);
        setReviewStats((prev) => ({ total: prev.total + 1, average: ((prev.average * prev.total) + reviewRating) / (prev.total + 1) }));
        setReviewText("");
        setReviewRating(5);
        addToast("تم نشر تقييمك بنجاح");
      } else {
        addToast("حدث خطأ في نشر التقييم");
      }
    } catch { addToast("حدث خطأ"); } finally { setSubmittingReview(false); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <Loader2 size={40} className="text-gold" />
        </motion.div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-light flex items-center justify-center">
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-gray-500 text-lg">المنتج غير موجود</motion.p>
      </div>
    );
  }

  const karatNum = parseInt(product.karat.replace("K", ""));

  const handleAddToCart = () => {
    addItem({
      id: product.id, name: product.name, slug: product.slug,
      price: product.calculatedPrice, weight: product.weight,
      karat: karatNum, stock: product.stock,
    }, quantity);
    addToast(`${product.name} تمت الإضافة للسلة`);
    router.push(`/${locale}/cart`);
  };

  return (
    <div className="bg-light min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-sm text-gray-500 mb-6">
          <Link href={L("/")} className="hover:text-gold transition-colors">الرئيسية</Link>
          <span className="mx-2">/</span>
          <Link href={L("/products")} className="hover:text-gold transition-colors">المنتجات</Link>
          <span className="mx-2">/</span>
          <span className="text-secondary">{product.name}</span>
        </motion.nav>

        <div className="grid lg:grid-cols-2 gap-12">
          <FadeIn direction="right">
            <div className="bg-white rounded-3xl overflow-hidden shadow-sm aspect-square relative">
              <AnimatePresence mode="wait">
                {product.images && product.images.length > 0 ? (
                  <motion.img
                    key={product.images[activeImage]?.url}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    src={product.images[activeImage]?.url}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gold/10 to-gold/5">
                    <DiamondIcon size={96} className="text-gold/40" />
                  </div>
                )}
              </AnimatePresence>
              {product.isNew && (
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.3 }}
                  className="absolute top-4 left-4 bg-gold text-secondary text-sm px-4 py-1 rounded-full font-medium shadow-lg">
                  جديد
                </motion.span>
              )}
              {product.stock <= 0 && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">نفد المخزون</span>
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                      i === activeImage ? "border-gold shadow-md" : "border-gray-200 opacity-60 hover:opacity-100"
                    }`}>
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </FadeIn>

          <FadeIn direction="left" delay={0.2}>
            <div>
              <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                className="font-playfair text-3xl font-bold text-secondary mb-2">
                {product.name}
              </motion.h1>
              {product.nameFr && <p className="text-gray-500 mb-4">{product.nameFr}</p>}

              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="bg-gold/10 rounded-2xl p-5 mb-6 border border-gold/10">
                <div className="flex items-baseline gap-2">
                  <motion.span initial={{ scale: 0.5 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.5 }}
                    className="text-4xl font-bold text-gold">
                    {product.calculatedPrice.toLocaleString()}
                  </motion.span>
                  <span className="text-gold">د.م</span>
                </div>
                <div className="text-sm text-gray-500 mt-2 flex flex-wrap gap-1">
                  <span>سعر الذهب: {product.goldPrice} د.م/غ</span>
                  <span className="text-gray-300">|</span>
                  <span>هامش الربح: {product.profitMargin} د.م/غ</span>
                  <span className="text-gray-300">|</span>
                  <span>الوزن: {product.weight}غ</span>
                </div>
              </motion.div>

              <div className="grid grid-cols-3 gap-4 mb-6">
                {[{ label: t("weight"), value: `${product.weight}g` }, { label: t("karat"), value: `عيار ${karatNum}` }, { label: "المخزون", value: String(product.stock) }].map((item, i) => (
                  <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 + i * 0.1 }}
                    className="bg-white rounded-xl p-3 text-center shadow-sm border border-gray-50">
                    <p className="text-xs text-gray-500 mb-1">{item.label}</p>
                    <p className="font-semibold text-secondary">{item.value}</p>
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm text-gray-700">{t("quantity")}:</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-gray-50 transition-colors">
                    <Minus size={16} />
                  </motion.button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => setQuantity(Math.min(quantity + 1, product.stock))} className="p-3 hover:bg-gray-50 transition-colors">
                    <Plus size={16} />
                  </motion.button>
                </div>
              </div>

              <div className="flex gap-4 mb-6">
                <motion.button onClick={handleAddToCart} disabled={product.stock <= 0} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-gold text-secondary py-3.5 rounded-full font-semibold hover:bg-gold-dark transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gold/20">
                  <ShoppingBag size={20} />
                  {product.stock > 0 ? t("addToCart") : t("outOfStock")}
                </motion.button>
                <motion.button onClick={handleToggleFavorite} whileHover={{ scale: 1.1, borderColor: "#D4AF37" }} whileTap={{ scale: 0.9 }}
                  className={`p-3 border-2 rounded-full transition-all ${isFav ? "border-red-400 text-red-500 bg-red-50" : "border-gray-200 hover:text-gold hover:border-gold"}`}>
                  <Heart size={20} fill={isFav ? "currentColor" : "none"} />
                </motion.button>
                <motion.button whileHover={{ scale: 1.1, borderColor: "#D4AF37" }} whileTap={{ scale: 0.9 }}
                  className="p-3 border-2 border-gray-200 rounded-full hover:text-gold transition-all">
                  <Share2 size={20} />
                </motion.button>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {[{ icon: Shield, label: t("certification") }, { icon: Truck, label: t("shipping") }, { icon: RotateCcw, label: t("returns") }].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <item.icon className="text-gold" size={18} />
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn direction="up" delay={0.3}>
          <div className="mt-12">
            <div className="flex gap-4 border-b border-gray-200 mb-6">
              {(["description", "specs", "reviews"] as const).map((tab) => (
                <motion.button key={tab} onClick={() => setActiveTab(tab)} whileTap={{ scale: 0.97 }}
                  className={`pb-4 px-4 font-medium transition-all relative ${
                    activeTab === tab ? "text-gold" : "text-gray-500 hover:text-gray-700"
                  }`}>
                  {tab === "description" ? t("description") : tab === "specs" ? t("specifications") : t("reviews")}
                  {activeTab === tab && (
                    <motion.div layoutId="tab-indicator" className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold rounded-full" />
                  )}
                </motion.button>
              ))}
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <AnimatePresence mode="wait">
                {activeTab === "description" && (
                  <motion.div key="desc" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                    <p className="text-gray-600 leading-relaxed mb-4">{product.description || "لا يوجد وصف متاح"}</p>
                    {product.descriptionFr && <p className="text-gray-600 leading-relaxed">{product.descriptionFr}</p>}
                  </motion.div>
                )}
                {activeTab === "specs" && (
                  <motion.div key="specs" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-3">
                    {[{ label: t("weight"), value: `${product.weight}g` }, { label: t("karat"), value: `عيار ${karatNum}` }, ...(product.certification ? [{ label: t("certification"), value: product.certification }] : []), { label: "الفئة", value: product.category?.name }].map((item, i) => (
                      <div key={i} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                        <span className="text-gray-500">{item.label}</span>
                        <span className="font-medium">{item.value}</span>
                      </div>
                    ))}
                  </motion.div>
                )}
                {activeTab === "reviews" && (
                  <motion.div key="reviews" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
                    {/* Review Summary */}
                    <div className="flex items-center gap-4 mb-6 p-4 bg-gold/5 rounded-xl">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-gold">{reviewStats.average || "0"}</p>
                        <div className="flex gap-0.5 my-1">
                          {[1,2,3,4,5].map((s) => <Star key={s} size={14} className={s <= Math.round(reviewStats.average) ? "text-gold fill-gold" : "text-gray-300"} />)}
                        </div>
                        <p className="text-xs text-gray-500">{reviewStats.total} تقييم</p>
                      </div>
                    </div>

                    {/* Submit Review */}
                    {session && (
                      <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                        <p className="text-sm font-medium text-secondary mb-2">أضف تقييمك</p>
                        <div className="flex gap-1 mb-3">
                          {[1,2,3,4,5].map((s) => (
                            <button key={s} onClick={() => setReviewRating(s)} className="transition-colors">
                              <Star size={22} className={s <= reviewRating ? "text-gold fill-gold" : "text-gray-300 hover:text-gold"} />
                            </button>
                          ))}
                        </div>
                        <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} rows={3}
                          placeholder="اكتب تجربتك مع المنتج..."
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gold resize-none" />
                        <motion.button onClick={handleSubmitReview} disabled={submittingReview || !reviewText.trim()}
                          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                          className="mt-2 bg-gold text-secondary px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-2 disabled:opacity-50">
                          {submittingReview ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                          نشر التقييم
                        </motion.button>
                      </div>
                    )}

                    {/* Reviews List */}
                    {reviews.length === 0 ? (
                      <p className="text-center py-8 text-gray-500">لا توجد تقييمات بعد. كن أول من يقيّم!</p>
                    ) : (
                      <div className="space-y-4">
                        {reviews.map((review) => (
                          <div key={review.id} className="border border-gray-100 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center text-gold text-sm font-bold">
                                  {review.user?.name?.charAt(0) || "?"}
                                </div>
                                <span className="font-medium text-sm text-secondary">{review.user?.name}</span>
                              </div>
                              <div className="flex gap-0.5">
                                {[1,2,3,4,5].map((s) => <Star key={s} size={12} className={s <= review.rating ? "text-gold fill-gold" : "text-gray-300"} />)}
                              </div>
                            </div>
                            {review.comment && <p className="text-gray-600 text-sm">{review.comment}</p>}
                            <p className="text-xs text-gray-400 mt-2">{new Date(review.createdAt).toLocaleDateString("ar-MA")}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
