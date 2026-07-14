"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, Tag, ArrowRight, Package, Shield, Truck, RotateCcw } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { useState } from "react";
import { DiamondIcon } from "@/components/icons";
import { useToast } from "@/components/motion/Toast";
import { motion, AnimatePresence } from "framer-motion";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion";

export default function CartPage() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;
  const { items, removeItem, updateQuantity, getSubtotal, getShipping, getTax, getTotal } = useCartStore();
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const { addToast } = useToast();

  const subtotal = getSubtotal();
  const shipping = getShipping();
  const tax = getTax();
  const total = getTotal() - discount;

  const applyCoupon = async () => {
    if (!coupon.trim()) { addToast(locale === "ar" ? "أدخل كود الكوبون" : "Enter coupon code"); return; }
    setCouponLoading(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: coupon, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) { addToast(data.error || (locale === "ar" ? "كود غير صحيح" : "Invalid code")); setDiscount(0); return; }
      setDiscount(data.discount);
      addToast(locale === "ar" ? `تم تطبيق الكوبون - خصم ${data.discount.toLocaleString()} د.م` : `Coupon applied - ${data.discount.toLocaleString()} MAD off`);
    } catch { addToast(locale === "ar" ? "حدث خطأ" : "Error occurred"); setDiscount(0); } finally { setCouponLoading(false); }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-md">
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-28 h-28 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <ShoppingBag size={48} className="text-gold" />
          </motion.div>
          <h1 className="font-playfair text-3xl font-bold text-secondary mb-3">{t("empty")}</h1>
          <p className="text-gray-500 mb-8 leading-relaxed">
            {locale === "ar" ? "لم تقم بإضافة أي منتجات بعد. ابدأ التسوق واكتشف تشكيلتنا الفاخرة" : "You haven't added any products yet. Start shopping and discover our luxury collection"}
          </p>
          <Link href={L("/products")}
            className="inline-flex items-center gap-2 bg-gold text-secondary px-8 py-4 rounded-xl font-semibold hover:bg-gold-dark transition-all shadow-lg shadow-gold/20 hover:shadow-gold/40">
            <ShoppingBag size={18} />
            {t("continueShopping")}
          </Link>

          <div className="flex items-center justify-center gap-8 mt-12 text-gray-400">
            {[{ icon: Shield, text: locale === "ar" ? "دفع آمن" : "Secure Payment" },
              { icon: Truck, text: locale === "ar" ? "شحن سريع" : "Fast Shipping" },
              { icon: RotateCcw, text: locale === "ar" ? "إرجاع سهل" : "Easy Returns" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5">
                <item.icon size={18} />
                <span className="text-xs">{item.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-light min-h-[70vh] py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="font-playfair text-3xl font-bold text-secondary">{t("title")}</h1>
          <p className="text-gray-500 mt-1">
            {locale === "ar" ? `${items.length} منتجات في سلتك` : `${items.length} items in your cart`}
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart items */}
          <StaggerContainer className="lg:col-span-2 space-y-3" staggerDelay={0.06}>
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <StaggerItem key={item.id}>
                  <motion.div layout exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
                    className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all border border-gray-50">
                    <div className="flex gap-4">
                      {/* Product image */}
                      <Link href={L(`/products/${item.slug}`)} className="flex-shrink-0">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-xl overflow-hidden hover:scale-105 transition-transform">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <DiamondIcon size={32} className="text-gold/40" />
                            </div>
                          )}
                        </div>
                      </Link>

                      {/* Product info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start gap-2 mb-1">
                          <Link href={L(`/products/${item.slug}`)}>
                            <h3 className="font-semibold text-secondary hover:text-gold transition-colors line-clamp-1">{item.name}</h3>
                          </Link>
                          <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                            onClick={() => { removeItem(item.id); addToast(locale === "ar" ? "تمت إزالة المنتج" : "Item removed"); }}
                            className="text-gray-300 hover:text-red-500 transition-colors p-1 flex-shrink-0">
                            <Trash2 size={16} />
                          </motion.button>
                        </div>

                        <p className="text-sm text-gray-500 mb-3">
                          {locale === "ar" ? `عيار ${item.karat}` : `${item.karat}K`} · {item.weight}g
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 bg-gray-50 rounded-lg p-0.5">
                            <motion.button whileTap={{ scale: 0.85 }}
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-white transition-colors disabled:opacity-30">
                              <Minus size={14} />
                            </motion.button>
                            <span className="w-10 text-center font-semibold text-sm">{item.quantity}</span>
                            <motion.button whileTap={{ scale: 0.85 }}
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                              className="w-8 h-8 rounded-md flex items-center justify-center hover:bg-white transition-colors disabled:opacity-30">
                              <Plus size={14} />
                            </motion.button>
                          </div>
                          <p className="font-bold text-secondary text-lg">
                            {(item.price * item.quantity).toLocaleString()}
                            <span className="text-sm font-normal text-gray-500 ms-1">د.م</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </AnimatePresence>
          </StaggerContainer>

          {/* Order summary */}
          <FadeIn direction="left" delay={0.3}>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-6 shadow-sm sticky top-24 border border-gray-50">
                <h2 className="font-semibold text-secondary text-lg mb-5 pb-4 border-b border-gray-100">
                  {locale === "ar" ? "ملخص الطلب" : "Order Summary"}
                </h2>

                {/* Coupon */}
                <div className="mb-5">
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input type="text" placeholder={t("coupon")} value={coupon} onChange={(e) => setCoupon(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-sm transition-all bg-gray-50 focus:bg-white" />
                    </div>
                    <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={applyCoupon} disabled={couponLoading}
                      className="bg-secondary text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
                      {couponLoading ? "..." : t("apply")}
                    </motion.button>
                  </div>
                </div>

                {/* Summary lines */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("subtotal")}</span>
                    <span className="font-medium">{subtotal.toLocaleString()} د.م</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("shipping")}</span>
                    <span className="font-medium">
                      {shipping === 0 ? (
                        <span className="text-green-600">{locale === "ar" ? "مجاني" : "Free"}</span>
                      ) : `${shipping} د.م`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{t("tax")}</span>
                    <span className="font-medium">{tax.toLocaleString()} د.م</span>
                  </div>
                  {discount > 0 && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                      className="flex justify-between text-green-600">
                      <span>{locale === "ar" ? "خصم الكوبون" : "Coupon Discount"}</span>
                      <span className="font-medium">-{discount.toLocaleString()} د.م</span>
                    </motion.div>
                  )}
                  <div className="border-t border-gray-100 pt-3 flex justify-between items-center">
                    <span className="font-semibold text-secondary">{t("total")}</span>
                    <motion.span key={total} initial={{ scale: 1.2, color: "#D4AF37" }} animate={{ scale: 1, color: "#D4AF37" }}
                      className="font-bold text-gold text-xl">{total.toLocaleString()} د.م</motion.span>
                  </div>
                </div>

                <Link href={L("/checkout")}
                  className="flex items-center justify-center gap-2 w-full bg-gold text-secondary py-4 rounded-xl font-semibold text-center hover:bg-gold-dark transition-all mt-6 shadow-lg shadow-gold/20 hover:shadow-gold/40">
                  {t("checkout")}
                  <ArrowRight size={18} />
                </Link>
                <Link href={L("/products")} className="flex items-center justify-center text-gold hover:text-gold-dark text-sm mt-4 transition-colors font-medium">
                  {t("continueShopping")}
                </Link>

                {/* Trust indicators */}
                <div className="mt-6 pt-5 border-t border-gray-100 space-y-3">
                  {[
                    { icon: Shield, text: locale === "ar" ? "دفع آمن ومشفر" : "Secure & Encrypted Payment" },
                    { icon: Truck, text: locale === "ar" ? "شحن مجاني فوق 5000 د.م" : "Free shipping over 5,000 MAD" },
                    { icon: Package, text: locale === "ar" ? "تغليف فاخر هدية" : "Luxury Gift Packaging" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-gray-500">
                      <item.icon size={14} className="text-gold flex-shrink-0" />
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
