"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaLogo } from "@/components/icons";
import { Mail, ArrowLeft, Loader2, CheckCircle, Lock, Shield } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const locale = useLocale();
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setSent(true);
    } catch {
      setSent(true); // Still show success to prevent email enumeration
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 30% 50%, rgba(212,175,55,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(212,175,55,0.1) 0%, transparent 40%)"
        }} />
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-gold/20 rotate-45"
            style={{ left: `${15 + i * 15}%`, top: `${20 + (i % 3) * 25}%` }}
            animate={{ rotate: [45, 225, 45], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 6 + i, repeat: Infinity, ease: "linear" }}
          />
        ))}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="relative z-10 text-center px-12"
        >
          <FaLogo size={72} className="text-gold mx-auto mb-8" />
          <h2 className="font-playfair text-3xl font-bold text-white mb-4">
            {locale === "ar" ? "فيلالي عديب" : "Filali Adib"}
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            {locale === "ar" ? "حرفي مجوهرات | ARTISTE JOAILLIER" : "Artiste Joaillier"}
          </p>
          <div className="flex items-center justify-center gap-8 text-gray-500">
            <div className="text-center">
              <Lock size={24} className="text-gold mx-auto mb-2" />
              <p className="text-xs">{locale === "ar" ? "استعادة آمنة" : "Secure Recovery"}</p>
            </div>
            <div className="text-center">
              <Shield size={24} className="text-gold mx-auto mb-2" />
              <p className="text-xs">{locale === "ar" ? "حماية الحساب" : "Account Protection"}</p>
            </div>
          </div>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      </div>

      {/* Right panel - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-light">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden mb-8 text-center">
            <FaLogo size={48} className="text-gold mx-auto mb-4" />
          </div>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <h1 className="font-playfair text-3xl font-bold text-secondary mb-2">
              {locale === "ar" ? "نسيت كلمة المرور؟" : "Forgot Password?"}
            </h1>
            <p className="text-gray-500 mb-8">
              {locale === "ar" ? "لا تقلق، سنرسل لك رابطاً لإعادة تعيين كلمة المرور" : "No worries, we'll send you a link to reset your password"}
            </p>
          </motion.div>

          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <CheckCircle size={40} className="text-green-500" />
              </motion.div>
              <h3 className="font-semibold text-secondary text-lg mb-2">
                {locale === "ar" ? "تم الإرسال!" : "Email Sent!"}
              </h3>
              <p className="text-gray-500 text-sm mb-6">
                {locale === "ar"
                  ? "تحقق من بريدك الإلكتروني للحصول على رابط إعادة تعيين كلمة المرور"
                  : "Check your email for a password reset link"}
              </p>
              <button
                onClick={() => setSent(false)}
                className="text-gold hover:text-gold-dark font-medium text-sm transition-colors"
              >
                {locale === "ar" ? "إعادة الإرسال" : "Resend Email"}
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {locale === "ar" ? "البريد الإلكتروني" : "Email Address"}
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email" required value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-white"
                    placeholder="email@example.com" dir="ltr"
                  />
                </div>
              </motion.div>

              <motion.button
                type="submit" disabled={loading}
                whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                className="w-full bg-gold text-secondary py-4 rounded-xl font-semibold hover:bg-gold-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-gold/20 hover:shadow-gold/40 text-base"
              >
                {loading ? (
                  <><Loader2 size={18} className="animate-spin" /> {locale === "ar" ? "جاري الإرسال..." : "Sending..."}</>
                ) : (
                  locale === "ar" ? "إرسال رابط إعادة التعيين" : "Send Reset Link"
                )}
              </motion.button>
            </form>
          )}

          <Link href={L("/login")} className="flex items-center justify-center gap-2 mt-6 text-sm text-gold hover:text-gold-dark transition-colors font-medium">
            <ArrowLeft size={14} />
            {locale === "ar" ? "العودة لتسجيل الدخول" : "Back to Login"}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
