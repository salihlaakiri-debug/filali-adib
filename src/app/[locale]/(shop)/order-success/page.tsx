"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle, Package, ArrowLeft, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/motion";

const WHATSAPP_NUMBER = "212644690861";

export default function OrderSuccessPage() {
  const t = useTranslations("checkout");
  const locale = useLocale();
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;
  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    const num = "FA-" + Date.now().toString(36).toUpperCase();
    setOrderNumber(num);
  }, []);

  return (
    <div className="bg-light min-h-[80vh] flex items-center justify-center py-12">
      <div className="container mx-auto px-4 max-w-lg text-center">
        <FadeIn direction="up">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
            <CheckCircle size={80} className="text-green-500 mx-auto mb-6" />
          </motion.div>

          <h1 className="font-playfair text-3xl font-bold text-secondary mb-3">تم تأكيد طلبك بنجاح!</h1>
          <p className="text-gray-500 mb-2">شكراً لك على الشراء من فيلالي عديب</p>
          {orderNumber && (
            <p className="text-gold font-bold text-lg mb-8">رقم الطلب: {orderNumber}</p>
          )}

          <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 text-right">
            <div className="flex items-center gap-3 mb-4">
              <Package className="text-gold" size={20} />
              <h2 className="font-semibold text-secondary">ماذا بعد؟</h2>
            </div>
            <ul className="space-y-3 text-gray-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-gold mt-0.5">1.</span>
                <span>سنقوم بمراجعة طلبك والتواصل معك للتأكيد</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-0.5">2.</span>
                <span>يتم تجهيز طلبك للشحن خلال 1-2 يوم عمل</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-0.5">3.</span>
                <span>ستتلقى رسالة واتساب بتفاصيل الشحن والتتبع</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gold mt-0.5">4.</span>
                <span>التوصيل خلال 2-5 أيام عمل داخل المغرب</span>
              </li>
            </ul>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href={L("/products")}
              className="inline-flex items-center justify-center gap-2 bg-gold text-secondary px-6 py-3 rounded-lg font-semibold hover:bg-gold-dark transition-all shadow-lg shadow-gold/20">
              <ArrowLeft size={18} /> متابعة التسوق
            </Link>
            <a href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`مرحباً، لدي طلب برقم ${orderNumber}`)}`}
              target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-all shadow-md">
              <MessageCircle size={18} /> تواصل معنا
            </a>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
