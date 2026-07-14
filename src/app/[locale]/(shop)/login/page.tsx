"use client";

import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Eye, EyeOff, Loader2, ArrowLeft, Lock, Mail, Shield } from "lucide-react";
import { FaLogo } from "@/components/icons";
import { motion } from "framer-motion";

export default function LoginPage() {
  const t = useTranslations("auth.login");
  const locale = useLocale();
  const L = (href: string) => `/${locale}${href === "/" ? "" : href}`;
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });
      if (result?.error) {
        setError(locale === "ar" ? "البريد الإلكتروني أو كلمة المرور غير صحيحة" : locale === "fr" ? "Email ou mot de passe incorrect" : "Invalid email or password");
        return;
      }
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      const role = sessionData?.user?.role;
      if (role === "ADMIN" || role === "SUPER_ADMIN") {
        router.push(L("/admin/dashboard"));
      } else {
        router.push(L("/"));
      }
      router.refresh();
    } catch {
      setError(locale === "ar" ? "حدث خطأ في الاتصال بالخادم" : "Server connection error");
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
              <Shield size={24} className="text-gold mx-auto mb-2" />
              <p className="text-xs">{locale === "ar" ? "آمن 100%" : "100% Secure"}</p>
            </div>
            <div className="text-center">
              <Lock size={24} className="text-gold mx-auto mb-2" />
              <p className="text-xs">{locale === "ar" ? "خصوصية محمية" : "Privacy Protected"}</p>
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

          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="font-playfair text-3xl font-bold text-secondary mb-2">{t("title")}</h1>
            <p className="text-gray-500 mb-8">
              {locale === "ar" ? "مرحباً بعودتك" : locale === "fr" ? "Bon retour parmi nous" : "Welcome back"}
            </p>
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl mb-6 border border-red-100 flex items-center gap-2"
            >
              <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t("email")}</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email" required value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-white"
                  placeholder="email@example.com" dir="ltr"
                />
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
              <label className="block text-sm font-medium text-gray-700 mb-2">{t("password")}</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"} required value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-3.5 border border-gray-200 rounded-xl focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all bg-white"
                  placeholder="••••••••" dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            <div className="flex items-center justify-end">
              <Link href={L("/forgot-password")} className="text-sm text-gold hover:text-gold-dark transition-colors font-medium">
                {t("forgotPassword")}
              </Link>
            </div>

            <motion.button
              type="submit" disabled={loading}
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="w-full bg-gold text-secondary py-4 rounded-xl font-semibold hover:bg-gold-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-gold/20 hover:shadow-gold/40 text-base"
            >
              {loading ? (
                <><Loader2 size={18} className="animate-spin" /> {locale === "ar" ? "جاري الدخول..." : "Signing in..."}</>
              ) : t("submit")}
            </motion.button>
          </form>

          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-sm text-gray-400 font-medium">{t("or")}</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <motion.button
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            onClick={() => signIn("google", { callbackUrl: "/" })}
            className="w-full border-2 border-gray-200 py-3.5 rounded-xl font-medium hover:bg-white hover:border-gray-300 transition-all flex items-center justify-center gap-3 bg-white"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            {t("google")}
          </motion.button>

          <p className="text-center mt-8 text-sm text-gray-500">
            {t("noAccount")}{" "}
            <Link href={L("/register")} className="text-gold hover:text-gold-dark font-semibold transition-colors">
              {t("register")}
            </Link>
          </p>

          <Link href={L("/")} className="flex items-center justify-center gap-2 mt-6 text-sm text-gray-400 hover:text-gray-600 transition-colors">
            <ArrowLeft size={14} />
            {locale === "ar" ? "العودة للرئيسية" : "Back to home"}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
