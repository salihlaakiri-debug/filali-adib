"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, Tag } from "lucide-react";
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
    if (!coupon.trim()) { addToast("أدخل كود الكوبون"); return; }
    setCouponLoading(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: coupon, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) { addToast(data.error || "كود غير صحيح"); setDiscount(0); return; }
      setDiscount(data.discount);
      addToast(`تم تطبيق الكوبون - خصم ${data.discount.toLocaleString()} د.م`);
    } catch { addToast("حدث خطأ"); setDiscount(0); } finally { setCouponLoading(false); }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ShoppingBag size={64} className="text-gray-300 mx-auto mb-4" />
          </motion.div>
          <h1 className="font-playfair text-2xl font-bold text-secondary mb-2">{t("empty")}</h1>
          <Link href={L("/products")}
            className="inline-block bg-gold text-secondary px-6 py-3 rounded-xl font-semibold hover:bg-gold-dark transition-all mt-4 shadow-lg shadow-gold/20">
            {t("continueShopping")}
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-light min-h-[60vh] py-12">
      <div className="container mx-auto px-4">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="font-playfair text-3xl font-bold text-secondary mb-8">
          {t("title")}
        </motion.h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <StaggerContainer className="lg:col-span-2 space-y-4" staggerDelay={0.08}>
            <AnimatePresence mode="popLayout">
              {items.map((item) => (
                <StaggerItem key={item.id}>
                  <motion.div layout exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
                    className="bg-white rounded-xl p-6 shadow-sm flex gap-4 hover:shadow-md transition-shadow">
                    <Link href={L(`/products/${item.slug}`)}>
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden hover:scale-105 transition-transform">
                        <DiamondIcon size={32} className="text-gold/40" />
                      </div>
                    </Link>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <Link href={L(`/products/${item.slug}`)}>
                            <h3 className="font-semibold text-secondary hover:text-gold transition-colors">{item.name}</h3>
                          </Link>
                          <p className="text-sm text-gray-500">عيار {item.karat} - {item.weight}غ</p>
                        </div>
                        <motion.button whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
                          onClick={() => { removeItem(item.id); addToast("تمت إزالة المنتج من السلة"); }}
                          className="text-gray-400 hover:text-red-500 transition-colors p-1">
                          <Trash2 size={18} />
                        </motion.button>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <motion.button whileTap={{ scale: 0.85 }}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <Minus size={14} />
                          </motion.button>
                          <span className="w-8 text-center font-medium">{item.quantity}</span>
                          <motion.button whileTap={{ scale: 0.85 }}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <Plus size={14} />
                          </motion.button>
                        </div>
                        <p className="font-bold text-secondary">
                          {(item.price * item.quantity).toLocaleString()} د.م
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </AnimatePresence>
          </StaggerContainer>

          <FadeIn direction="left" delay={0.3}>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
                <h2 className="font-semibold text-secondary text-lg mb-6">ملخص الطلب</h2>

                <div className="flex gap-2 mb-6">
                  <div className="flex-1 relative">
                    <Tag size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" placeholder={t("coupon")} value={coupon} onChange={(e) => setCoupon(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 text-sm transition-all" />
                  </div>
                  <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                    onClick={applyCoupon} disabled={couponLoading}
                    className="bg-secondary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors disabled:opacity-50">
                    {couponLoading ? "..." : t("apply")}
                  </motion.button>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between"><span className="text-gray-600">{t("subtotal")}</span><span className="font-medium">{subtotal.toLocaleString()} د.م</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">{t("shipping")}</span><span className="font-medium">{shipping === 0 ? <span className="text-green-600">مجاني</span> : `${shipping} د.م`}</span></div>
                <div className="flex justify-between"><span className="text-gray-600">{t("tax")}</span><span className="font-medium">{tax.toLocaleString()} د.م</span></div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600"><span>خصم الكوبون</span><span className="font-medium">-{discount.toLocaleString()} د.م</span></div>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                    <span className="font-semibold text-secondary">{t("total")}</span>
                    <motion.span key={total} initial={{ scale: 1.2, color: "#D4AF37" }} animate={{ scale: 1, color: "#D4AF37" }}
                      className="font-bold text-gold text-lg">{total.toLocaleString()} د.م</motion.span>
                  </div>
                </div>

                <Link href={L("/checkout")}
                  className="block w-full bg-gold text-secondary py-3 rounded-lg font-semibold text-center hover:bg-gold-dark transition-all mt-6 shadow-lg shadow-gold/20 hover:shadow-gold/40">
                  {t("checkout")}
                </Link>
                <Link href={L("/products")} className="block text-center text-gold hover:text-gold-dark text-sm mt-4 transition-colors">
                  {t("continueShopping")}
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
}
