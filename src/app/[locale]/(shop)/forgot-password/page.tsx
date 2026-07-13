"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaLogo } from "@/components/icons";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate sending
    setTimeout(() => { setSent(true); setLoading(false); }, 1500);
  };

  return (
    <div className="min-h-screen bg-light flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <FaLogo size={48} className="text-gold mx-auto mb-4" />
            <h1 className="font-playfair text-2xl font-bold text-secondary">نسيت كلمة المرور</h1>
            <p className="text-gray-500 text-sm mt-2">أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة التعيين</p>
          </div>

          {sent ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="font-semibold text-secondary mb-2">تم الإرسال!</h3>
              <p className="text-gray-500 text-sm">تحقق من بريدك الإلكتروني للحصول على رابط إعادة تعيين كلمة المرور</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">البريد الإلكتروني</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all"
                  placeholder="email@example.com" dir="ltr" />
              </div>
              <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                className="w-full bg-gold text-secondary py-3.5 rounded-xl font-semibold hover:bg-gold-dark transition-all disabled:opacity-50 shadow-lg shadow-gold/20">
                {loading ? "جاري الإرسال..." : "إرسال رابط إعادة التعيين"}
              </motion.button>
              <p className="text-center text-sm text-gray-500 mt-4">
                <a href="/login" className="text-gold hover:text-gold-dark font-medium">العودة لتسجيل الدخول</a>
              </p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
