"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle, Package, ArrowLeft, MessageCircle, Truck, CreditCard, Phone, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/motion";
import { WHATSAPP_URL } from "@/lib/constants";

export default function OrderSuccessPage() {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const num = params.get("order");
    setOrderNumber(num || "FA-" + Date.now().toString(36).toUpperCase());
  }, []);

  const steps = [
    { icon: CheckCircle, label: locale === "ar" ? "تم استلام الطلب" : "Order Received", desc: locale === "ar" ? "تم تأكيد طلبك بنجاح" : "Your order has been confirmed", time: locale === "ar" ? "الآن" : "Now" },
    { icon: Phone, label: locale === "ar" ? "تأكيد الطلب" : "Order Confirmation", desc: locale === "ar" ? "سنتواصل معك للتأكيد" : "We'll contact you to confirm", time: locale === "ar" ? "خلال ساعة" : "Within 1 hour" },
    { icon: Package, label: locale === "ar" ? "تجهيز الطلب" : "Preparing Order", desc: locale === "ar" ? "يتم تجهيز منتجاتك" : "Your products are being prepared", time: "1-2 " + (locale === "ar" ? "يوم عمل" : "business days") },
    { icon: Truck, label: locale === "ar" ? "التوصيل" : "Delivery", desc: locale === "ar" ? "توصيل طلبك لباب بيتك" : "Delivered to your doorstep", time: "2-5 " + (locale === "ar" ? "أيام عمل" : "business days") },
  ];

  return (
    <div className="bg-light min-h-[80vh] flex items-center justify-center py-12">
      <div className="container mx-auto px-4 max-w-2xl text-center">
        {/* Success animation */}
        <FadeIn direction="up">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="relative w-28 h-28 mx-auto mb-6"
          >
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-green-500/20 rounded-full"
            />
            <div className="relative w-28 h-28 bg-green-50 rounded-full flex items-center justify-center">
              <motion.div
                initial={{ pathLength: 0 }}
                animate={{ rotate: 360 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <CheckCircle size={56} className="text-green-500" strokeWidth={1.5} />
              </motion.div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-playfair text-3xl font-bold text-secondary mb-3"
          >
            {locale === "ar" ? "تم تأكيد طلبك بنجاح!" : "Order Confirmed!"}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-gray-500 mb-2"
          >
            {locale === "ar" ? "شكراً لك على الشراء من فيلالي عديب" : "Thank you for shopping with Filali Adib"}
          </motion.p>
          {orderNumber && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="inline-flex items-center gap-2 bg-gold/10 text-gold font-bold text-lg px-6 py-2 rounded-full mb-8"
            >
              {locale === "ar" ? "رقم الطلب" : "Order #"}: {orderNumber}
            </motion.p>
          )}

          {/* Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-2xl shadow-sm p-6 mb-8 text-start border border-gray-50"
          >
            <h2 className="font-semibold text-secondary mb-6 flex items-center gap-2">
              <Clock size={18} className="text-gold" />
              {locale === "ar" ? "ماذا بعد؟" : "What's Next?"}
            </h2>
            <div className="space-y-0">
              {steps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      i === 0 ? "bg-green-500 text-white" : "bg-gray-100 text-gray-400"
                    }`}>
                      <step.icon size={18} />
                    </div>
                    {i < steps.length - 1 && (
                      <div className={`w-0.5 h-8 ${i === 0 ? "bg-green-200" : "bg-gray-200"}`} />
                    )}
                  </div>
                  <div className="pb-4 flex-1">
                    <div className="flex items-center justify-between">
                      <p className={`font-medium text-sm ${i === 0 ? "text-green-600" : "text-secondary"}`}>{step.label}</p>
                      <span className="text-xs text-gray-400">{step.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={L("/products")}
              className="inline-flex items-center justify-center gap-2 bg-gold text-secondary px-8 py-4 rounded-xl font-semibold hover:bg-gold-dark transition-all shadow-lg shadow-gold/20 hover:shadow-gold/40">
              <ArrowLeft size={18} className={locale === "ar" ? "rotate-180" : ""} />
              {locale === "ar" ? "متابعة التسوق" : "Continue Shopping"}
            </Link>
            <a href={`${WHATSAPP_URL}?text=${encodeURIComponent(locale === "ar" ? `مرحباً، لدي طلب برقم ${orderNumber}` : `Hello, I have order #${orderNumber}`)}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition-all shadow-md">
              <MessageCircle size={18} />
              {locale === "ar" ? "تواصل معنا عبر واتساب" : "Contact via WhatsApp"}
            </a>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
