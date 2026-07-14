"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { FaLogo } from "@/components/icons";
import { Lock, Eye, EyeOff, Loader2, ArrowLeft, CheckCircle, Shield } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const locale = useLocale();
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const userId = searchParams.get("userId");

  const t = (ar: string, fr: string) => locale === "ar" ? ar : fr;
  const successTitle = locale === "ar" ? "تم إعادة التعيين!" : "Password Reset!";
  const successMessage = locale === "ar" ? "تم تغيير كلمة المرور بنجاح. جاري التحويل..." : "Password changed successfully. Redirecting...";

  if (!token || !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-light">
        <div className="text-center max-w-md px-4">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Lock size={28} className="text-red-400" />
          </div>
          <h1 className="font-playfair text-2xl font-bold text-secondary mb-2">{t("رابط غير صالح", "Invalid Link")}</h1>
          <p className="text-gray-500 mb-6">{t("رابط إعادة تعيين كلمة المرور غير صالح أو منتهي الصلاحية", "This reset link is invalid or expired")}</p>
          <Link href={L("/forgot-password")} className="bg-gold text-secondary px-6 py-3 rounded-xl font-semibold hover:bg-gold-dark transition-all inline-flex items-center gap-2">
            {t("طلب رابط جديد", "Request New Link")}
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password.length < 8) {
      setError(t("كلمة المرور يجب أن تكون 8 أحرف على الأقل", "Password must be at least 8 characters"));
      return;
    }
    if (password !== confirm) {
      setError(t("كلمتا المرور غير متطابقتين", "Passwords do not match"));
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, userId, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || t("خطأ", "Error"));
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push(L("/login")), 3000);
    } catch {
      setError(t("خطأ في الاتصال", "Connection error"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0" style={{
          backgroundImage: "radial-gradient(circle at 30% 50%, rgba(212,175,55,0.15) 0%, transparent 50%), radial-gradient(circle at 70% 80%, rgba(212,175,55,0.1) 0%, transparent 40%)"
        }} />
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }} className="relative z-10 text-center px-12">
          <FaLogo size={72} className="text-gold mx-auto mb-8" />
          <h2 className="font-playfair text-3xl font-bold text-white mb-4">
            {t("فيلالي عديب", "Filali Adib")}
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            {t("حرفي مجوهرات | ARTISTE JOAILLIER", "Artiste Joaillier")}
          </p>
          <div className="flex items-center justify-center gap-8 text-gray-500">
            <div className="text-center">
              <Lock size={24} className="text-gold mx-auto mb-2" />
              <p className="text-xs">{t("كلمة مرور آمنة", "Secure Password")}</p>
            </div>
            <div className="text-center">
              <Shield size={24} className="text-gold mx-auto mb-2" />
              <p className="text-xs">{t("حماية الحساب", "Account Protection")}</p>
            </div>
          </div>
        </motion.div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
      </div>

      {/* Right panel - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12 bg-light">
        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.4, 0.25, 1] }} className="w-full max-w-md">

          <div className="lg:hidden mb-8 text-center">
            <FaLogo size={48} className="text-gold mx-auto mb-4" />
          </div>

          {success ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-500" />
              </motion.div>
              <h3 className="font-semibold text-secondary text-lg mb-2">{successTitle}</h3>
              <p className="text-gray-500 text-sm mb-6">{successMessage}</p>
            </motion.div>
          ) : (
            <>
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h1 className="font-playfair text-3xl font-bold text-secondary mb-2">
                  {t("إعادة تعيين كلمة المرور", "Reset Password")}
                </h1>
                <p className="text-gray-500 mb-8">
                  {t("أدخل كلمة المرور الجديدة", "Enter your new password")}
                </p>
              </motion.div>

              {error && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-4 border border-red-100">
                  {error}
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t("كلمة المرور الجديدة", "New Password")}</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type={showPassword ? "text" : "password"} required value={password}
                      onChange={(e) => setPassword(e.target.value)} minLength={8}
                      className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-white"
                      placeholder="••••••••" dir="ltr" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">{t("تأكيد كلمة المرور", "Confirm Password")}</label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="password" required value={confirm}
                      onChange={(e) => setConfirm(e.target.value)} minLength={8}
                      className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-white"
                      placeholder="••••••••" dir="ltr" />
                  </div>
                </motion.div>

                <motion.button type="submit" disabled={loading}
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
                  className="w-full bg-gold text-secondary py-4 rounded-xl font-semibold hover:bg-gold-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-gold/20 hover:shadow-gold/40 text-base">
                  {loading ? (
                    <><Loader2 size={18} className="animate-spin" /> {t("جاري الحفظ...", "Saving...")}</>
                  ) : (
                    t("إعادة تعيين كلمة المرور", "Reset Password")
                  )}
                </motion.button>
              </form>
            </>
          )}

          <Link href={L("/login")} className="flex items-center justify-center gap-2 mt-6 text-sm text-gold hover:text-gold-dark transition-colors font-medium">
            <ArrowLeft size={14} />
            {t("العودة لتسجيل الدخول", "Back to Login")}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
